import { WebSocketServer } from "ws";
import { ConnectionsMap } from "./connections";

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

  const { urlName, chargingStation } = data;

  // Handle messages from the client
  ws.on("message", (msg) => {
    try {
      const msgStr = msg.toString("utf8");
      const messageObj = JSON.parse(msgStr);
      console.log(messageObj);
    } catch (error) {
      console.error(error);
    }
  });

  ws.on("close", (code, reason) => {
    console.log(
      `Connection closed. Code: ${code}, Reason: ${reason.toString("utf8")}`,
    );

    // Remove from map
    ConnectionsMap.delete(ws);
  });
});
