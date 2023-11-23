import { prisma } from "@zigbolt/prisma";
import { type OCPPRouter } from "../router";
import { CallResultPayloadSchemas } from "./schemas-and-types";
import { z } from "zod";

type AuthorizationStatusType = z.infer<
  typeof CallResultPayloadSchemas.Authorize
>["idTokenInfo"]["status"];

/**
 * Given OCPP router instance, it will attach call handlers to it
 * @param router
 */
export function AttachCallHandlers(router: OCPPRouter) {
  router.attachCallHandler(
    "BootNotification",
    async (details, payload, sendResult) => {
      const { chargingStation, reason } = payload;

      // Update data
      await prisma.chargingStation.update({
        where: {
          id: details.chargingStation.id,
        },
        data: {
          lastBootNotifTime: new Date(),
          lastBootNotifReason: reason,
          serialNumber: chargingStation.serialNumber,
          model: chargingStation.model,
          vendorName: chargingStation.vendorName,
          firmwareVersion: chargingStation.firmwareVersion,
          modem_iccid: chargingStation.modem?.iccid,
          modem_imsi: chargingStation.modem?.imsi,
        },
      });

      // Check if accepted
      const cs = await prisma.chargingStation.findUnique({
        where: { id: details.chargingStation.id },
        select: { is_active: true },
      });

      sendResult({
        currentTime: new Date().toUTCString(),
        interval: 60 * 5, // sec
        status: cs?.is_active ? "Accepted" : "Rejected",
      });
    },
  );

  router.attachCallHandler(
    "Authorize",
    async (details, payload, sendResult, sendError) => {
      const {
        idToken: { idToken, type },
      } = payload;

      switch (type) {
        case "Central":
        case "ISO14443":
        case "ISO15693": {
          const dbIdToken = await prisma.idToken.findUnique({
            where: {
              token_orgId: {
                orgId: details.chargingStation.orgId,
                token: idToken,
              },
            },
            include: {
              Driver: true,
            },
          });

          let status: AuthorizationStatusType = "Unknown";
          let message = "";

          if (!dbIdToken) {
            status = "Unknown";
            message = "We are not able to identify you.";
          } else if (!dbIdToken.is_active) {
            status = "Blocked";
            message = "The card is not active. Please use another card.";
          } else if (!dbIdToken.Driver.is_active) {
            status = "Blocked";
            message = "You are banned! Please contact support.";
          } else {
            status = "Accepted";
            message = `Welcome to ${details.chargingStation.Org.name}. We hope you have a pleasant charging experience.`;
          }

          sendResult({
            idTokenInfo: {
              status,
              personalMessage: {
                format: "UTF8",
                content: `Hi ${dbIdToken?.Driver.name ?? "there"}, ${message}`,
              },
            },
          });
          break;
        }
        default:
          sendError("GenericError", `Can't use type: ${type}`);
      }
    },
  );

  return router;
}
