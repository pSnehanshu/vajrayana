import { Prisma, prisma } from "@zigbolt/prisma";
import { type OCPPRouter } from "../router";
import {
  CallActionPayloadSchemas,
  CallResultPayloadSchemas,
} from "./schemas-and-types";
import { z } from "zod";

type AuthorizationStatusType = z.infer<
  typeof CallResultPayloadSchemas.Authorize
>["idTokenInfo"]["status"];

type IdTokenType = z.infer<
  typeof CallActionPayloadSchemas.Authorize
>["idToken"];

type IdTokenInfoType = NonNullable<
  z.infer<typeof CallResultPayloadSchemas.TransactionEvent>["idTokenInfo"]
>;

type MeterValues = NonNullable<
  z.infer<typeof CallActionPayloadSchemas.TransactionEvent>["meterValue"]
>;

/** Handle authorization of IdToken */
async function AuthorizeIdToken(
  idTokenInput: IdTokenType,
  orgId: string,
  orgName: string,
): Promise<{ idTokenInfo: IdTokenInfoType; tokenId?: string }> {
  const { idToken, type } = idTokenInput;

  switch (type) {
    case "Central":
    case "ISO14443":
    case "ISO15693":
    case "KeyCode": {
      const dbIdToken = await prisma.idToken.findUnique({
        where: {
          orgId_token: {
            orgId,
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
        message = `Welcome to ${orgName}. We hope you have a pleasant charging experience.`;
      }

      return {
        idTokenInfo: {
          status,
          personalMessage: {
            format: "UTF8",
            content: `Hi ${dbIdToken?.Driver.name ?? "there"}, ${message}`,
          },
        },
        tokenId: dbIdToken?.id,
      };
    }
    default:
      return {
        idTokenInfo: {
          status: "Invalid",
          personalMessage: {
            format: "ASCII",
            content: `${type} tokens not supported yet`,
          },
        },
      };
  }
}

async function SaveMeterValues(meterValues: MeterValues, stationId: string) {
  const data: Prisma.MeterSampledValueCreateManyInput[] = [];

  // Loop over it to prepare the data to insert
  meterValues.forEach((meterValue) => {
    meterValue.sampledValue.forEach((sampledValue) => {
      data.push({
        stationId,
        timestamp: meterValue.timestamp,
        value: sampledValue.value,
        context: sampledValue.context,
        measurand: sampledValue.measurand,
        phase: sampledValue.phase,
        location: sampledValue.location,
        unitOfMeasure: sampledValue.unitOfMeasure?.unit,
        unitMultiplier: sampledValue.unitOfMeasure?.multiplier,
        signedData: sampledValue.signedMeterValue?.signedMeterData,
        signingMethod: sampledValue.signedMeterValue?.signingMethod,
        encodingMethod: sampledValue.signedMeterValue?.encodingMethod,
        publicKey: sampledValue.signedMeterValue?.publicKey,
      });
    });
  });

  await prisma.meterSampledValue.createMany({ data });
}

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
    async (details, payload, sendResult) => {
      const { Org } = details.chargingStation;

      const authResponse = await AuthorizeIdToken(
        payload.idToken,
        Org.id,
        Org.name,
      );

      sendResult({ idTokenInfo: authResponse.idTokenInfo });
    },
  );

  router.attachCallHandler(
    "TransactionEvent",
    async (details, payload, sendResult) => {
      const { Org } = details.chargingStation;
      const { transactionInfo: txinfo, evse, idToken } = payload;

      const authResponse = idToken
        ? await AuthorizeIdToken(idToken, Org.id, Org.name)
        : undefined;

      // Send response early, then proceed
      sendResult({ idTokenInfo: authResponse?.idTokenInfo });

      // If given EVSE and Connector aren't on DB already, let's insert them
      if (evse) {
        await prisma.eVSE.upsert({
          where: {
            stationId_sn: {
              sn: evse.id,
              stationId: details.chargingStation.id,
            },
          },
          create: {
            sn: evse.id,
            stationId: details.chargingStation.id,
            friendlyName: `EVSE #${evse.id}`,
            Connectors:
              // If connector is specified, create it
              typeof evse.connectorId === "number"
                ? {
                    create: { sn: evse.connectorId },
                  }
                : undefined,
          },
          update: {
            Connectors: {
              upsert:
                // If connector is specified, try to create it if it doesn't already exist
                typeof evse.connectorId === "number"
                  ? {
                      where: {
                        stationId_evseNum_sn: {
                          sn: evse.connectorId,
                          evseNum: evse.id,
                          stationId: details.chargingStation.id,
                        },
                      },
                      create: {
                        sn: evse.connectorId,
                      },
                      update: {},
                    }
                  : undefined,
            },
          },
        });
      }

      const dbTx = await prisma.transaction.findFirst({
        where: {
          localId: txinfo.transactionId,
          stationId: details.chargingStation.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      // Insert the event
      const txEvent = await prisma.transactionEvent.create({
        data: {
          eventType: payload.eventType,
          timestamp: payload.timestamp,
          triggerReason: payload.triggerReason,
          seqNo: payload.seqNo,
          offline: payload.offline,
          numberOfPhasesUsed: payload.numberOfPhasesUsed,
          cableMaxCurrent: payload.cableMaxCurrent,
          reservationId: payload.reservationId,
          Tx: dbTx
            ? {
                connect: {
                  serverId: dbTx.serverId,
                },
              }
            : {
                create: {
                  localId: txinfo.transactionId,
                  stationId: details.chargingStation.id,
                  idTokenId: authResponse?.tokenId,
                },
              },
          chargingState: txinfo.chargingState,
          timeSpentCharging: txinfo.timeSpentCharging,
          stoppedReason: txinfo.stoppedReason,
          remoteStartId: txinfo.remoteStartId,
          evseSn: evse?.id,
          connectorSn: evse?.connectorId,
          IdToken: authResponse?.tokenId
            ? {
                connect: { id: authResponse.tokenId },
              }
            : undefined,
        },
      });

      switch (payload.eventType) {
        case "Started":
        case "Updated":
        case "Ended": {
          await prisma.transaction.update({
            where: { serverId: txEvent.txId },
            data: {
              offline: payload.offline,
              numberOfPhasesUsed: payload.numberOfPhasesUsed,
              cableMaxCurrent: payload.cableMaxCurrent,
              reservationId: payload.reservationId,
              chargingState: txinfo.chargingState,
              timeSpentCharging: txinfo.timeSpentCharging,
              stoppedReason: txinfo.stoppedReason,
              remoteStartId: txinfo.remoteStartId,
              evseSn: evse?.id,
              connectorSn: evse?.connectorId,
              idTokenId: authResponse?.tokenId,
            },
          });

          break;
        }
        default:
          console.error("Unknown eventType", payload.eventType);
      }

      // Save the incoming meter values
      await SaveMeterValues(
        payload.meterValue ?? [],
        details.chargingStation.id,
      );
    },
  );

  router.attachCallHandler(
    "StatusNotification",
    async (details, payload, sendResult) => {
      await prisma.eVSE.upsert({
        where: {
          stationId_sn: {
            sn: payload.evseId,
            stationId: details.chargingStation.id,
          },
        },
        create: {
          sn: payload.evseId,
          stationId: details.chargingStation.id,
          friendlyName: `EVSE #${payload.evseId}`,
          Connectors: {
            create: {
              sn: payload.connectorId,
              status: payload.connectorStatus,
              statusUpdatedAt: payload.timestamp,
            },
          },
        },
        update: {
          Connectors: {
            upsert: {
              where: {
                stationId_evseNum_sn: {
                  sn: payload.connectorId,
                  evseNum: payload.evseId,
                  stationId: details.chargingStation.id,
                },
              },
              create: {
                sn: payload.connectorId,
                status: payload.connectorStatus,
                statusUpdatedAt: payload.timestamp,
              },
              update: {
                status: payload.connectorStatus,
                statusUpdatedAt: payload.timestamp,
              },
            },
          },
        },
      });

      sendResult({});
    },
  );

  return router;
}
