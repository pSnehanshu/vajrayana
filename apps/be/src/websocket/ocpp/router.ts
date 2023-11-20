import { queue } from "async";
import { ConnectionData } from "./connections";
import {
  CallErrorSender,
  CallHandler,
  CallResultSender,
} from "./schemas-and-types";
import {
  CallActionPayloadSchemas,
  CallActions,
  CallActionsSchema,
} from "./v2.0.1/schemas-and-types";

/**
 * This is a router that routes incoming CALL to action handlers,
 * incoming CALLRESULT or CALLERROR to their callers, and outgoing
 * CALL, CALLRESULT, and CALLERROR to external websocket connection.
 * */
export class OCPPRouter {
  private CallHandlers = new Map<CallActions, CallHandler>();

  // private CallsQueue = queue((job, callback) => {
  //   this.data.version;
  // }, 1);

  constructor(
    private data: ConnectionData,
    private messageSender: (msg: string) => Promise<void>,
  ) {}

  async handleMessage(rawMessage: string) {
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

    if (messageTypeId === 2) {
      // CALL
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

      const actionName = actionNameParsed.data;

      const payload = await CallActionPayloadSchemas[actionName].parseAsync(
        messageObj[3],
      );

      const handler = this.CallHandlers.get(actionName);

      const callResultSender: CallResultSender = (resultPayload) => {
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
            // @ts-expect-error I am not able to satisfy typescript, but I know it will be fine
            payload,
            callResultSender,
            callErrorSender(messageId),
          );
        } catch (error) {
          return callErrorSender(messageId)(
            "InternalError",
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } else {
        // Send Not implemented CALLERROR
        callErrorSender(messageId)(
          "NotImplemented",
          `${actionName} isn't supported`,
        );
      }
    } else {
      // CALLRESULT and CALLERROR
    }
  }

  attachCallHandler<A extends CallActions>(action: A, handler: CallHandler<A>) {
    // @ts-expect-error I am not able to satisfy typescript, but I know it will be fine
    this.CallHandlers.set(action, handler);
  }
}
