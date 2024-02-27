import { prisma } from "@zigbolt/prisma";
import { WebSocket } from "ws";

export type ConnectionData = {
  urlName: string;
  chargingStation: NonNullable<
    Awaited<ReturnType<typeof prisma.chargingStation.findUnique>>
  >;
  version: "ocpp2.0.1";
};

export const ConnectionsMap = new WeakMap<WebSocket, ConnectionData>();
