import Queue from "queue";
import { ConnectionData } from "./connections";
import {
  CallErrorSender,
  CallHandler,
  CallResultSender,
  CallErrorCodesSchema,
} from "./schemas-and-types";
import {
  CallActionPayloadSchemas,
  CallActions,
  CallActionsSchema,
  CallResultPayloadSchemas,
} from "./v2.0.1/schemas-and-types";
import { z } from "zod";
import { v4 as uuid } from "uuid";

type OutGoingCallHandlerFunc = (
  result:
    | {
        type: "callresult";
        payload: object;
      }
    | {
        type: "callerror";
        error: z.infer<typeof CallErrorCodesSchema>;
        message: string;
        details: unknown;
      },
) => void;

/**
 * This is a router that routes incoming CALL to action handlers,
 * incoming CALLRESULT or CALLERROR to their callers, and outgoing
 * CALL, CALLRESULT, and CALLERROR to external websocket connection.
 * */
export class OCPPRouter {
  private CallHandlers = new Map<CallActions, CallHandler>();

  private OutGoingCallHandlers = new Map<string, OutGoingCallHandlerFunc>();

  private CallsQueue = new Queue({
    concurrency: 1,
    autostart: true,
  });

  constructor(
    private data: ConnectionData,
    private messageSender: (msg: string) => Promise<void>,
  ) {}

  /** Handle incoming websocket messages. It can be a CALL, CALLRESULT, CALLERROR, or invalid */
  async handleMessage(rawMessage: string) {
    /** This function will respond with call error if invalid messages are received */
    const callErrorSender =
      (messageId: string): CallErrorSender =>
      (errCode, errMessage, errDetails) => {
        // Prepare the call error
        const callError = [
          4,
          messageId,
          errCode,
          errMessage ?? "",
          errDetails ?? {},
        ];

        // Turn it into string
        const message = JSON.stringify(callError);

        // Send it away!
        return this.messageSender(message);
      };

    let messageObj: unknown;

    try {
      messageObj = JSON.parse(rawMessage);
    } catch (error) {
      // JSON error
      return callErrorSender("-1")(
        "RpcFrameworkError",
        "Invalid JSON object received",
        { received: rawMessage },
      );
    }

    if (!Array.isArray(messageObj)) {
      return callErrorSender("-1")(
        "RpcFrameworkError",
        "Every OCPP message must be a tuple",
        { received: rawMessage },
      );
    }

    const [messageTypeId, messageId] = messageObj;

    if (typeof messageId !== "string") {
      return callErrorSender("-1")(
        "RpcFrameworkError",
        "MessageId must be string",
        { received: messageId },
      );
    }

    if (
      typeof messageTypeId !== "number" ||
      [2, 3, 4].includes(messageTypeId)
    ) {
      return callErrorSender(messageId)("MessageTypeNotSupported");
    }

    // So far so good
    if (messageTypeId === 2) {
      // It is an incoming CALL, so we must forward this to the appropriate handler, and generate a response

      // Ensure we receive a valid Action
      const actionNameParsed = await CallActionsSchema.safeParseAsync(
        messageObj[2],
      );

      if (!actionNameParsed.success) {
        return callErrorSender(messageId)(
          "FormatViolation",
          "Check error details for more information",
          { errors: actionNameParsed.error.errors },
        );
      }

      /** This is 100% a valid action name */
      const actionName = actionNameParsed.data;

      // Check if we received a valid payload for the given action or not
      const payloadParsed = await CallActionPayloadSchemas[
        actionName
      ].safeParseAsync(messageObj[3]);

      if (!payloadParsed.success) {
        return callErrorSender(messageId)(
          "FormatViolation",
          `Invalid payload received for ${actionName}. Check error details for more information.`,
          { errors: payloadParsed.error.errors },
        );
      }

      /** This is the pre-defined handler for this action */
      const handler = this.CallHandlers.get(actionName);

      /** This function will respond with the CALLRESULT for this CALL */
      const callResultSender: CallResultSender<typeof actionName> = (
        resultPayload,
      ) => {
        // Prepare the call result
        const callResult = [3, messageId, resultPayload];

        // Turn it into string
        const message = JSON.stringify(callResult);

        // Send it away!
        return this.messageSender(message);
      };

      if (handler) {
        try {
          handler(
            this.data,
            // @ts-expect-error I am not able to satisfy typescript, but I know it will be fine
            payloadParsed.data,
            callResultSender,
            callErrorSender(messageId),
          );
        } catch (error) {
          console.error(error);

          // The handler threw an error
          return callErrorSender(messageId)(
            "InternalError",
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } else {
        // A handler for this action isn't defined yet
        // Send Not implemented CALLERROR
        callErrorSender(messageId)(
          "NotImplemented",
          `${actionName} isn't supported`,
        );
      }
    } else {
      // CALLRESULT and CALLERROR
      const handler = this.OutGoingCallHandlers.get(messageId);

      if (messageTypeId === 3) {
        // It's a call

        handler?.({ type: "callresult", payload: messageObj[2] });
      } else if (messageTypeId === 4) {
        // It's a call error

        const errorCodeParsed = await CallErrorCodesSchema.safeParseAsync(
          messageObj[2],
        );

        if (errorCodeParsed.success) {
          handler?.({
            type: "callerror",
            error: errorCodeParsed.data,
            message: typeof messageObj[3] === "string" ? messageObj[3] : "",
            details: messageObj[4],
          });
        }
      }

      // Call complete, remove from Map
      this.OutGoingCallHandlers.delete(messageId);
    }
  }

  attachCallHandler<A extends CallActions>(action: A, handler: CallHandler<A>) {
    // @ts-expect-error I am not able to satisfy typescript, but I know it will be fine
    this.CallHandlers.set(action, handler);
  }

  /**
   * Sends a CALL to the chargepoint. Will resolve when a response is received.
   */
  sendCall<A extends CallActions>(
    action: A,
    payload: z.infer<(typeof CallActionPayloadSchemas)[A]>,
  ) {
    type PromiseResolveType =
      | {
          error: null;
          payload: z.infer<(typeof CallResultPayloadSchemas)[A]>;
        }
      | {
          error: z.infer<typeof CallErrorCodesSchema>;
          message: string;
          details: unknown;
          payload: null;
        };

    // Generate a promise. This will be resolve when a response is received from the charger.
    return new Promise<PromiseResolveType>((resolve, reject) => {
      // Prepare the call message
      const messageId = uuid();
      const CALL = JSON.stringify([2, messageId, action, payload]);

      // Push to queue so that no more than one call is sent at once
      this.CallsQueue.push((cb) => {
        // The job is executing, that means all the previous calls have been responded to

        // Set a handler function againts the message id, so that the response can be mapped when it is received.
        this.OutGoingCallHandlers.set(messageId, (result) => {
          if (result.type === "callresult") {
            // Parse the result

            CallResultPayloadSchemas[action]
              .safeParseAsync(result.payload)
              .then((payloadParsed) => {
                if (payloadParsed.success) {
                  resolve({
                    error: null,
                    payload: payloadParsed.data,
                  });
                } else {
                  reject(
                    new Error(
                      `Invalid response received: ${JSON.stringify(
                        result.payload,
                      )}`,
                    ),
                  );
                }

                // Execute the callback, so that the next CALL (if any) can be sent
                cb?.();
              });
          } else {
            resolve({
              error: result.error,
              message: result.message,
              details: result.details,
              payload: null,
            });

            // Execute the callback, so that the next CALL (if any) can be sent
            cb?.();
          }
        });

        // Now send the actual message
        this.messageSender(CALL);
      });
    });
  }
}
