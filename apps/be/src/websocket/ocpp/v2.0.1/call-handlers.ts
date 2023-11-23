import { prisma } from "@zigbolt/prisma";
import { type OCPPRouter } from "../router";

/**
 * Given OCPP router instance, it will attach call handlers to it
 * @param router
 */
export function AttachCallHandlers(router: OCPPRouter) {
  router.attachCallHandler(
    "BootNotification",
    async (details, payload, sendResult, sendError) => {
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

  return router;
}
