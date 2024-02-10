import { z } from "zod";
import {
  CallActionPayloadSchemas,
  CallActions,
  CallResultPayloadSchemas,
} from "./v2.0.1/schemas-and-types";
import { ConnectionData } from "./connections";

export const CallErrorCodesSchema = z.enum([
  "FormatViolation",
  "GenericError",
  "InternalError",
  "MessageTypeNotSupported",
  "NotImplemented",
  "NotSupported",
  "OccurrenceConstraintViolation",
  "PropertyConstraintViolation",
  "ProtocolError",
  "RpcFrameworkError",
  "SecurityError",
  "TypeConstraintViolation",
]);

export type CallResultSender<A extends CallActions> = (
  message: z.infer<(typeof CallResultPayloadSchemas)[A]>,
) => Promise<void>;

export type CallErrorSender = (
  errCode: z.infer<typeof CallErrorCodesSchema>,
  errMessage?: string,
  errDetails?: object,
) => Promise<void>;

export type CallHandler<A extends CallActions = "Authorize"> = (
  details: ConnectionData,
  payload: z.infer<(typeof CallActionPayloadSchemas)[A]>,
  sendResult: CallResultSender<A>,
  sendError: CallErrorSender,
) => void;

// const MessageIdSchema = z.string().min(1).max(36);

// const CallLooseSchema = z.tuple([
//   z.literal(2),
//   MessageIdSchema,
//   CallActionsSchema,
//   z.any(),
// ]);

// export const CallResultLooseSchema = z.tuple([
//   z.literal(3),
//   MessageIdSchema,
//   z.any(),
// ]);

// export type CallResultLooseType = z.infer<typeof CallResultLooseSchema>;

// export const CallErrorSchema = z.tuple([
//   z.literal(4),
//   MessageIdSchema,
//   CallErrorCodesSchema,
//   z.string().max(255),
//   z.any(),
// ]);

// export type CallErrorType = z.infer<typeof CallErrorSchema>;

// export const OCPPMessageStringLooseSchema = z.union([
//   CallLooseSchema,
//   CallResultLooseSchema,
//   CallErrorSchema,
// ]);
