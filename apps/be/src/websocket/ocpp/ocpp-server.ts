import { WebSocketServer } from "ws";
import { AttachCallHandlers } from "./v2.0.1/call-handlers";
import { ConnectionsMap } from "./connections";
import { OCPPRouter } from "./router";

export const ocppWSS = new WebSocketServer({
  noServer: true,
  handleProtocols(protocols, request) {
    if (protocols.has("ocpp2.0.1")) {
      return "ocpp2.0.1";
    }

    return false;
  },
});

ocppWSS.on("connection", (ws, req) => {
  const data = ConnectionsMap.get(ws);

  if (!data) {
    ws.close();
    return;
  }

  /** A function, that will send the given message */
  const messageSender = (msg: string) =>
    new Promise<void>((resolve, reject) =>
      ws.send(msg, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }),
    );

  const router = new OCPPRouter(data, messageSender);

  // Attach the call handlers
  AttachCallHandlers(router);

  // Handle messages from the client
  ws.on("message", (msg) =>
    router.handleMessage(msg.toString("utf8")).catch((err) => {
      console.error(err);
    }),
  );

  ws.on("close", (code, reason) => {
    console.log(
      `Connection closed. Code: ${code}, Reason: ${reason.toString("utf8")}`,
    );

    // Remove from map
    ConnectionsMap.delete(ws);
  });
});
