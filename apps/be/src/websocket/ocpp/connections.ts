import { Prisma } from "@zigbolt/prisma";
import { WebSocket } from "ws";

type ConnectionData = {
  urlName: string;
  chargingStation: Prisma.ChargingStationGetPayload<{
    include: {
      Org: true;
    };
  }>;
};

export const ConnectionsMap = new WeakMap<WebSocket, ConnectionData>();
