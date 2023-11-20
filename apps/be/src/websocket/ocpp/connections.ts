import { Prisma } from "@zigbolt/prisma";
import { WebSocket } from "ws";

type ConnectionData = {
  urlName: string;
  chargingStation: Prisma.ChargingStationGetPayload<{
    include: {
      Org: true;
    };
  }>;
  version: "ocpp2.0.1";
};

export const ConnectionsMap = new WeakMap<WebSocket, ConnectionData>();
