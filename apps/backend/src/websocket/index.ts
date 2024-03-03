import { Server } from "http";
import { ocppWSS } from "./ocpp/ocpp-server";
import { ConnectionsMap } from "./ocpp/connections";
import { prisma } from "@zigbolt/prisma";

export function CreateWebsocketServer(server: Server) {
  // Event listener for the HTTP server upgrade event
  server.on("upgrade", async (request, socket, head) => {
    socket.on("error", console.error);

    if (!request.url) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy(new Error("url not specified"));
      return;
    }

    // Check path
    if (!request.url.startsWith("/api/ocpp/")) {
      socket.destroy(new Error(`Not found. URL: ${request.url}`));
      return;
    }

    /** The Charging station URL name */
    const urlName = request.url.split("/").at(3);

    if (!urlName) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy(new Error("charging station name not specified"));
      return;
    }

    const chargingStation = await prisma.chargingStation.findUnique({
      where: { urlName },
    });

    if (!chargingStation) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy(new Error("charging station not found"));
      return;
    }

    // Upgrade the connection to a WebSocket connection
    ocppWSS.handleUpgrade(request, socket, head, (ws) => {
      // Ensure only supported protocol
      if (ws.protocol !== "ocpp2.0.1") {
        ws.close(1002, `Recevied protocol: ${ws.protocol}`);
        return;
      }

      // Set connection data
      ConnectionsMap.set(ws, {
        urlName,
        chargingStation,
        version: ws.protocol,
      });

      // Emit connection
      ocppWSS.emit("connection", ws, request);
    });
  });
}
