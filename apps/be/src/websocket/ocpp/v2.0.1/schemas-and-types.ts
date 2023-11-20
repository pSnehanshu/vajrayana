import { z } from "zod";

export const CallActionsSchema = z.enum([
  "Authorize",
  "BootNotification",
  "CancelReservation",
  "CertificateSigned",
  "ChangeAvailability",
  "ClearCache",
  "ClearChargingProfile",
  "ClearDisplayMessage",
  "ClearVariableMonitoring",
  "ClearedChargingLimit",
  "CostUpdated",
  "CustomerInformation",
  "DataTransfer",
  "DeleteCertificate",
  "FirmwareStatusNotification",
  "Get15118EVCertificate",
  "GetBaseReport",
  "GetCertificateStatus",
  "GetChargingProfiles",
  "GetCompositeSchedule",
  "GetDisplayMessages",
  "GetInstalledCertificateIds",
  "GetLocalListVersion",
  "GetLog",
  "GetMonitoringReport",
  "GetReport",
  "GetTransactionStatus",
  "GetVariables",
  "Heartbeat",
  "InstallCertificate",
  "LogStatusNotification",
  "MeterValues",
  "NotifyChargingLimit",
  "NotifyCustomerInformation",
  "NotifyDisplayMessages",
  "NotifyEVChargingNeeds",
  "NotifyEVChargingSchedule",
  "NotifyEvent",
  "NotifyMonitoringReport",
  "NotifyReport",
  "PublishFirmware",
  "PublishFirmwareStatusNotification",
  "ReportChargingProfiles",
  "RequestStartTransaction",
  "RequestStopTransaction",
  "ReservationStatusUpdate",
  "ReserveNow",
  "Reset",
  "SecurityEventNotification",
  "SendLocalList",
  "SetChargingProfile",
  "SetDisplayMessage",
  "SetMonitoringBase",
  "SetMonitoringLevel",
  "SetNetworkProfile",
  "SetVariableMonitoring",
  "SetVariables",
  "SignCertificate",
  "StatusNotification",
  "TransactionEvent",
  "TriggerMessage",
  "UnlockConnector",
  "UnpublishFirmware",
  "UpdateFirmware",
]);

export type CallActions = z.infer<typeof CallActionsSchema>;

export const CallActionPayloadSchemas = {
  Authorize: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      idToken: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          additionalInfo: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalIdToken: z
                    .string()
                    .max(36)
                    .describe(
                      "This field specifies the additional IdToken.\r\n",
                    ),
                  type: z
                    .string()
                    .max(50)
                    .describe(
                      "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
            )
            .min(1)
            .optional(),
          idToken: z
            .string()
            .max(36)
            .describe(
              "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
            ),
          type: z
            .enum([
              "Central",
              "eMAID",
              "ISO14443",
              "ISO15693",
              "KeyCode",
              "Local",
              "MacAddress",
              "NoAuthorization",
            ])
            .describe("Enumeration of possible idToken types.\r\n"),
        })
        .strict()
        .describe(
          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
        ),
      certificate: z
        .string()
        .max(5500)
        .describe(
          "The X.509 certificated presented by EV and encoded in PEM format.\r\n",
        )
        .optional(),
      iso15118CertificateHashData: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              hashAlgorithm: z
                .enum(["SHA256", "SHA384", "SHA512"])
                .describe("Used algorithms for the hashes provided.\r\n"),
              issuerNameHash: z
                .string()
                .max(128)
                .describe(
                  "Hashed value of the Issuer DN (Distinguished Name).\r\n\r\n",
                ),
              issuerKeyHash: z
                .string()
                .max(128)
                .describe("Hashed value of the issuers public key\r\n"),
              serialNumber: z
                .string()
                .max(40)
                .describe("The serial number of the certificate.\r\n"),
              responderURL: z
                .string()
                .max(512)
                .describe(
                  "This contains the responder URL (Case insensitive). \r\n\r\n",
                ),
            })
            .strict(),
        )
        .min(1)
        .max(4)
        .optional(),
    })
    .strict(),

  BootNotification: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      chargingStation: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          serialNumber: z
            .string()
            .max(25)
            .describe(
              "Device. Serial_ Number. Serial_ Number\r\nurn:x-oca:ocpp:uid:1:569324\r\nVendor-specific device identifier.\r\n",
            )
            .optional(),
          model: z
            .string()
            .max(20)
            .describe(
              "Device. Model. CI20_ Text\r\nurn:x-oca:ocpp:uid:1:569325\r\nDefines the model of the device.\r\n",
            ),
          modem: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              iccid: z
                .string()
                .max(20)
                .describe(
                  "Wireless_ Communication_ Module. ICCID. CI20_ Text\r\nurn:x-oca:ocpp:uid:1:569327\r\nThis contains the ICCID of the modem’s SIM card.\r\n",
                )
                .optional(),
              imsi: z
                .string()
                .max(20)
                .describe(
                  "Wireless_ Communication_ Module. IMSI. CI20_ Text\r\nurn:x-oca:ocpp:uid:1:569328\r\nThis contains the IMSI of the modem’s SIM card.\r\n",
                )
                .optional(),
            })
            .strict()
            .describe(
              "Wireless_ Communication_ Module\r\nurn:x-oca:ocpp:uid:2:233306\r\nDefines parameters required for initiating and maintaining wireless communication with other devices.\r\n",
            )
            .optional(),
          vendorName: z
            .string()
            .max(50)
            .describe(
              "Identifies the vendor (not necessarily in a unique manner).\r\n",
            ),
          firmwareVersion: z
            .string()
            .max(50)
            .describe(
              "This contains the firmware version of the Charging Station.\r\n\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Charge_ Point\r\nurn:x-oca:ocpp:uid:2:233122\r\nThe physical system where an Electrical Vehicle (EV) can be charged.\r\n",
        ),
      reason: z
        .enum([
          "ApplicationReset",
          "FirmwareUpdate",
          "LocalReset",
          "PowerUp",
          "RemoteReset",
          "ScheduledReset",
          "Triggered",
          "Unknown",
          "Watchdog",
        ])
        .describe(
          "This contains the reason for sending this message to the CSMS.\r\n",
        ),
    })
    .strict(),

  CancelReservation: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      reservationId: z
        .number()
        .int()
        .describe("Id of the reservation to cancel.\r\n"),
    })
    .strict(),

  CertificateSigned: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      certificateChain: z
        .string()
        .max(10000)
        .describe(
          "The signed PEM encoded X.509 certificate. This can also contain the necessary sub CA certificates. In that case, the order of the bundle should follow the certificate chain, starting from the leaf certificate.\r\n\r\nThe Configuration Variable &lt;&lt;configkey-max-certificate-chain-size,MaxCertificateChainSize&gt;&gt; can be used to limit the maximum size of this field.\r\n",
        ),
      certificateType: z
        .enum(["ChargingStationCertificate", "V2GCertificate"])
        .describe(
          "Indicates the type of the signed certificate that is returned. When omitted the certificate is used for both the 15118 connection (if implemented) and the Charging Station to CSMS connection. This field is required when a typeOfCertificate was included in the &lt;&lt;signcertificaterequest,SignCertificateRequest&gt;&gt; that requested this certificate to be signed AND both the 15118 connection and the Charging Station connection are implemented.\r\n\r\n",
        )
        .optional(),
    })
    .strict(),

  ChangeAvailability: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      evse: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          id: z
            .number()
            .int()
            .describe(
              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
            ),
          connectorId: z
            .number()
            .int()
            .describe(
              "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
        )
        .optional(),
      operationalStatus: z
        .enum(["Inoperative", "Operative"])
        .describe(
          "This contains the type of availability change that the Charging Station should perform.\r\n\r\n",
        ),
    })
    .strict(),

  ClearCache: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
    })
    .strict(),

  ClearChargingProfile: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      chargingProfileId: z
        .number()
        .int()
        .describe("The Id of the charging profile to clear.\r\n")
        .optional(),
      chargingProfileCriteria: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          evseId: z
            .number()
            .int()
            .describe(
              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nSpecifies the id of the EVSE for which to clear charging profiles. An evseId of zero (0) specifies the charging profile for the overall Charging Station. Absence of this parameter means the clearing applies to all charging profiles that match the other criteria in the request.\r\n\r\n",
            )
            .optional(),
          chargingProfilePurpose: z
            .enum([
              "ChargingStationExternalConstraints",
              "ChargingStationMaxProfile",
              "TxDefaultProfile",
              "TxProfile",
            ])
            .describe(
              "Charging_ Profile. Charging_ Profile_ Purpose. Charging_ Profile_ Purpose_ Code\r\nurn:x-oca:ocpp:uid:1:569231\r\nSpecifies to purpose of the charging profiles that will be cleared, if they meet the other criteria in the request.\r\n",
            )
            .optional(),
          stackLevel: z
            .number()
            .int()
            .describe(
              "Charging_ Profile. Stack_ Level. Counter\r\nurn:x-oca:ocpp:uid:1:569230\r\nSpecifies the stackLevel for which charging profiles will be cleared, if they meet the other criteria in the request.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Charging_ Profile\r\nurn:x-oca:ocpp:uid:2:233255\r\nA ChargingProfile consists of a ChargingSchedule, describing the amount of power or current that can be delivered per time interval.\r\n",
        )
        .optional(),
    })
    .strict(),

  ClearDisplayMessage: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      id: z
        .number()
        .int()
        .describe(
          "Id of the message that SHALL be removed from the Charging Station.\r\n",
        ),
    })
    .strict(),

  ClearVariableMonitoring: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      id: z
        .array(z.number().int())
        .min(1)
        .describe(
          "List of the monitors to be cleared, identified by there Id.\r\n",
        ),
    })
    .strict(),

  ClearedChargingLimit: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      chargingLimitSource: z
        .enum(["EMS", "Other", "SO", "CSO"])
        .describe("Source of the charging limit.\r\n"),
      evseId: z.number().int().describe("EVSE Identifier.\r\n").optional(),
    })
    .strict(),

  CostUpdated: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      totalCost: z
        .number()
        .describe(
          "Current total cost, based on the information known by the CSMS, of the transaction including taxes. In the currency configured with the configuration Variable: [&lt;&lt;configkey-currency, Currency&gt;&gt;]\r\n\r\n",
        ),
      transactionId: z
        .string()
        .max(36)
        .describe(
          "Transaction Id of the transaction the current cost are asked for.\r\n\r\n",
        ),
    })
    .strict(),

  CustomerInformation: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      customerCertificate: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          hashAlgorithm: z
            .enum(["SHA256", "SHA384", "SHA512"])
            .describe("Used algorithms for the hashes provided.\r\n"),
          issuerNameHash: z
            .string()
            .max(128)
            .describe(
              "Hashed value of the Issuer DN (Distinguished Name).\r\n\r\n",
            ),
          issuerKeyHash: z
            .string()
            .max(128)
            .describe("Hashed value of the issuers public key\r\n"),
          serialNumber: z
            .string()
            .max(40)
            .describe("The serial number of the certificate.\r\n"),
        })
        .strict()
        .optional(),
      idToken: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          additionalInfo: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalIdToken: z
                    .string()
                    .max(36)
                    .describe(
                      "This field specifies the additional IdToken.\r\n",
                    ),
                  type: z
                    .string()
                    .max(50)
                    .describe(
                      "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
            )
            .min(1)
            .optional(),
          idToken: z
            .string()
            .max(36)
            .describe(
              "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
            ),
          type: z
            .enum([
              "Central",
              "eMAID",
              "ISO14443",
              "ISO15693",
              "KeyCode",
              "Local",
              "MacAddress",
              "NoAuthorization",
            ])
            .describe("Enumeration of possible idToken types.\r\n"),
        })
        .strict()
        .describe(
          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
        )
        .optional(),
      requestId: z.number().int().describe("The Id of the request.\r\n\r\n"),
      report: z
        .boolean()
        .describe(
          "Flag indicating whether the Charging Station should return NotifyCustomerInformationRequest messages containing information about the customer referred to.\r\n",
        ),
      clear: z
        .boolean()
        .describe(
          "Flag indicating whether the Charging Station should clear all information about the customer referred to.\r\n",
        ),
      customerIdentifier: z
        .string()
        .max(64)
        .describe(
          "A (e.g. vendor specific) identifier of the customer this request refers to. This field contains a custom identifier other than IdToken and Certificate.\r\nOne of the possible identifiers (customerIdentifier, customerIdToken or customerCertificate) should be in the request message.\r\n",
        )
        .optional(),
    })
    .strict(),

  DataTransfer: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      messageId: z
        .string()
        .max(50)
        .describe(
          "May be used to indicate a specific message or implementation.\r\n",
        )
        .optional(),
      data: z
        .any()
        .describe(
          "Data without specified length or format. This needs to be decided by both parties (Open to implementation).\r\n",
        )
        .optional(),
      vendorId: z
        .string()
        .max(255)
        .describe("This identifies the Vendor specific implementation\r\n\r\n"),
    })
    .strict(),

  DeleteCertificate: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      certificateHashData: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          hashAlgorithm: z
            .enum(["SHA256", "SHA384", "SHA512"])
            .describe("Used algorithms for the hashes provided.\r\n"),
          issuerNameHash: z
            .string()
            .max(128)
            .describe(
              "Hashed value of the Issuer DN (Distinguished Name).\r\n\r\n",
            ),
          issuerKeyHash: z
            .string()
            .max(128)
            .describe("Hashed value of the issuers public key\r\n"),
          serialNumber: z
            .string()
            .max(40)
            .describe("The serial number of the certificate.\r\n"),
        })
        .strict(),
    })
    .strict(),

  FirmwareStatusNotification: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      status: z
        .enum([
          "Downloaded",
          "DownloadFailed",
          "Downloading",
          "DownloadScheduled",
          "DownloadPaused",
          "Idle",
          "InstallationFailed",
          "Installing",
          "Installed",
          "InstallRebooting",
          "InstallScheduled",
          "InstallVerificationFailed",
          "InvalidSignature",
          "SignatureVerified",
        ])
        .describe(
          "This contains the progress status of the firmware installation.\r\n",
        ),
      requestId: z
        .number()
        .int()
        .describe(
          "The request id that was provided in the\r\nUpdateFirmwareRequest that started this firmware update.\r\nThis field is mandatory, unless the message was triggered by a TriggerMessageRequest AND there is no firmware update ongoing.\r\n",
        )
        .optional(),
    })
    .strict(),

  Get15118EVCertificate: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      iso15118SchemaVersion: z
        .string()
        .max(50)
        .describe(
          "Schema version currently used for the 15118 session between EV and Charging Station. Needed for parsing of the EXI stream by the CSMS.\r\n\r\n",
        ),
      action: z
        .enum(["Install", "Update"])
        .describe(
          "Defines whether certificate needs to be installed or updated.\r\n",
        ),
      exiRequest: z
        .string()
        .max(5600)
        .describe(
          "Raw CertificateInstallationReq request from EV, Base64 encoded.\r\n",
        ),
    })
    .strict(),

  GetBaseReport: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      requestId: z.number().int().describe("The Id of the request.\r\n"),
      reportBase: z
        .enum(["ConfigurationInventory", "FullInventory", "SummaryInventory"])
        .describe("This field specifies the report base.\r\n"),
    })
    .strict(),

  GetCertificateStatus: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      ocspRequestData: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          hashAlgorithm: z
            .enum(["SHA256", "SHA384", "SHA512"])
            .describe("Used algorithms for the hashes provided.\r\n"),
          issuerNameHash: z
            .string()
            .max(128)
            .describe(
              "Hashed value of the Issuer DN (Distinguished Name).\r\n\r\n",
            ),
          issuerKeyHash: z
            .string()
            .max(128)
            .describe("Hashed value of the issuers public key\r\n"),
          serialNumber: z
            .string()
            .max(40)
            .describe("The serial number of the certificate.\r\n"),
          responderURL: z
            .string()
            .max(512)
            .describe(
              "This contains the responder URL (Case insensitive). \r\n\r\n",
            ),
        })
        .strict(),
    })
    .strict(),

  GetChargingProfiles: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      requestId: z
        .number()
        .int()
        .describe(
          "Reference identification that is to be used by the Charging Station in the &lt;&lt;reportchargingprofilesrequest, ReportChargingProfilesRequest&gt;&gt; when provided.\r\n",
        ),
      evseId: z
        .number()
        .int()
        .describe(
          "For which EVSE installed charging profiles SHALL be reported. If 0, only charging profiles installed on the Charging Station itself (the grid connection) SHALL be reported. If omitted, all installed charging profiles SHALL be reported.\r\n",
        )
        .optional(),
      chargingProfile: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          chargingProfilePurpose: z
            .enum([
              "ChargingStationExternalConstraints",
              "ChargingStationMaxProfile",
              "TxDefaultProfile",
              "TxProfile",
            ])
            .describe(
              "Charging_ Profile. Charging_ Profile_ Purpose. Charging_ Profile_ Purpose_ Code\r\nurn:x-oca:ocpp:uid:1:569231\r\nDefines the purpose of the schedule transferred by this profile\r\n",
            )
            .optional(),
          stackLevel: z
            .number()
            .int()
            .describe(
              "Charging_ Profile. Stack_ Level. Counter\r\nurn:x-oca:ocpp:uid:1:569230\r\nValue determining level in hierarchy stack of profiles. Higher values have precedence over lower values. Lowest level is 0.\r\n",
            )
            .optional(),
          chargingProfileId: z
            .array(z.number().int())
            .min(1)
            .describe(
              "List of all the chargingProfileIds requested. Any ChargingProfile that matches one of these profiles will be reported. If omitted, the Charging Station SHALL not filter on chargingProfileId. This field SHALL NOT contain more ids than set in &lt;&lt;configkey-charging-profile-entries,ChargingProfileEntries.maxLimit&gt;&gt;\r\n\r\n",
            )
            .optional(),
          chargingLimitSource: z
            .array(z.enum(["EMS", "Other", "SO", "CSO"]))
            .min(1)
            .max(4)
            .describe(
              "For which charging limit sources, charging profiles SHALL be reported. If omitted, the Charging Station SHALL not filter on chargingLimitSource.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Charging_ Profile\r\nurn:x-oca:ocpp:uid:2:233255\r\nA ChargingProfile consists of ChargingSchedule, describing the amount of power or current that can be delivered per time interval.\r\n",
        ),
    })
    .strict(),

  GetCompositeSchedule: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      duration: z
        .number()
        .int()
        .describe("Length of the requested schedule in seconds.\r\n\r\n"),
      chargingRateUnit: z
        .enum(["W", "A"])
        .describe("Can be used to force a power or current profile.\r\n\r\n")
        .optional(),
      evseId: z
        .number()
        .int()
        .describe(
          "The ID of the EVSE for which the schedule is requested. When evseid=0, the Charging Station will calculate the expected consumption for the grid connection.\r\n",
        ),
    })
    .strict(),

  GetDisplayMessages: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      id: z
        .array(z.number().int())
        .min(1)
        .describe(
          "If provided the Charging Station shall return Display Messages of the given ids. This field SHALL NOT contain more ids than set in &lt;&lt;configkey-number-of-display-messages,NumberOfDisplayMessages.maxLimit&gt;&gt;\r\n\r\n",
        )
        .optional(),
      requestId: z.number().int().describe("The Id of this request.\r\n"),
      priority: z
        .enum(["AlwaysFront", "InFront", "NormalCycle"])
        .describe(
          "If provided the Charging Station shall return Display Messages with the given priority only.\r\n",
        )
        .optional(),
      state: z
        .enum(["Charging", "Faulted", "Idle", "Unavailable"])
        .describe(
          "If provided the Charging Station shall return Display Messages with the given state only. \r\n",
        )
        .optional(),
    })
    .strict(),

  GetInstalledCertificateIds: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      certificateType: z
        .array(
          z.enum([
            "V2GRootCertificate",
            "MORootCertificate",
            "CSMSRootCertificate",
            "V2GCertificateChain",
            "ManufacturerRootCertificate",
          ]),
        )
        .min(1)
        .describe(
          "Indicates the type of certificates requested. When omitted, all certificate types are requested.\r\n",
        )
        .optional(),
    })
    .strict(),

  GetLocalListVersion: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
    })
    .strict(),

  GetLog: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      log: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          remoteLocation: z
            .string()
            .max(512)
            .describe(
              "Log. Remote_ Location. URI\r\nurn:x-enexis:ecdm:uid:1:569484\r\nThe URL of the location at the remote system where the log should be stored.\r\n",
            ),
          oldestTimestamp: z
            .string()
            .datetime()
            .describe(
              "Log. Oldest_ Timestamp. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569477\r\nThis contains the date and time of the oldest logging information to include in the diagnostics.\r\n",
            )
            .optional(),
          latestTimestamp: z
            .string()
            .datetime()
            .describe(
              "Log. Latest_ Timestamp. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569482\r\nThis contains the date and time of the latest logging information to include in the diagnostics.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Log\r\nurn:x-enexis:ecdm:uid:2:233373\r\nGeneric class for the configuration of logging entries.\r\n",
        ),
      logType: z
        .enum(["DiagnosticsLog", "SecurityLog"])
        .describe(
          "This contains the type of log file that the Charging Station\r\nshould send.\r\n",
        ),
      requestId: z.number().int().describe("The Id of this request\r\n"),
      retries: z
        .number()
        .int()
        .describe(
          "This specifies how many times the Charging Station must try to upload the log before giving up. If this field is not present, it is left to Charging Station to decide how many times it wants to retry.\r\n",
        )
        .optional(),
      retryInterval: z
        .number()
        .int()
        .describe(
          "The interval in seconds after which a retry may be attempted. If this field is not present, it is left to Charging Station to decide how long to wait between attempts.\r\n",
        )
        .optional(),
    })
    .strict(),

  GetMonitoringReport: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      componentVariable: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n")
                .optional(),
            })
            .strict()
            .describe(
              "Class to report components, variables and variable attributes and characteristics.\r\n",
            ),
        )
        .min(1)
        .optional(),
      requestId: z.number().int().describe("The Id of the request.\r\n"),
      monitoringCriteria: z
        .array(
          z.enum([
            "ThresholdMonitoring",
            "DeltaMonitoring",
            "PeriodicMonitoring",
          ]),
        )
        .min(1)
        .max(3)
        .describe(
          "This field contains criteria for components for which a monitoring report is requested\r\n",
        )
        .optional(),
    })
    .strict(),

  GetReport: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      componentVariable: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n")
                .optional(),
            })
            .strict()
            .describe(
              "Class to report components, variables and variable attributes and characteristics.\r\n",
            ),
        )
        .min(1)
        .optional(),
      requestId: z.number().int().describe("The Id of the request.\r\n"),
      componentCriteria: z
        .array(z.enum(["Active", "Available", "Enabled", "Problem"]))
        .min(1)
        .max(4)
        .describe(
          "This field contains criteria for components for which a report is requested\r\n",
        )
        .optional(),
    })
    .strict(),

  GetTransactionStatus: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      transactionId: z
        .string()
        .max(36)
        .describe(
          "The Id of the transaction for which the status is requested.\r\n",
        )
        .optional(),
    })
    .strict(),

  GetVariables: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      getVariableData: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              attributeType: z
                .enum(["Actual", "Target", "MinSet", "MaxSet"])
                .describe(
                  "Attribute type for which value is requested. When absent, default Actual is assumed.\r\n",
                )
                .default("Actual"),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n"),
            })
            .strict()
            .describe("Class to hold parameters for GetVariables request.\r\n"),
        )
        .min(1),
    })
    .strict(),

  Heartbeat: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
    })
    .strict(),

  InstallCertificate: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      certificateType: z
        .enum([
          "V2GRootCertificate",
          "MORootCertificate",
          "CSMSRootCertificate",
          "ManufacturerRootCertificate",
        ])
        .describe("Indicates the certificate type that is sent.\r\n"),
      certificate: z
        .string()
        .max(5500)
        .describe("A PEM encoded X.509 certificate.\r\n"),
    })
    .strict(),

  LogStatusNotification: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      status: z
        .enum([
          "BadMessage",
          "Idle",
          "NotSupportedOperation",
          "PermissionDenied",
          "Uploaded",
          "UploadFailure",
          "Uploading",
          "AcceptedCanceled",
        ])
        .describe("This contains the status of the log upload.\r\n"),
      requestId: z
        .number()
        .int()
        .describe(
          "The request id that was provided in GetLogRequest that started this log upload. This field is mandatory,\r\nunless the message was triggered by a TriggerMessageRequest AND there is no log upload ongoing.\r\n",
        )
        .optional(),
    })
    .strict(),

  MeterValues: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      evseId: z
        .number()
        .int()
        .describe(
          "Request_ Body. EVSEID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:571101\r\nThis contains a number (&gt;0) designating an EVSE of the Charging Station. ‘0’ (zero) is used to designate the main power meter.\r\n",
        ),
      meterValue: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              sampledValue: z
                .array(
                  z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      value: z
                        .number()
                        .describe(
                          "Sampled_ Value. Value. Measure\r\nurn:x-oca:ocpp:uid:1:569260\r\nIndicates the measured value.\r\n\r\n",
                        ),
                      context: z
                        .enum([
                          "Interruption.Begin",
                          "Interruption.End",
                          "Other",
                          "Sample.Clock",
                          "Sample.Periodic",
                          "Transaction.Begin",
                          "Transaction.End",
                          "Trigger",
                        ])
                        .describe(
                          'Sampled_ Value. Context. Reading_ Context_ Code\r\nurn:x-oca:ocpp:uid:1:569261\r\nType of detail value: start, end or sample. Default = "Sample.Periodic"\r\n',
                        )
                        .default("Sample.Periodic"),
                      measurand: z
                        .enum([
                          "Current.Export",
                          "Current.Import",
                          "Current.Offered",
                          "Energy.Active.Export.Register",
                          "Energy.Active.Import.Register",
                          "Energy.Reactive.Export.Register",
                          "Energy.Reactive.Import.Register",
                          "Energy.Active.Export.Interval",
                          "Energy.Active.Import.Interval",
                          "Energy.Active.Net",
                          "Energy.Reactive.Export.Interval",
                          "Energy.Reactive.Import.Interval",
                          "Energy.Reactive.Net",
                          "Energy.Apparent.Net",
                          "Energy.Apparent.Import",
                          "Energy.Apparent.Export",
                          "Frequency",
                          "Power.Active.Export",
                          "Power.Active.Import",
                          "Power.Factor",
                          "Power.Offered",
                          "Power.Reactive.Export",
                          "Power.Reactive.Import",
                          "SoC",
                          "Voltage",
                        ])
                        .describe(
                          'Sampled_ Value. Measurand. Measurand_ Code\r\nurn:x-oca:ocpp:uid:1:569263\r\nType of measurement. Default = "Energy.Active.Import.Register"\r\n',
                        )
                        .default("Energy.Active.Import.Register"),
                      phase: z
                        .enum([
                          "L1",
                          "L2",
                          "L3",
                          "N",
                          "L1-N",
                          "L2-N",
                          "L3-N",
                          "L1-L2",
                          "L2-L3",
                          "L3-L1",
                        ])
                        .describe(
                          "Sampled_ Value. Phase. Phase_ Code\r\nurn:x-oca:ocpp:uid:1:569264\r\nIndicates how the measured value is to be interpreted. For instance between L1 and neutral (L1-N) Please note that not all values of phase are applicable to all Measurands. When phase is absent, the measured value is interpreted as an overall value.\r\n",
                        )
                        .optional(),
                      location: z
                        .enum(["Body", "Cable", "EV", "Inlet", "Outlet"])
                        .describe(
                          'Sampled_ Value. Location. Location_ Code\r\nurn:x-oca:ocpp:uid:1:569265\r\nIndicates where the measured value has been sampled. Default =  "Outlet"\r\n\r\n',
                        )
                        .default("Outlet"),
                      signedMeterValue: z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          signedMeterData: z
                            .string()
                            .max(2500)
                            .describe(
                              "Base64 encoded, contains the signed data which might contain more then just the meter value. It can contain information like timestamps, reference to a customer etc.\r\n",
                            ),
                          signingMethod: z
                            .string()
                            .max(50)
                            .describe(
                              "Method used to create the digital signature.\r\n",
                            ),
                          encodingMethod: z
                            .string()
                            .max(50)
                            .describe(
                              "Method used to encode the meter values before applying the digital signature algorithm.\r\n",
                            ),
                          publicKey: z
                            .string()
                            .max(2500)
                            .describe(
                              "Base64 encoded, sending depends on configuration variable _PublicKeyWithSignedMeterValue_.\r\n",
                            ),
                        })
                        .strict()
                        .describe(
                          "Represent a signed version of the meter value.\r\n",
                        )
                        .optional(),
                      unitOfMeasure: z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          unit: z
                            .string()
                            .max(20)
                            .describe(
                              'Unit of the value. Default = "Wh" if the (default) measurand is an "Energy" type.\r\nThis field SHALL use a value from the list Standardized Units of Measurements in Part 2 Appendices. \r\nIf an applicable unit is available in that list, otherwise a "custom" unit might be used.\r\n',
                            )
                            .default("Wh"),
                          multiplier: z
                            .number()
                            .int()
                            .describe(
                              "Multiplier, this value represents the exponent to base 10. I.e. multiplier 3 means 10 raised to the 3rd power. Default is 0.\r\n",
                            )
                            .default(0),
                        })
                        .strict()
                        .describe(
                          "Represents a UnitOfMeasure with a multiplier\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "Sampled_ Value\r\nurn:x-oca:ocpp:uid:2:233266\r\nSingle sampled value in MeterValues. Each value can be accompanied by optional fields.\r\n\r\nTo save on mobile data usage, default values of all of the optional fields are such that. The value without any additional fields will be interpreted, as a register reading of active import energy in Wh (Watt-hour) units.\r\n",
                    ),
                )
                .min(1),
              timestamp: z
                .string()
                .datetime()
                .describe(
                  "Meter_ Value. Timestamp. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569259\r\nTimestamp for measured value(s).\r\n",
                ),
            })
            .strict()
            .describe(
              "Meter_ Value\r\nurn:x-oca:ocpp:uid:2:233265\r\nCollection of one or more sampled values in MeterValuesRequest and TransactionEvent. All sampled values in a MeterValue are sampled at the same point in time.\r\n",
            ),
        )
        .min(1),
    })
    .strict()
    .describe("Request_ Body\r\nurn:x-enexis:ecdm:uid:2:234744\r\n"),

  NotifyChargingLimit: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      chargingSchedule: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              id: z
                .number()
                .int()
                .describe("Identifies the ChargingSchedule.\r\n"),
              startSchedule: z
                .string()
                .datetime()
                .describe(
                  "Charging_ Schedule. Start_ Schedule. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569237\r\nStarting point of an absolute schedule. If absent the schedule will be relative to start of charging.\r\n",
                )
                .optional(),
              duration: z
                .number()
                .int()
                .describe(
                  "Charging_ Schedule. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569236\r\nDuration of the charging schedule in seconds. If the duration is left empty, the last period will continue indefinitely or until end of the transaction if chargingProfilePurpose = TxProfile.\r\n",
                )
                .optional(),
              chargingRateUnit: z
                .enum(["W", "A"])
                .describe(
                  "Charging_ Schedule. Charging_ Rate_ Unit. Charging_ Rate_ Unit_ Code\r\nurn:x-oca:ocpp:uid:1:569238\r\nThe unit of measure Limit is expressed in.\r\n",
                ),
              chargingSchedulePeriod: z
                .array(
                  z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      startPeriod: z
                        .number()
                        .int()
                        .describe(
                          "Charging_ Schedule_ Period. Start_ Period. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569240\r\nStart of the period, in seconds from the start of schedule. The value of StartPeriod also defines the stop time of the previous period.\r\n",
                        ),
                      limit: z
                        .number()
                        .describe(
                          "Charging_ Schedule_ Period. Limit. Measure\r\nurn:x-oca:ocpp:uid:1:569241\r\nCharging rate limit during the schedule period, in the applicable chargingRateUnit, for example in Amperes (A) or Watts (W). Accepts at most one digit fraction (e.g. 8.1).\r\n",
                        ),
                      numberPhases: z
                        .number()
                        .int()
                        .describe(
                          "Charging_ Schedule_ Period. Number_ Phases. Counter\r\nurn:x-oca:ocpp:uid:1:569242\r\nThe number of phases that can be used for charging. If a number of phases is needed, numberPhases=3 will be assumed unless another number is given.\r\n",
                        )
                        .optional(),
                      phaseToUse: z
                        .number()
                        .int()
                        .describe(
                          "Values: 1..3, Used if numberPhases=1 and if the EVSE is capable of switching the phase connected to the EV, i.e. ACPhaseSwitchingSupported is defined and true. It’s not allowed unless both conditions above are true. If both conditions are true, and phaseToUse is omitted, the Charging Station / EVSE will make the selection on its own.\r\n\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "Charging_ Schedule_ Period\r\nurn:x-oca:ocpp:uid:2:233257\r\nCharging schedule period structure defines a time period in a charging schedule.\r\n",
                    ),
                )
                .min(1)
                .max(1024),
              minChargingRate: z
                .number()
                .describe(
                  "Charging_ Schedule. Min_ Charging_ Rate. Numeric\r\nurn:x-oca:ocpp:uid:1:569239\r\nMinimum charging rate supported by the EV. The unit of measure is defined by the chargingRateUnit. This parameter is intended to be used by a local smart charging algorithm to optimize the power allocation for in the case a charging process is inefficient at lower charging rates. Accepts at most one digit fraction (e.g. 8.1)\r\n",
                )
                .optional(),
              salesTariff: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  id: z
                    .number()
                    .int()
                    .describe(
                      "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nSalesTariff identifier used to identify one sales tariff. An SAID remains a unique identifier for one schedule throughout a charging session.\r\n",
                    ),
                  salesTariffDescription: z
                    .string()
                    .max(32)
                    .describe(
                      "Sales_ Tariff. Sales. Tariff_ Description\r\nurn:x-oca:ocpp:uid:1:569283\r\nA human readable title/short description of the sales tariff e.g. for HMI display purposes.\r\n",
                    )
                    .optional(),
                  numEPriceLevels: z
                    .number()
                    .int()
                    .describe(
                      "Sales_ Tariff. Num_ E_ Price_ Levels. Counter\r\nurn:x-oca:ocpp:uid:1:569284\r\nDefines the overall number of distinct price levels used across all provided SalesTariff elements.\r\n",
                    )
                    .optional(),
                  salesTariffEntry: z
                    .array(
                      z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          relativeTimeInterval: z
                            .object({
                              customData: z
                                .object({ vendorId: z.string().max(255) })
                                .describe(
                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                )
                                .optional(),
                              start: z
                                .number()
                                .int()
                                .describe(
                                  "Relative_ Timer_ Interval. Start. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569279\r\nStart of the interval, in seconds from NOW.\r\n",
                                ),
                              duration: z
                                .number()
                                .int()
                                .describe(
                                  "Relative_ Timer_ Interval. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569280\r\nDuration of the interval, in seconds.\r\n",
                                )
                                .optional(),
                            })
                            .strict()
                            .describe(
                              "Relative_ Timer_ Interval\r\nurn:x-oca:ocpp:uid:2:233270\r\n",
                            ),
                          ePriceLevel: z
                            .number()
                            .int()
                            .gte(0)
                            .describe(
                              "Sales_ Tariff_ Entry. E_ Price_ Level. Unsigned_ Integer\r\nurn:x-oca:ocpp:uid:1:569281\r\nDefines the price level of this SalesTariffEntry (referring to NumEPriceLevels). Small values for the EPriceLevel represent a cheaper TariffEntry. Large values for the EPriceLevel represent a more expensive TariffEntry.\r\n",
                            )
                            .optional(),
                          consumptionCost: z
                            .array(
                              z
                                .object({
                                  customData: z
                                    .object({ vendorId: z.string().max(255) })
                                    .describe(
                                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                    )
                                    .optional(),
                                  startValue: z
                                    .number()
                                    .describe(
                                      "Consumption_ Cost. Start_ Value. Numeric\r\nurn:x-oca:ocpp:uid:1:569246\r\nThe lowest level of consumption that defines the starting point of this consumption block. The block interval extends to the start of the next interval.\r\n",
                                    ),
                                  cost: z
                                    .array(
                                      z
                                        .object({
                                          customData: z
                                            .object({
                                              vendorId: z.string().max(255),
                                            })
                                            .describe(
                                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                            )
                                            .optional(),
                                          costKind: z
                                            .enum([
                                              "CarbonDioxideEmission",
                                              "RelativePricePercentage",
                                              "RenewableGenerationPercentage",
                                            ])
                                            .describe(
                                              "Cost. Cost_ Kind. Cost_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569243\r\nThe kind of cost referred to in the message element amount\r\n",
                                            ),
                                          amount: z
                                            .number()
                                            .int()
                                            .describe(
                                              "Cost. Amount. Amount\r\nurn:x-oca:ocpp:uid:1:569244\r\nThe estimated or actual cost per kWh\r\n",
                                            ),
                                          amountMultiplier: z
                                            .number()
                                            .int()
                                            .describe(
                                              "Cost. Amount_ Multiplier. Integer\r\nurn:x-oca:ocpp:uid:1:569245\r\nValues: -3..3, The amountMultiplier defines the exponent to base 10 (dec). The final value is determined by: amount * 10 ^ amountMultiplier\r\n",
                                            )
                                            .optional(),
                                        })
                                        .strict()
                                        .describe(
                                          "Cost\r\nurn:x-oca:ocpp:uid:2:233258\r\n",
                                        ),
                                    )
                                    .min(1)
                                    .max(3),
                                })
                                .strict()
                                .describe(
                                  "Consumption_ Cost\r\nurn:x-oca:ocpp:uid:2:233259\r\n",
                                ),
                            )
                            .min(1)
                            .max(3)
                            .optional(),
                        })
                        .strict()
                        .describe(
                          "Sales_ Tariff_ Entry\r\nurn:x-oca:ocpp:uid:2:233271\r\n",
                        ),
                    )
                    .min(1)
                    .max(1024),
                })
                .strict()
                .describe(
                  "Sales_ Tariff\r\nurn:x-oca:ocpp:uid:2:233272\r\nNOTE: This dataType is based on dataTypes from &lt;&lt;ref-ISOIEC15118-2,ISO 15118-2&gt;&gt;.\r\n",
                )
                .optional(),
            })
            .strict()
            .describe(
              "Charging_ Schedule\r\nurn:x-oca:ocpp:uid:2:233256\r\nCharging schedule structure defines a list of charging periods, as used in: GetCompositeSchedule.conf and ChargingProfile. \r\n",
            ),
        )
        .min(1)
        .optional(),
      evseId: z
        .number()
        .int()
        .describe(
          "The charging schedule contained in this notification applies to an EVSE. evseId must be &gt; 0.\r\n",
        )
        .optional(),
      chargingLimit: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          chargingLimitSource: z
            .enum(["EMS", "Other", "SO", "CSO"])
            .describe(
              "Charging_ Limit. Charging_ Limit_ Source. Charging_ Limit_ Source_ Code\r\nurn:x-enexis:ecdm:uid:1:570845\r\nRepresents the source of the charging limit.\r\n",
            ),
          isGridCritical: z
            .boolean()
            .describe(
              "Charging_ Limit. Is_ Grid_ Critical. Indicator\r\nurn:x-enexis:ecdm:uid:1:570847\r\nIndicates whether the charging limit is critical for the grid.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe("Charging_ Limit\r\nurn:x-enexis:ecdm:uid:2:234489\r\n"),
    })
    .strict(),

  NotifyCustomerInformation: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      data: z
        .string()
        .max(512)
        .describe(
          "(Part of) the requested data. No format specified in which the data is returned. Should be human readable.\r\n",
        ),
      tbc: z
        .boolean()
        .describe(
          "“to be continued” indicator. Indicates whether another part of the monitoringData follows in an upcoming notifyMonitoringReportRequest message. Default value when omitted is false.\r\n",
        )
        .default(false),
      seqNo: z
        .number()
        .int()
        .describe(
          "Sequence number of this message. First message starts at 0.\r\n",
        ),
      generatedAt: z
        .string()
        .datetime()
        .describe(
          " Timestamp of the moment this message was generated at the Charging Station.\r\n",
        ),
      requestId: z.number().int().describe("The Id of the request.\r\n\r\n"),
    })
    .strict(),

  NotifyDisplayMessages: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      messageInfo: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              display: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n")
                .optional(),
              id: z
                .number()
                .int()
                .describe(
                  "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nMaster resource identifier, unique within an exchange context. It is defined within the OCPP context as a positive Integer value (greater or equal to zero).\r\n",
                ),
              priority: z
                .enum(["AlwaysFront", "InFront", "NormalCycle"])
                .describe(
                  "Message_ Info. Priority. Message_ Priority_ Code\r\nurn:x-enexis:ecdm:uid:1:569253\r\nWith what priority should this message be shown\r\n",
                ),
              state: z
                .enum(["Charging", "Faulted", "Idle", "Unavailable"])
                .describe(
                  "Message_ Info. State. Message_ State_ Code\r\nurn:x-enexis:ecdm:uid:1:569254\r\nDuring what state should this message be shown. When omitted this message should be shown in any state of the Charging Station.\r\n",
                )
                .optional(),
              startDateTime: z
                .string()
                .datetime()
                .describe(
                  "Message_ Info. Start. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569256\r\nFrom what date-time should this message be shown. If omitted: directly.\r\n",
                )
                .optional(),
              endDateTime: z
                .string()
                .datetime()
                .describe(
                  "Message_ Info. End. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569257\r\nUntil what date-time should this message be shown, after this date/time this message SHALL be removed.\r\n",
                )
                .optional(),
              transactionId: z
                .string()
                .max(36)
                .describe(
                  "During which transaction shall this message be shown.\r\nMessage SHALL be removed by the Charging Station after transaction has\r\nended.\r\n",
                )
                .optional(),
              message: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  format: z
                    .enum(["ASCII", "HTML", "URI", "UTF8"])
                    .describe(
                      "Message_ Content. Format. Message_ Format_ Code\r\nurn:x-enexis:ecdm:uid:1:570848\r\nFormat of the message.\r\n",
                    ),
                  language: z
                    .string()
                    .max(8)
                    .describe(
                      "Message_ Content. Language. Language_ Code\r\nurn:x-enexis:ecdm:uid:1:570849\r\nMessage language identifier. Contains a language code as defined in &lt;&lt;ref-RFC5646,[RFC5646]&gt;&gt;.\r\n",
                    )
                    .optional(),
                  content: z
                    .string()
                    .max(512)
                    .describe(
                      "Message_ Content. Content. Message\r\nurn:x-enexis:ecdm:uid:1:570852\r\nMessage contents.\r\n\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Message_ Content\r\nurn:x-enexis:ecdm:uid:2:234490\r\nContains message details, for a message to be displayed on a Charging Station.\r\n\r\n",
                ),
            })
            .strict()
            .describe(
              "Message_ Info\r\nurn:x-enexis:ecdm:uid:2:233264\r\nContains message details, for a message to be displayed on a Charging Station.\r\n",
            ),
        )
        .min(1)
        .optional(),
      requestId: z
        .number()
        .int()
        .describe(
          "The id of the &lt;&lt;getdisplaymessagesrequest,GetDisplayMessagesRequest&gt;&gt; that requested this message.\r\n",
        ),
      tbc: z
        .boolean()
        .describe(
          '"to be continued" indicator. Indicates whether another part of the report follows in an upcoming NotifyDisplayMessagesRequest message. Default value when omitted is false.\r\n',
        )
        .default(false),
    })
    .strict(),

  NotifyEVChargingNeeds: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      maxScheduleTuples: z
        .number()
        .int()
        .describe(
          "Contains the maximum schedule tuples the car supports per schedule.\r\n",
        )
        .optional(),
      chargingNeeds: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          acChargingParameters: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              energyAmount: z
                .number()
                .int()
                .describe(
                  "AC_ Charging_ Parameters. Energy_ Amount. Energy_ Amount\r\nurn:x-oca:ocpp:uid:1:569211\r\nAmount of energy requested (in Wh). This includes energy required for preconditioning.\r\n",
                ),
              evMinCurrent: z
                .number()
                .int()
                .describe(
                  "AC_ Charging_ Parameters. EV_ Min. Current\r\nurn:x-oca:ocpp:uid:1:569212\r\nMinimum current (amps) supported by the electric vehicle (per phase).\r\n",
                ),
              evMaxCurrent: z
                .number()
                .int()
                .describe(
                  "AC_ Charging_ Parameters. EV_ Max. Current\r\nurn:x-oca:ocpp:uid:1:569213\r\nMaximum current (amps) supported by the electric vehicle (per phase). Includes cable capacity.\r\n",
                ),
              evMaxVoltage: z
                .number()
                .int()
                .describe(
                  "AC_ Charging_ Parameters. EV_ Max. Voltage\r\nurn:x-oca:ocpp:uid:1:569214\r\nMaximum voltage supported by the electric vehicle\r\n",
                ),
            })
            .strict()
            .describe(
              "AC_ Charging_ Parameters\r\nurn:x-oca:ocpp:uid:2:233250\r\nEV AC charging parameters.\r\n\r\n",
            )
            .optional(),
          dcChargingParameters: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              evMaxCurrent: z
                .number()
                .int()
                .describe(
                  "DC_ Charging_ Parameters. EV_ Max. Current\r\nurn:x-oca:ocpp:uid:1:569215\r\nMaximum current (amps) supported by the electric vehicle. Includes cable capacity.\r\n",
                ),
              evMaxVoltage: z
                .number()
                .int()
                .describe(
                  "DC_ Charging_ Parameters. EV_ Max. Voltage\r\nurn:x-oca:ocpp:uid:1:569216\r\nMaximum voltage supported by the electric vehicle\r\n",
                ),
              energyAmount: z
                .number()
                .int()
                .describe(
                  "DC_ Charging_ Parameters. Energy_ Amount. Energy_ Amount\r\nurn:x-oca:ocpp:uid:1:569217\r\nAmount of energy requested (in Wh). This inludes energy required for preconditioning.\r\n",
                )
                .optional(),
              evMaxPower: z
                .number()
                .int()
                .describe(
                  "DC_ Charging_ Parameters. EV_ Max. Power\r\nurn:x-oca:ocpp:uid:1:569218\r\nMaximum power (in W) supported by the electric vehicle. Required for DC charging.\r\n",
                )
                .optional(),
              stateOfCharge: z
                .number()
                .int()
                .gte(0)
                .lte(100)
                .describe(
                  "DC_ Charging_ Parameters. State_ Of_ Charge. Numeric\r\nurn:x-oca:ocpp:uid:1:569219\r\nEnergy available in the battery (in percent of the battery capacity)\r\n",
                )
                .optional(),
              evEnergyCapacity: z
                .number()
                .int()
                .describe(
                  "DC_ Charging_ Parameters. EV_ Energy_ Capacity. Numeric\r\nurn:x-oca:ocpp:uid:1:569220\r\nCapacity of the electric vehicle battery (in Wh)\r\n",
                )
                .optional(),
              fullSoC: z
                .number()
                .int()
                .gte(0)
                .lte(100)
                .describe(
                  "DC_ Charging_ Parameters. Full_ SOC. Percentage\r\nurn:x-oca:ocpp:uid:1:569221\r\nPercentage of SoC at which the EV considers the battery fully charged. (possible values: 0 - 100)\r\n",
                )
                .optional(),
              bulkSoC: z
                .number()
                .int()
                .gte(0)
                .lte(100)
                .describe(
                  "DC_ Charging_ Parameters. Bulk_ SOC. Percentage\r\nurn:x-oca:ocpp:uid:1:569222\r\nPercentage of SoC at which the EV considers a fast charging process to end. (possible values: 0 - 100)\r\n",
                )
                .optional(),
            })
            .strict()
            .describe(
              "DC_ Charging_ Parameters\r\nurn:x-oca:ocpp:uid:2:233251\r\nEV DC charging parameters\r\n\r\n\r\n",
            )
            .optional(),
          requestedEnergyTransfer: z
            .enum(["DC", "AC_single_phase", "AC_two_phase", "AC_three_phase"])
            .describe(
              "Charging_ Needs. Requested. Energy_ Transfer_ Mode_ Code\r\nurn:x-oca:ocpp:uid:1:569209\r\nMode of energy transfer requested by the EV.\r\n",
            ),
          departureTime: z
            .string()
            .datetime()
            .describe(
              "Charging_ Needs. Departure_ Time. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569223\r\nEstimated departure time of the EV.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe("Charging_ Needs\r\nurn:x-oca:ocpp:uid:2:233249\r\n"),
      evseId: z
        .number()
        .int()
        .describe(
          "Defines the EVSE and connector to which the EV is connected. EvseId may not be 0.\r\n",
        ),
    })
    .strict(),

  NotifyEVChargingSchedule: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      timeBase: z
        .string()
        .datetime()
        .describe(
          "Periods contained in the charging profile are relative to this point in time.\r\n",
        ),
      chargingSchedule: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          id: z.number().int().describe("Identifies the ChargingSchedule.\r\n"),
          startSchedule: z
            .string()
            .datetime()
            .describe(
              "Charging_ Schedule. Start_ Schedule. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569237\r\nStarting point of an absolute schedule. If absent the schedule will be relative to start of charging.\r\n",
            )
            .optional(),
          duration: z
            .number()
            .int()
            .describe(
              "Charging_ Schedule. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569236\r\nDuration of the charging schedule in seconds. If the duration is left empty, the last period will continue indefinitely or until end of the transaction if chargingProfilePurpose = TxProfile.\r\n",
            )
            .optional(),
          chargingRateUnit: z
            .enum(["W", "A"])
            .describe(
              "Charging_ Schedule. Charging_ Rate_ Unit. Charging_ Rate_ Unit_ Code\r\nurn:x-oca:ocpp:uid:1:569238\r\nThe unit of measure Limit is expressed in.\r\n",
            ),
          chargingSchedulePeriod: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  startPeriod: z
                    .number()
                    .int()
                    .describe(
                      "Charging_ Schedule_ Period. Start_ Period. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569240\r\nStart of the period, in seconds from the start of schedule. The value of StartPeriod also defines the stop time of the previous period.\r\n",
                    ),
                  limit: z
                    .number()
                    .describe(
                      "Charging_ Schedule_ Period. Limit. Measure\r\nurn:x-oca:ocpp:uid:1:569241\r\nCharging rate limit during the schedule period, in the applicable chargingRateUnit, for example in Amperes (A) or Watts (W). Accepts at most one digit fraction (e.g. 8.1).\r\n",
                    ),
                  numberPhases: z
                    .number()
                    .int()
                    .describe(
                      "Charging_ Schedule_ Period. Number_ Phases. Counter\r\nurn:x-oca:ocpp:uid:1:569242\r\nThe number of phases that can be used for charging. If a number of phases is needed, numberPhases=3 will be assumed unless another number is given.\r\n",
                    )
                    .optional(),
                  phaseToUse: z
                    .number()
                    .int()
                    .describe(
                      "Values: 1..3, Used if numberPhases=1 and if the EVSE is capable of switching the phase connected to the EV, i.e. ACPhaseSwitchingSupported is defined and true. It’s not allowed unless both conditions above are true. If both conditions are true, and phaseToUse is omitted, the Charging Station / EVSE will make the selection on its own.\r\n\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe(
                  "Charging_ Schedule_ Period\r\nurn:x-oca:ocpp:uid:2:233257\r\nCharging schedule period structure defines a time period in a charging schedule.\r\n",
                ),
            )
            .min(1)
            .max(1024),
          minChargingRate: z
            .number()
            .describe(
              "Charging_ Schedule. Min_ Charging_ Rate. Numeric\r\nurn:x-oca:ocpp:uid:1:569239\r\nMinimum charging rate supported by the EV. The unit of measure is defined by the chargingRateUnit. This parameter is intended to be used by a local smart charging algorithm to optimize the power allocation for in the case a charging process is inefficient at lower charging rates. Accepts at most one digit fraction (e.g. 8.1)\r\n",
            )
            .optional(),
          salesTariff: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              id: z
                .number()
                .int()
                .describe(
                  "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nSalesTariff identifier used to identify one sales tariff. An SAID remains a unique identifier for one schedule throughout a charging session.\r\n",
                ),
              salesTariffDescription: z
                .string()
                .max(32)
                .describe(
                  "Sales_ Tariff. Sales. Tariff_ Description\r\nurn:x-oca:ocpp:uid:1:569283\r\nA human readable title/short description of the sales tariff e.g. for HMI display purposes.\r\n",
                )
                .optional(),
              numEPriceLevels: z
                .number()
                .int()
                .describe(
                  "Sales_ Tariff. Num_ E_ Price_ Levels. Counter\r\nurn:x-oca:ocpp:uid:1:569284\r\nDefines the overall number of distinct price levels used across all provided SalesTariff elements.\r\n",
                )
                .optional(),
              salesTariffEntry: z
                .array(
                  z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      relativeTimeInterval: z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          start: z
                            .number()
                            .int()
                            .describe(
                              "Relative_ Timer_ Interval. Start. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569279\r\nStart of the interval, in seconds from NOW.\r\n",
                            ),
                          duration: z
                            .number()
                            .int()
                            .describe(
                              "Relative_ Timer_ Interval. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569280\r\nDuration of the interval, in seconds.\r\n",
                            )
                            .optional(),
                        })
                        .strict()
                        .describe(
                          "Relative_ Timer_ Interval\r\nurn:x-oca:ocpp:uid:2:233270\r\n",
                        ),
                      ePriceLevel: z
                        .number()
                        .int()
                        .gte(0)
                        .describe(
                          "Sales_ Tariff_ Entry. E_ Price_ Level. Unsigned_ Integer\r\nurn:x-oca:ocpp:uid:1:569281\r\nDefines the price level of this SalesTariffEntry (referring to NumEPriceLevels). Small values for the EPriceLevel represent a cheaper TariffEntry. Large values for the EPriceLevel represent a more expensive TariffEntry.\r\n",
                        )
                        .optional(),
                      consumptionCost: z
                        .array(
                          z
                            .object({
                              customData: z
                                .object({ vendorId: z.string().max(255) })
                                .describe(
                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                )
                                .optional(),
                              startValue: z
                                .number()
                                .describe(
                                  "Consumption_ Cost. Start_ Value. Numeric\r\nurn:x-oca:ocpp:uid:1:569246\r\nThe lowest level of consumption that defines the starting point of this consumption block. The block interval extends to the start of the next interval.\r\n",
                                ),
                              cost: z
                                .array(
                                  z
                                    .object({
                                      customData: z
                                        .object({
                                          vendorId: z.string().max(255),
                                        })
                                        .describe(
                                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                        )
                                        .optional(),
                                      costKind: z
                                        .enum([
                                          "CarbonDioxideEmission",
                                          "RelativePricePercentage",
                                          "RenewableGenerationPercentage",
                                        ])
                                        .describe(
                                          "Cost. Cost_ Kind. Cost_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569243\r\nThe kind of cost referred to in the message element amount\r\n",
                                        ),
                                      amount: z
                                        .number()
                                        .int()
                                        .describe(
                                          "Cost. Amount. Amount\r\nurn:x-oca:ocpp:uid:1:569244\r\nThe estimated or actual cost per kWh\r\n",
                                        ),
                                      amountMultiplier: z
                                        .number()
                                        .int()
                                        .describe(
                                          "Cost. Amount_ Multiplier. Integer\r\nurn:x-oca:ocpp:uid:1:569245\r\nValues: -3..3, The amountMultiplier defines the exponent to base 10 (dec). The final value is determined by: amount * 10 ^ amountMultiplier\r\n",
                                        )
                                        .optional(),
                                    })
                                    .strict()
                                    .describe(
                                      "Cost\r\nurn:x-oca:ocpp:uid:2:233258\r\n",
                                    ),
                                )
                                .min(1)
                                .max(3),
                            })
                            .strict()
                            .describe(
                              "Consumption_ Cost\r\nurn:x-oca:ocpp:uid:2:233259\r\n",
                            ),
                        )
                        .min(1)
                        .max(3)
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "Sales_ Tariff_ Entry\r\nurn:x-oca:ocpp:uid:2:233271\r\n",
                    ),
                )
                .min(1)
                .max(1024),
            })
            .strict()
            .describe(
              "Sales_ Tariff\r\nurn:x-oca:ocpp:uid:2:233272\r\nNOTE: This dataType is based on dataTypes from &lt;&lt;ref-ISOIEC15118-2,ISO 15118-2&gt;&gt;.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Charging_ Schedule\r\nurn:x-oca:ocpp:uid:2:233256\r\nCharging schedule structure defines a list of charging periods, as used in: GetCompositeSchedule.conf and ChargingProfile. \r\n",
        ),
      evseId: z
        .number()
        .int()
        .describe(
          "The charging schedule contained in this notification applies to an EVSE. EvseId must be &gt; 0.\r\n",
        ),
    })
    .strict(),

  NotifyEvent: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      generatedAt: z
        .string()
        .datetime()
        .describe(
          "Timestamp of the moment this message was generated at the Charging Station.\r\n",
        ),
      tbc: z
        .boolean()
        .describe(
          "“to be continued” indicator. Indicates whether another part of the report follows in an upcoming notifyEventRequest message. Default value when omitted is false. \r\n",
        )
        .default(false),
      seqNo: z
        .number()
        .int()
        .describe(
          "Sequence number of this message. First message starts at 0.\r\n",
        ),
      eventData: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              eventId: z
                .number()
                .int()
                .describe(
                  "Identifies the event. This field can be referred to as a cause by other events.\r\n\r\n",
                ),
              timestamp: z
                .string()
                .datetime()
                .describe(
                  "Timestamp of the moment the report was generated.\r\n",
                ),
              trigger: z
                .enum(["Alerting", "Delta", "Periodic"])
                .describe(
                  "Type of monitor that triggered this event, e.g. exceeding a threshold value.\r\n\r\n",
                ),
              cause: z
                .number()
                .int()
                .describe(
                  "Refers to the Id of an event that is considered to be the cause for this event.\r\n\r\n",
                )
                .optional(),
              actualValue: z
                .string()
                .max(2500)
                .describe(
                  "Actual value (_attributeType_ Actual) of the variable.\r\n\r\nThe Configuration Variable &lt;&lt;configkey-reporting-value-size,ReportingValueSize&gt;&gt; can be used to limit GetVariableResult.attributeValue, VariableAttribute.value and EventData.actualValue. The max size of these values will always remain equal. \r\n\r\n",
                ),
              techCode: z
                .string()
                .max(50)
                .describe(
                  "Technical (error) code as reported by component.\r\n",
                )
                .optional(),
              techInfo: z
                .string()
                .max(500)
                .describe(
                  "Technical detail information as reported by component.\r\n",
                )
                .optional(),
              cleared: z
                .boolean()
                .describe(
                  "_Cleared_ is set to true to report the clearing of a monitored situation, i.e. a 'return to normal'. \r\n\r\n",
                )
                .optional(),
              transactionId: z
                .string()
                .max(36)
                .describe(
                  "If an event notification is linked to a specific transaction, this field can be used to specify its transactionId.\r\n",
                )
                .optional(),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variableMonitoringId: z
                .number()
                .int()
                .describe(
                  "Identifies the VariableMonitoring which triggered the event.\r\n",
                )
                .optional(),
              eventNotificationType: z
                .enum([
                  "HardWiredNotification",
                  "HardWiredMonitor",
                  "PreconfiguredMonitor",
                  "CustomMonitor",
                ])
                .describe(
                  "Specifies the event notification type of the message.\r\n\r\n",
                ),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n"),
            })
            .strict()
            .describe(
              "Class to report an event notification for a component-variable.\r\n",
            ),
        )
        .min(1),
    })
    .strict(),

  NotifyMonitoringReport: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      monitor: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n"),
              variableMonitoring: z
                .array(
                  z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe("Identifies the monitor.\r\n"),
                      transaction: z
                        .boolean()
                        .describe(
                          "Monitor only active when a transaction is ongoing on a component relevant to this transaction. \r\n",
                        ),
                      value: z
                        .number()
                        .describe(
                          "Value for threshold or delta monitoring.\r\nFor Periodic or PeriodicClockAligned this is the interval in seconds.\r\n",
                        ),
                      type: z
                        .enum([
                          "UpperThreshold",
                          "LowerThreshold",
                          "Delta",
                          "Periodic",
                          "PeriodicClockAligned",
                        ])
                        .describe(
                          "The type of this monitor, e.g. a threshold, delta or periodic monitor. \r\n",
                        ),
                      severity: z
                        .number()
                        .int()
                        .describe(
                          "The severity that will be assigned to an event that is triggered by this monitor. The severity range is 0-9, with 0 as the highest and 9 as the lowest severity level.\r\n\r\nThe severity levels have the following meaning: +\r\n*0-Danger* +\r\nIndicates lives are potentially in danger. Urgent attention is needed and action should be taken immediately. +\r\n*1-Hardware Failure* +\r\nIndicates that the Charging Station is unable to continue regular operations due to Hardware issues. Action is required. +\r\n*2-System Failure* +\r\nIndicates that the Charging Station is unable to continue regular operations due to software or minor hardware issues. Action is required. +\r\n*3-Critical* +\r\nIndicates a critical error. Action is required. +\r\n*4-Error* +\r\nIndicates a non-urgent error. Action is required. +\r\n*5-Alert* +\r\nIndicates an alert event. Default severity for any type of monitoring event.  +\r\n*6-Warning* +\r\nIndicates a warning event. Action may be required. +\r\n*7-Notice* +\r\nIndicates an unusual event. No immediate action is required. +\r\n*8-Informational* +\r\nIndicates a regular operational event. May be used for reporting, measuring throughput, etc. No action is required. +\r\n*9-Debug* +\r\nIndicates information useful to developers for debugging, not useful during operations.\r\n",
                        ),
                    })
                    .strict()
                    .describe("A monitoring setting for a variable.\r\n"),
                )
                .min(1),
            })
            .strict()
            .describe(
              "Class to hold parameters of SetVariableMonitoring request.\r\n",
            ),
        )
        .min(1)
        .optional(),
      requestId: z
        .number()
        .int()
        .describe(
          "The id of the GetMonitoringRequest that requested this report.\r\n\r\n",
        ),
      tbc: z
        .boolean()
        .describe(
          "“to be continued” indicator. Indicates whether another part of the monitoringData follows in an upcoming notifyMonitoringReportRequest message. Default value when omitted is false.\r\n",
        )
        .default(false),
      seqNo: z
        .number()
        .int()
        .describe(
          "Sequence number of this message. First message starts at 0.\r\n",
        ),
      generatedAt: z
        .string()
        .datetime()
        .describe(
          "Timestamp of the moment this message was generated at the Charging Station.\r\n",
        ),
    })
    .strict(),

  NotifyReport: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      requestId: z
        .number()
        .int()
        .describe(
          "The id of the GetReportRequest  or GetBaseReportRequest that requested this report\r\n",
        ),
      generatedAt: z
        .string()
        .datetime()
        .describe(
          "Timestamp of the moment this message was generated at the Charging Station.\r\n",
        ),
      reportData: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n"),
              variableAttribute: z
                .array(
                  z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      type: z
                        .enum(["Actual", "Target", "MinSet", "MaxSet"])
                        .describe(
                          "Attribute: Actual, MinSet, MaxSet, etc.\r\nDefaults to Actual if absent.\r\n",
                        )
                        .default("Actual"),
                      value: z
                        .string()
                        .max(2500)
                        .describe(
                          "Value of the attribute. May only be omitted when mutability is set to 'WriteOnly'.\r\n\r\nThe Configuration Variable &lt;&lt;configkey-reporting-value-size,ReportingValueSize&gt;&gt; can be used to limit GetVariableResult.attributeValue, VariableAttribute.value and EventData.actualValue. The max size of these values will always remain equal. \r\n",
                        )
                        .optional(),
                      mutability: z
                        .enum(["ReadOnly", "WriteOnly", "ReadWrite"])
                        .describe(
                          "Defines the mutability of this attribute. Default is ReadWrite when omitted.\r\n",
                        )
                        .default("ReadWrite"),
                      persistent: z
                        .boolean()
                        .describe(
                          "If true, value will be persistent across system reboots or power down. Default when omitted is false.\r\n",
                        )
                        .default(false),
                      constant: z
                        .boolean()
                        .describe(
                          "If true, value that will never be changed by the Charging Station at runtime. Default when omitted is false.\r\n",
                        )
                        .default(false),
                    })
                    .strict()
                    .describe("Attribute data of a variable.\r\n"),
                )
                .min(1)
                .max(4),
              variableCharacteristics: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  unit: z
                    .string()
                    .max(16)
                    .describe(
                      "Unit of the variable. When the transmitted value has a unit, this field SHALL be included.\r\n",
                    )
                    .optional(),
                  dataType: z
                    .enum([
                      "string",
                      "decimal",
                      "integer",
                      "dateTime",
                      "boolean",
                      "OptionList",
                      "SequenceList",
                      "MemberList",
                    ])
                    .describe("Data type of this variable.\r\n"),
                  minLimit: z
                    .number()
                    .describe("Minimum possible value of this variable.\r\n")
                    .optional(),
                  maxLimit: z
                    .number()
                    .describe(
                      "Maximum possible value of this variable. When the datatype of this Variable is String, OptionList, SequenceList or MemberList, this field defines the maximum length of the (CSV) string.\r\n",
                    )
                    .optional(),
                  valuesList: z
                    .string()
                    .max(1000)
                    .describe(
                      "Allowed values when variable is Option/Member/SequenceList. \r\n\r\n* OptionList: The (Actual) Variable value must be a single value from the reported (CSV) enumeration list.\r\n\r\n* MemberList: The (Actual) Variable value  may be an (unordered) (sub-)set of the reported (CSV) valid values list.\r\n\r\n* SequenceList: The (Actual) Variable value  may be an ordered (priority, etc)  (sub-)set of the reported (CSV) valid values.\r\n\r\nThis is a comma separated list.\r\n\r\nThe Configuration Variable &lt;&lt;configkey-configuration-value-size,ConfigurationValueSize&gt;&gt; can be used to limit SetVariableData.attributeValue and VariableCharacteristics.valueList. The max size of these values will always remain equal. \r\n\r\n",
                    )
                    .optional(),
                  supportsMonitoring: z
                    .boolean()
                    .describe(
                      "Flag indicating if this variable supports monitoring. \r\n",
                    ),
                })
                .strict()
                .describe("Fixed read-only parameters of a variable.\r\n")
                .optional(),
            })
            .strict()
            .describe(
              "Class to report components, variables and variable attributes and characteristics.\r\n",
            ),
        )
        .min(1)
        .optional(),
      tbc: z
        .boolean()
        .describe(
          "“to be continued” indicator. Indicates whether another part of the report follows in an upcoming notifyReportRequest message. Default value when omitted is false.\r\n\r\n",
        )
        .default(false),
      seqNo: z
        .number()
        .int()
        .describe(
          "Sequence number of this message. First message starts at 0.\r\n",
        ),
    })
    .strict(),

  PublishFirmware: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      location: z
        .string()
        .max(512)
        .describe(
          "This contains a string containing a URI pointing to a\r\nlocation from which to retrieve the firmware.\r\n",
        ),
      retries: z
        .number()
        .int()
        .describe(
          "This specifies how many times Charging Station must try\r\nto download the firmware before giving up. If this field is not\r\npresent, it is left to Charging Station to decide how many times it wants to retry.\r\n",
        )
        .optional(),
      checksum: z
        .string()
        .max(32)
        .describe(
          "The MD5 checksum over the entire firmware file as a hexadecimal string of length 32. \r\n",
        ),
      requestId: z.number().int().describe("The Id of the request.\r\n"),
      retryInterval: z
        .number()
        .int()
        .describe(
          "The interval in seconds\r\nafter which a retry may be\r\nattempted. If this field is not\r\npresent, it is left to Charging\r\nStation to decide how long to wait\r\nbetween attempts.\r\n",
        )
        .optional(),
    })
    .strict(),

  PublishFirmwareStatusNotification: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      status: z
        .enum([
          "Idle",
          "DownloadScheduled",
          "Downloading",
          "Downloaded",
          "Published",
          "DownloadFailed",
          "DownloadPaused",
          "InvalidChecksum",
          "ChecksumVerified",
          "PublishFailed",
        ])
        .describe(
          "This contains the progress status of the publishfirmware\r\ninstallation.\r\n",
        ),
      location: z
        .array(z.string().max(512))
        .min(1)
        .describe(
          "Required if status is Published. Can be multiple URI’s, if the Local Controller supports e.g. HTTP, HTTPS, and FTP.\r\n",
        )
        .optional(),
      requestId: z
        .number()
        .int()
        .describe(
          "The request id that was\r\nprovided in the\r\nPublishFirmwareRequest which\r\ntriggered this action.\r\n",
        )
        .optional(),
    })
    .strict(),

  ReportChargingProfiles: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      requestId: z
        .number()
        .int()
        .describe(
          "Id used to match the &lt;&lt;getchargingprofilesrequest, GetChargingProfilesRequest&gt;&gt; message with the resulting ReportChargingProfilesRequest messages. When the CSMS provided a requestId in the &lt;&lt;getchargingprofilesrequest, GetChargingProfilesRequest&gt;&gt;, this field SHALL contain the same value.\r\n",
        ),
      chargingLimitSource: z
        .enum(["EMS", "Other", "SO", "CSO"])
        .describe("Source that has installed this charging profile.\r\n"),
      chargingProfile: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              id: z
                .number()
                .int()
                .describe(
                  "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nId of ChargingProfile.\r\n",
                ),
              stackLevel: z
                .number()
                .int()
                .describe(
                  "Charging_ Profile. Stack_ Level. Counter\r\nurn:x-oca:ocpp:uid:1:569230\r\nValue determining level in hierarchy stack of profiles. Higher values have precedence over lower values. Lowest level is 0.\r\n",
                ),
              chargingProfilePurpose: z
                .enum([
                  "ChargingStationExternalConstraints",
                  "ChargingStationMaxProfile",
                  "TxDefaultProfile",
                  "TxProfile",
                ])
                .describe(
                  "Charging_ Profile. Charging_ Profile_ Purpose. Charging_ Profile_ Purpose_ Code\r\nurn:x-oca:ocpp:uid:1:569231\r\nDefines the purpose of the schedule transferred by this profile\r\n",
                ),
              chargingProfileKind: z
                .enum(["Absolute", "Recurring", "Relative"])
                .describe(
                  "Charging_ Profile. Charging_ Profile_ Kind. Charging_ Profile_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569232\r\nIndicates the kind of schedule.\r\n",
                ),
              recurrencyKind: z
                .enum(["Daily", "Weekly"])
                .describe(
                  "Charging_ Profile. Recurrency_ Kind. Recurrency_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569233\r\nIndicates the start point of a recurrence.\r\n",
                )
                .optional(),
              validFrom: z
                .string()
                .datetime()
                .describe(
                  "Charging_ Profile. Valid_ From. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569234\r\nPoint in time at which the profile starts to be valid. If absent, the profile is valid as soon as it is received by the Charging Station.\r\n",
                )
                .optional(),
              validTo: z
                .string()
                .datetime()
                .describe(
                  "Charging_ Profile. Valid_ To. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569235\r\nPoint in time at which the profile stops to be valid. If absent, the profile is valid until it is replaced by another profile.\r\n",
                )
                .optional(),
              chargingSchedule: z
                .array(
                  z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe("Identifies the ChargingSchedule.\r\n"),
                      startSchedule: z
                        .string()
                        .datetime()
                        .describe(
                          "Charging_ Schedule. Start_ Schedule. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569237\r\nStarting point of an absolute schedule. If absent the schedule will be relative to start of charging.\r\n",
                        )
                        .optional(),
                      duration: z
                        .number()
                        .int()
                        .describe(
                          "Charging_ Schedule. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569236\r\nDuration of the charging schedule in seconds. If the duration is left empty, the last period will continue indefinitely or until end of the transaction if chargingProfilePurpose = TxProfile.\r\n",
                        )
                        .optional(),
                      chargingRateUnit: z
                        .enum(["W", "A"])
                        .describe(
                          "Charging_ Schedule. Charging_ Rate_ Unit. Charging_ Rate_ Unit_ Code\r\nurn:x-oca:ocpp:uid:1:569238\r\nThe unit of measure Limit is expressed in.\r\n",
                        ),
                      chargingSchedulePeriod: z
                        .array(
                          z
                            .object({
                              customData: z
                                .object({ vendorId: z.string().max(255) })
                                .describe(
                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                )
                                .optional(),
                              startPeriod: z
                                .number()
                                .int()
                                .describe(
                                  "Charging_ Schedule_ Period. Start_ Period. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569240\r\nStart of the period, in seconds from the start of schedule. The value of StartPeriod also defines the stop time of the previous period.\r\n",
                                ),
                              limit: z
                                .number()
                                .describe(
                                  "Charging_ Schedule_ Period. Limit. Measure\r\nurn:x-oca:ocpp:uid:1:569241\r\nCharging rate limit during the schedule period, in the applicable chargingRateUnit, for example in Amperes (A) or Watts (W). Accepts at most one digit fraction (e.g. 8.1).\r\n",
                                ),
                              numberPhases: z
                                .number()
                                .int()
                                .describe(
                                  "Charging_ Schedule_ Period. Number_ Phases. Counter\r\nurn:x-oca:ocpp:uid:1:569242\r\nThe number of phases that can be used for charging. If a number of phases is needed, numberPhases=3 will be assumed unless another number is given.\r\n",
                                )
                                .optional(),
                              phaseToUse: z
                                .number()
                                .int()
                                .describe(
                                  "Values: 1..3, Used if numberPhases=1 and if the EVSE is capable of switching the phase connected to the EV, i.e. ACPhaseSwitchingSupported is defined and true. It’s not allowed unless both conditions above are true. If both conditions are true, and phaseToUse is omitted, the Charging Station / EVSE will make the selection on its own.\r\n\r\n",
                                )
                                .optional(),
                            })
                            .strict()
                            .describe(
                              "Charging_ Schedule_ Period\r\nurn:x-oca:ocpp:uid:2:233257\r\nCharging schedule period structure defines a time period in a charging schedule.\r\n",
                            ),
                        )
                        .min(1)
                        .max(1024),
                      minChargingRate: z
                        .number()
                        .describe(
                          "Charging_ Schedule. Min_ Charging_ Rate. Numeric\r\nurn:x-oca:ocpp:uid:1:569239\r\nMinimum charging rate supported by the EV. The unit of measure is defined by the chargingRateUnit. This parameter is intended to be used by a local smart charging algorithm to optimize the power allocation for in the case a charging process is inefficient at lower charging rates. Accepts at most one digit fraction (e.g. 8.1)\r\n",
                        )
                        .optional(),
                      salesTariff: z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          id: z
                            .number()
                            .int()
                            .describe(
                              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nSalesTariff identifier used to identify one sales tariff. An SAID remains a unique identifier for one schedule throughout a charging session.\r\n",
                            ),
                          salesTariffDescription: z
                            .string()
                            .max(32)
                            .describe(
                              "Sales_ Tariff. Sales. Tariff_ Description\r\nurn:x-oca:ocpp:uid:1:569283\r\nA human readable title/short description of the sales tariff e.g. for HMI display purposes.\r\n",
                            )
                            .optional(),
                          numEPriceLevels: z
                            .number()
                            .int()
                            .describe(
                              "Sales_ Tariff. Num_ E_ Price_ Levels. Counter\r\nurn:x-oca:ocpp:uid:1:569284\r\nDefines the overall number of distinct price levels used across all provided SalesTariff elements.\r\n",
                            )
                            .optional(),
                          salesTariffEntry: z
                            .array(
                              z
                                .object({
                                  customData: z
                                    .object({ vendorId: z.string().max(255) })
                                    .describe(
                                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                    )
                                    .optional(),
                                  relativeTimeInterval: z
                                    .object({
                                      customData: z
                                        .object({
                                          vendorId: z.string().max(255),
                                        })
                                        .describe(
                                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                        )
                                        .optional(),
                                      start: z
                                        .number()
                                        .int()
                                        .describe(
                                          "Relative_ Timer_ Interval. Start. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569279\r\nStart of the interval, in seconds from NOW.\r\n",
                                        ),
                                      duration: z
                                        .number()
                                        .int()
                                        .describe(
                                          "Relative_ Timer_ Interval. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569280\r\nDuration of the interval, in seconds.\r\n",
                                        )
                                        .optional(),
                                    })
                                    .strict()
                                    .describe(
                                      "Relative_ Timer_ Interval\r\nurn:x-oca:ocpp:uid:2:233270\r\n",
                                    ),
                                  ePriceLevel: z
                                    .number()
                                    .int()
                                    .gte(0)
                                    .describe(
                                      "Sales_ Tariff_ Entry. E_ Price_ Level. Unsigned_ Integer\r\nurn:x-oca:ocpp:uid:1:569281\r\nDefines the price level of this SalesTariffEntry (referring to NumEPriceLevels). Small values for the EPriceLevel represent a cheaper TariffEntry. Large values for the EPriceLevel represent a more expensive TariffEntry.\r\n",
                                    )
                                    .optional(),
                                  consumptionCost: z
                                    .array(
                                      z
                                        .object({
                                          customData: z
                                            .object({
                                              vendorId: z.string().max(255),
                                            })
                                            .describe(
                                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                            )
                                            .optional(),
                                          startValue: z
                                            .number()
                                            .describe(
                                              "Consumption_ Cost. Start_ Value. Numeric\r\nurn:x-oca:ocpp:uid:1:569246\r\nThe lowest level of consumption that defines the starting point of this consumption block. The block interval extends to the start of the next interval.\r\n",
                                            ),
                                          cost: z
                                            .array(
                                              z
                                                .object({
                                                  customData: z
                                                    .object({
                                                      vendorId: z
                                                        .string()
                                                        .max(255),
                                                    })
                                                    .describe(
                                                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                                    )
                                                    .optional(),
                                                  costKind: z
                                                    .enum([
                                                      "CarbonDioxideEmission",
                                                      "RelativePricePercentage",
                                                      "RenewableGenerationPercentage",
                                                    ])
                                                    .describe(
                                                      "Cost. Cost_ Kind. Cost_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569243\r\nThe kind of cost referred to in the message element amount\r\n",
                                                    ),
                                                  amount: z
                                                    .number()
                                                    .int()
                                                    .describe(
                                                      "Cost. Amount. Amount\r\nurn:x-oca:ocpp:uid:1:569244\r\nThe estimated or actual cost per kWh\r\n",
                                                    ),
                                                  amountMultiplier: z
                                                    .number()
                                                    .int()
                                                    .describe(
                                                      "Cost. Amount_ Multiplier. Integer\r\nurn:x-oca:ocpp:uid:1:569245\r\nValues: -3..3, The amountMultiplier defines the exponent to base 10 (dec). The final value is determined by: amount * 10 ^ amountMultiplier\r\n",
                                                    )
                                                    .optional(),
                                                })
                                                .strict()
                                                .describe(
                                                  "Cost\r\nurn:x-oca:ocpp:uid:2:233258\r\n",
                                                ),
                                            )
                                            .min(1)
                                            .max(3),
                                        })
                                        .strict()
                                        .describe(
                                          "Consumption_ Cost\r\nurn:x-oca:ocpp:uid:2:233259\r\n",
                                        ),
                                    )
                                    .min(1)
                                    .max(3)
                                    .optional(),
                                })
                                .strict()
                                .describe(
                                  "Sales_ Tariff_ Entry\r\nurn:x-oca:ocpp:uid:2:233271\r\n",
                                ),
                            )
                            .min(1)
                            .max(1024),
                        })
                        .strict()
                        .describe(
                          "Sales_ Tariff\r\nurn:x-oca:ocpp:uid:2:233272\r\nNOTE: This dataType is based on dataTypes from &lt;&lt;ref-ISOIEC15118-2,ISO 15118-2&gt;&gt;.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "Charging_ Schedule\r\nurn:x-oca:ocpp:uid:2:233256\r\nCharging schedule structure defines a list of charging periods, as used in: GetCompositeSchedule.conf and ChargingProfile. \r\n",
                    ),
                )
                .min(1)
                .max(3),
              transactionId: z
                .string()
                .max(36)
                .describe(
                  "SHALL only be included if ChargingProfilePurpose is set to TxProfile. The transactionId is used to match the profile to a specific transaction.\r\n",
                )
                .optional(),
            })
            .strict()
            .describe(
              "Charging_ Profile\r\nurn:x-oca:ocpp:uid:2:233255\r\nA ChargingProfile consists of ChargingSchedule, describing the amount of power or current that can be delivered per time interval.\r\n",
            ),
        )
        .min(1),
      tbc: z
        .boolean()
        .describe(
          "To Be Continued. Default value when omitted: false. false indicates that there are no further messages as part of this report.\r\n",
        )
        .default(false),
      evseId: z
        .number()
        .int()
        .describe(
          "The evse to which the charging profile applies. If evseId = 0, the message contains an overall limit for the Charging Station.\r\n",
        ),
    })
    .strict(),

  RequestStartTransaction: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      evseId: z
        .number()
        .int()
        .describe(
          "Number of the EVSE on which to start the transaction. EvseId SHALL be &gt; 0\r\n",
        )
        .optional(),
      groupIdToken: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          additionalInfo: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalIdToken: z
                    .string()
                    .max(36)
                    .describe(
                      "This field specifies the additional IdToken.\r\n",
                    ),
                  type: z
                    .string()
                    .max(50)
                    .describe(
                      "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
            )
            .min(1)
            .optional(),
          idToken: z
            .string()
            .max(36)
            .describe(
              "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
            ),
          type: z
            .enum([
              "Central",
              "eMAID",
              "ISO14443",
              "ISO15693",
              "KeyCode",
              "Local",
              "MacAddress",
              "NoAuthorization",
            ])
            .describe("Enumeration of possible idToken types.\r\n"),
        })
        .strict()
        .describe(
          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
        )
        .optional(),
      idToken: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          additionalInfo: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalIdToken: z
                    .string()
                    .max(36)
                    .describe(
                      "This field specifies the additional IdToken.\r\n",
                    ),
                  type: z
                    .string()
                    .max(50)
                    .describe(
                      "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
            )
            .min(1)
            .optional(),
          idToken: z
            .string()
            .max(36)
            .describe(
              "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
            ),
          type: z
            .enum([
              "Central",
              "eMAID",
              "ISO14443",
              "ISO15693",
              "KeyCode",
              "Local",
              "MacAddress",
              "NoAuthorization",
            ])
            .describe("Enumeration of possible idToken types.\r\n"),
        })
        .strict()
        .describe(
          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
        ),
      remoteStartId: z
        .number()
        .int()
        .describe(
          "Id given by the server to this start request. The Charging Station might return this in the &lt;&lt;transactioneventrequest, TransactionEventRequest&gt;&gt;, letting the server know which transaction was started for this request. Use to start a transaction.\r\n",
        ),
      chargingProfile: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          id: z
            .number()
            .int()
            .describe(
              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nId of ChargingProfile.\r\n",
            ),
          stackLevel: z
            .number()
            .int()
            .describe(
              "Charging_ Profile. Stack_ Level. Counter\r\nurn:x-oca:ocpp:uid:1:569230\r\nValue determining level in hierarchy stack of profiles. Higher values have precedence over lower values. Lowest level is 0.\r\n",
            ),
          chargingProfilePurpose: z
            .enum([
              "ChargingStationExternalConstraints",
              "ChargingStationMaxProfile",
              "TxDefaultProfile",
              "TxProfile",
            ])
            .describe(
              "Charging_ Profile. Charging_ Profile_ Purpose. Charging_ Profile_ Purpose_ Code\r\nurn:x-oca:ocpp:uid:1:569231\r\nDefines the purpose of the schedule transferred by this profile\r\n",
            ),
          chargingProfileKind: z
            .enum(["Absolute", "Recurring", "Relative"])
            .describe(
              "Charging_ Profile. Charging_ Profile_ Kind. Charging_ Profile_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569232\r\nIndicates the kind of schedule.\r\n",
            ),
          recurrencyKind: z
            .enum(["Daily", "Weekly"])
            .describe(
              "Charging_ Profile. Recurrency_ Kind. Recurrency_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569233\r\nIndicates the start point of a recurrence.\r\n",
            )
            .optional(),
          validFrom: z
            .string()
            .datetime()
            .describe(
              "Charging_ Profile. Valid_ From. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569234\r\nPoint in time at which the profile starts to be valid. If absent, the profile is valid as soon as it is received by the Charging Station.\r\n",
            )
            .optional(),
          validTo: z
            .string()
            .datetime()
            .describe(
              "Charging_ Profile. Valid_ To. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569235\r\nPoint in time at which the profile stops to be valid. If absent, the profile is valid until it is replaced by another profile.\r\n",
            )
            .optional(),
          chargingSchedule: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  id: z
                    .number()
                    .int()
                    .describe("Identifies the ChargingSchedule.\r\n"),
                  startSchedule: z
                    .string()
                    .datetime()
                    .describe(
                      "Charging_ Schedule. Start_ Schedule. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569237\r\nStarting point of an absolute schedule. If absent the schedule will be relative to start of charging.\r\n",
                    )
                    .optional(),
                  duration: z
                    .number()
                    .int()
                    .describe(
                      "Charging_ Schedule. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569236\r\nDuration of the charging schedule in seconds. If the duration is left empty, the last period will continue indefinitely or until end of the transaction if chargingProfilePurpose = TxProfile.\r\n",
                    )
                    .optional(),
                  chargingRateUnit: z
                    .enum(["W", "A"])
                    .describe(
                      "Charging_ Schedule. Charging_ Rate_ Unit. Charging_ Rate_ Unit_ Code\r\nurn:x-oca:ocpp:uid:1:569238\r\nThe unit of measure Limit is expressed in.\r\n",
                    ),
                  chargingSchedulePeriod: z
                    .array(
                      z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          startPeriod: z
                            .number()
                            .int()
                            .describe(
                              "Charging_ Schedule_ Period. Start_ Period. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569240\r\nStart of the period, in seconds from the start of schedule. The value of StartPeriod also defines the stop time of the previous period.\r\n",
                            ),
                          limit: z
                            .number()
                            .describe(
                              "Charging_ Schedule_ Period. Limit. Measure\r\nurn:x-oca:ocpp:uid:1:569241\r\nCharging rate limit during the schedule period, in the applicable chargingRateUnit, for example in Amperes (A) or Watts (W). Accepts at most one digit fraction (e.g. 8.1).\r\n",
                            ),
                          numberPhases: z
                            .number()
                            .int()
                            .describe(
                              "Charging_ Schedule_ Period. Number_ Phases. Counter\r\nurn:x-oca:ocpp:uid:1:569242\r\nThe number of phases that can be used for charging. If a number of phases is needed, numberPhases=3 will be assumed unless another number is given.\r\n",
                            )
                            .optional(),
                          phaseToUse: z
                            .number()
                            .int()
                            .describe(
                              "Values: 1..3, Used if numberPhases=1 and if the EVSE is capable of switching the phase connected to the EV, i.e. ACPhaseSwitchingSupported is defined and true. It’s not allowed unless both conditions above are true. If both conditions are true, and phaseToUse is omitted, the Charging Station / EVSE will make the selection on its own.\r\n\r\n",
                            )
                            .optional(),
                        })
                        .strict()
                        .describe(
                          "Charging_ Schedule_ Period\r\nurn:x-oca:ocpp:uid:2:233257\r\nCharging schedule period structure defines a time period in a charging schedule.\r\n",
                        ),
                    )
                    .min(1)
                    .max(1024),
                  minChargingRate: z
                    .number()
                    .describe(
                      "Charging_ Schedule. Min_ Charging_ Rate. Numeric\r\nurn:x-oca:ocpp:uid:1:569239\r\nMinimum charging rate supported by the EV. The unit of measure is defined by the chargingRateUnit. This parameter is intended to be used by a local smart charging algorithm to optimize the power allocation for in the case a charging process is inefficient at lower charging rates. Accepts at most one digit fraction (e.g. 8.1)\r\n",
                    )
                    .optional(),
                  salesTariff: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nSalesTariff identifier used to identify one sales tariff. An SAID remains a unique identifier for one schedule throughout a charging session.\r\n",
                        ),
                      salesTariffDescription: z
                        .string()
                        .max(32)
                        .describe(
                          "Sales_ Tariff. Sales. Tariff_ Description\r\nurn:x-oca:ocpp:uid:1:569283\r\nA human readable title/short description of the sales tariff e.g. for HMI display purposes.\r\n",
                        )
                        .optional(),
                      numEPriceLevels: z
                        .number()
                        .int()
                        .describe(
                          "Sales_ Tariff. Num_ E_ Price_ Levels. Counter\r\nurn:x-oca:ocpp:uid:1:569284\r\nDefines the overall number of distinct price levels used across all provided SalesTariff elements.\r\n",
                        )
                        .optional(),
                      salesTariffEntry: z
                        .array(
                          z
                            .object({
                              customData: z
                                .object({ vendorId: z.string().max(255) })
                                .describe(
                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                )
                                .optional(),
                              relativeTimeInterval: z
                                .object({
                                  customData: z
                                    .object({ vendorId: z.string().max(255) })
                                    .describe(
                                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                    )
                                    .optional(),
                                  start: z
                                    .number()
                                    .int()
                                    .describe(
                                      "Relative_ Timer_ Interval. Start. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569279\r\nStart of the interval, in seconds from NOW.\r\n",
                                    ),
                                  duration: z
                                    .number()
                                    .int()
                                    .describe(
                                      "Relative_ Timer_ Interval. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569280\r\nDuration of the interval, in seconds.\r\n",
                                    )
                                    .optional(),
                                })
                                .strict()
                                .describe(
                                  "Relative_ Timer_ Interval\r\nurn:x-oca:ocpp:uid:2:233270\r\n",
                                ),
                              ePriceLevel: z
                                .number()
                                .int()
                                .gte(0)
                                .describe(
                                  "Sales_ Tariff_ Entry. E_ Price_ Level. Unsigned_ Integer\r\nurn:x-oca:ocpp:uid:1:569281\r\nDefines the price level of this SalesTariffEntry (referring to NumEPriceLevels). Small values for the EPriceLevel represent a cheaper TariffEntry. Large values for the EPriceLevel represent a more expensive TariffEntry.\r\n",
                                )
                                .optional(),
                              consumptionCost: z
                                .array(
                                  z
                                    .object({
                                      customData: z
                                        .object({
                                          vendorId: z.string().max(255),
                                        })
                                        .describe(
                                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                        )
                                        .optional(),
                                      startValue: z
                                        .number()
                                        .describe(
                                          "Consumption_ Cost. Start_ Value. Numeric\r\nurn:x-oca:ocpp:uid:1:569246\r\nThe lowest level of consumption that defines the starting point of this consumption block. The block interval extends to the start of the next interval.\r\n",
                                        ),
                                      cost: z
                                        .array(
                                          z
                                            .object({
                                              customData: z
                                                .object({
                                                  vendorId: z.string().max(255),
                                                })
                                                .describe(
                                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                                )
                                                .optional(),
                                              costKind: z
                                                .enum([
                                                  "CarbonDioxideEmission",
                                                  "RelativePricePercentage",
                                                  "RenewableGenerationPercentage",
                                                ])
                                                .describe(
                                                  "Cost. Cost_ Kind. Cost_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569243\r\nThe kind of cost referred to in the message element amount\r\n",
                                                ),
                                              amount: z
                                                .number()
                                                .int()
                                                .describe(
                                                  "Cost. Amount. Amount\r\nurn:x-oca:ocpp:uid:1:569244\r\nThe estimated or actual cost per kWh\r\n",
                                                ),
                                              amountMultiplier: z
                                                .number()
                                                .int()
                                                .describe(
                                                  "Cost. Amount_ Multiplier. Integer\r\nurn:x-oca:ocpp:uid:1:569245\r\nValues: -3..3, The amountMultiplier defines the exponent to base 10 (dec). The final value is determined by: amount * 10 ^ amountMultiplier\r\n",
                                                )
                                                .optional(),
                                            })
                                            .strict()
                                            .describe(
                                              "Cost\r\nurn:x-oca:ocpp:uid:2:233258\r\n",
                                            ),
                                        )
                                        .min(1)
                                        .max(3),
                                    })
                                    .strict()
                                    .describe(
                                      "Consumption_ Cost\r\nurn:x-oca:ocpp:uid:2:233259\r\n",
                                    ),
                                )
                                .min(1)
                                .max(3)
                                .optional(),
                            })
                            .strict()
                            .describe(
                              "Sales_ Tariff_ Entry\r\nurn:x-oca:ocpp:uid:2:233271\r\n",
                            ),
                        )
                        .min(1)
                        .max(1024),
                    })
                    .strict()
                    .describe(
                      "Sales_ Tariff\r\nurn:x-oca:ocpp:uid:2:233272\r\nNOTE: This dataType is based on dataTypes from &lt;&lt;ref-ISOIEC15118-2,ISO 15118-2&gt;&gt;.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe(
                  "Charging_ Schedule\r\nurn:x-oca:ocpp:uid:2:233256\r\nCharging schedule structure defines a list of charging periods, as used in: GetCompositeSchedule.conf and ChargingProfile. \r\n",
                ),
            )
            .min(1)
            .max(3),
          transactionId: z
            .string()
            .max(36)
            .describe(
              "SHALL only be included if ChargingProfilePurpose is set to TxProfile. The transactionId is used to match the profile to a specific transaction.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Charging_ Profile\r\nurn:x-oca:ocpp:uid:2:233255\r\nA ChargingProfile consists of ChargingSchedule, describing the amount of power or current that can be delivered per time interval.\r\n",
        )
        .optional(),
    })
    .strict(),

  RequestStopTransaction: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      transactionId: z
        .string()
        .max(36)
        .describe(
          "The identifier of the transaction which the Charging Station is requested to stop.\r\n",
        ),
    })
    .strict(),

  ReservationStatusUpdate: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      reservationId: z
        .number()
        .int()
        .describe("The ID of the reservation.\r\n"),
      reservationUpdateStatus: z
        .enum(["Expired", "Removed"])
        .describe("The updated reservation status.\r\n"),
    })
    .strict(),

  ReserveNow: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      id: z.number().int().describe("Id of reservation.\r\n"),
      expiryDateTime: z
        .string()
        .datetime()
        .describe("Date and time at which the reservation expires.\r\n"),
      connectorType: z
        .enum([
          "cCCS1",
          "cCCS2",
          "cG105",
          "cTesla",
          "cType1",
          "cType2",
          "s309-1P-16A",
          "s309-1P-32A",
          "s309-3P-16A",
          "s309-3P-32A",
          "sBS1361",
          "sCEE-7-7",
          "sType2",
          "sType3",
          "Other1PhMax16A",
          "Other1PhOver16A",
          "Other3Ph",
          "Pan",
          "wInductive",
          "wResonant",
          "Undetermined",
          "Unknown",
        ])
        .describe("This field specifies the connector type.\r\n")
        .optional(),
      idToken: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          additionalInfo: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalIdToken: z
                    .string()
                    .max(36)
                    .describe(
                      "This field specifies the additional IdToken.\r\n",
                    ),
                  type: z
                    .string()
                    .max(50)
                    .describe(
                      "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
            )
            .min(1)
            .optional(),
          idToken: z
            .string()
            .max(36)
            .describe(
              "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
            ),
          type: z
            .enum([
              "Central",
              "eMAID",
              "ISO14443",
              "ISO15693",
              "KeyCode",
              "Local",
              "MacAddress",
              "NoAuthorization",
            ])
            .describe("Enumeration of possible idToken types.\r\n"),
        })
        .strict()
        .describe(
          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
        ),
      evseId: z
        .number()
        .int()
        .describe("This contains ID of the evse to be reserved.\r\n")
        .optional(),
      groupIdToken: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          additionalInfo: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalIdToken: z
                    .string()
                    .max(36)
                    .describe(
                      "This field specifies the additional IdToken.\r\n",
                    ),
                  type: z
                    .string()
                    .max(50)
                    .describe(
                      "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
            )
            .min(1)
            .optional(),
          idToken: z
            .string()
            .max(36)
            .describe(
              "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
            ),
          type: z
            .enum([
              "Central",
              "eMAID",
              "ISO14443",
              "ISO15693",
              "KeyCode",
              "Local",
              "MacAddress",
              "NoAuthorization",
            ])
            .describe("Enumeration of possible idToken types.\r\n"),
        })
        .strict()
        .describe(
          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
        )
        .optional(),
    })
    .strict(),

  Reset: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      type: z
        .enum(["Immediate", "OnIdle"])
        .describe(
          "This contains the type of reset that the Charging Station or EVSE should perform.\r\n",
        ),
      evseId: z
        .number()
        .int()
        .describe(
          "This contains the ID of a specific EVSE that needs to be reset, instead of the entire Charging Station.\r\n",
        )
        .optional(),
    })
    .strict(),

  SecurityEventNotification: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      type: z
        .string()
        .max(50)
        .describe(
          "Type of the security event. This value should be taken from the Security events list.\r\n",
        ),
      timestamp: z
        .string()
        .datetime()
        .describe("Date and time at which the event occurred.\r\n"),
      techInfo: z
        .string()
        .max(255)
        .describe(
          "Additional information about the occurred security event.\r\n",
        )
        .optional(),
    })
    .strict(),

  SendLocalList: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      localAuthorizationList: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              idToken: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalInfo: z
                    .array(
                      z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          additionalIdToken: z
                            .string()
                            .max(36)
                            .describe(
                              "This field specifies the additional IdToken.\r\n",
                            ),
                          type: z
                            .string()
                            .max(50)
                            .describe(
                              "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                            ),
                        })
                        .strict()
                        .describe(
                          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                        ),
                    )
                    .min(1)
                    .optional(),
                  idToken: z
                    .string()
                    .max(36)
                    .describe(
                      "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
                    ),
                  type: z
                    .enum([
                      "Central",
                      "eMAID",
                      "ISO14443",
                      "ISO15693",
                      "KeyCode",
                      "Local",
                      "MacAddress",
                      "NoAuthorization",
                    ])
                    .describe("Enumeration of possible idToken types.\r\n"),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
              idTokenInfo: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  status: z
                    .enum([
                      "Accepted",
                      "Blocked",
                      "ConcurrentTx",
                      "Expired",
                      "Invalid",
                      "NoCredit",
                      "NotAllowedTypeEVSE",
                      "NotAtThisLocation",
                      "NotAtThisTime",
                      "Unknown",
                    ])
                    .describe(
                      "ID_ Token. Status. Authorization_ Status\r\nurn:x-oca:ocpp:uid:1:569372\r\nCurrent status of the ID Token.\r\n",
                    ),
                  cacheExpiryDateTime: z
                    .string()
                    .datetime()
                    .describe(
                      "ID_ Token. Expiry. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569373\r\nDate and Time after which the token must be considered invalid.\r\n",
                    )
                    .optional(),
                  chargingPriority: z
                    .number()
                    .int()
                    .describe(
                      "Priority from a business point of view. Default priority is 0, The range is from -9 to 9. Higher values indicate a higher priority. The chargingPriority in &lt;&lt;transactioneventresponse,TransactionEventResponse&gt;&gt; overrules this one. \r\n",
                    )
                    .optional(),
                  language1: z
                    .string()
                    .max(8)
                    .describe(
                      "ID_ Token. Language1. Language_ Code\r\nurn:x-oca:ocpp:uid:1:569374\r\nPreferred user interface language of identifier user. Contains a language code as defined in &lt;&lt;ref-RFC5646,[RFC5646]&gt;&gt;.\r\n\r\n",
                    )
                    .optional(),
                  evseId: z
                    .array(z.number().int())
                    .min(1)
                    .describe(
                      "Only used when the IdToken is only valid for one or more specific EVSEs, not for the entire Charging Station.\r\n\r\n",
                    )
                    .optional(),
                  groupIdToken: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      additionalInfo: z
                        .array(
                          z
                            .object({
                              customData: z
                                .object({ vendorId: z.string().max(255) })
                                .describe(
                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                )
                                .optional(),
                              additionalIdToken: z
                                .string()
                                .max(36)
                                .describe(
                                  "This field specifies the additional IdToken.\r\n",
                                ),
                              type: z
                                .string()
                                .max(50)
                                .describe(
                                  "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                                ),
                            })
                            .strict()
                            .describe(
                              "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                            ),
                        )
                        .min(1)
                        .optional(),
                      idToken: z
                        .string()
                        .max(36)
                        .describe(
                          "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
                        ),
                      type: z
                        .enum([
                          "Central",
                          "eMAID",
                          "ISO14443",
                          "ISO15693",
                          "KeyCode",
                          "Local",
                          "MacAddress",
                          "NoAuthorization",
                        ])
                        .describe("Enumeration of possible idToken types.\r\n"),
                    })
                    .strict()
                    .describe(
                      "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                    )
                    .optional(),
                  language2: z
                    .string()
                    .max(8)
                    .describe(
                      "ID_ Token. Language2. Language_ Code\r\nurn:x-oca:ocpp:uid:1:569375\r\nSecond preferred user interface language of identifier user. Don’t use when language1 is omitted, has to be different from language1. Contains a language code as defined in &lt;&lt;ref-RFC5646,[RFC5646]&gt;&gt;.\r\n",
                    )
                    .optional(),
                  personalMessage: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      format: z
                        .enum(["ASCII", "HTML", "URI", "UTF8"])
                        .describe(
                          "Message_ Content. Format. Message_ Format_ Code\r\nurn:x-enexis:ecdm:uid:1:570848\r\nFormat of the message.\r\n",
                        ),
                      language: z
                        .string()
                        .max(8)
                        .describe(
                          "Message_ Content. Language. Language_ Code\r\nurn:x-enexis:ecdm:uid:1:570849\r\nMessage language identifier. Contains a language code as defined in &lt;&lt;ref-RFC5646,[RFC5646]&gt;&gt;.\r\n",
                        )
                        .optional(),
                      content: z
                        .string()
                        .max(512)
                        .describe(
                          "Message_ Content. Content. Message\r\nurn:x-enexis:ecdm:uid:1:570852\r\nMessage contents.\r\n\r\n",
                        ),
                    })
                    .strict()
                    .describe(
                      "Message_ Content\r\nurn:x-enexis:ecdm:uid:2:234490\r\nContains message details, for a message to be displayed on a Charging Station.\r\n\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe(
                  "ID_ Token\r\nurn:x-oca:ocpp:uid:2:233247\r\nContains status information about an identifier.\r\nIt is advised to not stop charging for a token that expires during charging, as ExpiryDate is only used for caching purposes. If ExpiryDate is not given, the status has no end date.\r\n",
                )
                .optional(),
            })
            .strict()
            .describe("Contains the identifier to use for authorization.\r\n"),
        )
        .min(1)
        .optional(),
      versionNumber: z
        .number()
        .int()
        .describe(
          "In case of a full update this is the version number of the full list. In case of a differential update it is the version number of the list after the update has been applied.\r\n",
        ),
      updateType: z
        .enum(["Differential", "Full"])
        .describe(
          "This contains the type of update (full or differential) of this request.\r\n",
        ),
    })
    .strict(),

  SetChargingProfile: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      evseId: z
        .number()
        .int()
        .describe(
          "For TxDefaultProfile an evseId=0 applies the profile to each individual evse. For ChargingStationMaxProfile and ChargingStationExternalConstraints an evseId=0 contains an overal limit for the whole Charging Station.\r\n",
        ),
      chargingProfile: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          id: z
            .number()
            .int()
            .describe(
              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nId of ChargingProfile.\r\n",
            ),
          stackLevel: z
            .number()
            .int()
            .describe(
              "Charging_ Profile. Stack_ Level. Counter\r\nurn:x-oca:ocpp:uid:1:569230\r\nValue determining level in hierarchy stack of profiles. Higher values have precedence over lower values. Lowest level is 0.\r\n",
            ),
          chargingProfilePurpose: z
            .enum([
              "ChargingStationExternalConstraints",
              "ChargingStationMaxProfile",
              "TxDefaultProfile",
              "TxProfile",
            ])
            .describe(
              "Charging_ Profile. Charging_ Profile_ Purpose. Charging_ Profile_ Purpose_ Code\r\nurn:x-oca:ocpp:uid:1:569231\r\nDefines the purpose of the schedule transferred by this profile\r\n",
            ),
          chargingProfileKind: z
            .enum(["Absolute", "Recurring", "Relative"])
            .describe(
              "Charging_ Profile. Charging_ Profile_ Kind. Charging_ Profile_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569232\r\nIndicates the kind of schedule.\r\n",
            ),
          recurrencyKind: z
            .enum(["Daily", "Weekly"])
            .describe(
              "Charging_ Profile. Recurrency_ Kind. Recurrency_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569233\r\nIndicates the start point of a recurrence.\r\n",
            )
            .optional(),
          validFrom: z
            .string()
            .datetime()
            .describe(
              "Charging_ Profile. Valid_ From. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569234\r\nPoint in time at which the profile starts to be valid. If absent, the profile is valid as soon as it is received by the Charging Station.\r\n",
            )
            .optional(),
          validTo: z
            .string()
            .datetime()
            .describe(
              "Charging_ Profile. Valid_ To. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569235\r\nPoint in time at which the profile stops to be valid. If absent, the profile is valid until it is replaced by another profile.\r\n",
            )
            .optional(),
          chargingSchedule: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  id: z
                    .number()
                    .int()
                    .describe("Identifies the ChargingSchedule.\r\n"),
                  startSchedule: z
                    .string()
                    .datetime()
                    .describe(
                      "Charging_ Schedule. Start_ Schedule. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569237\r\nStarting point of an absolute schedule. If absent the schedule will be relative to start of charging.\r\n",
                    )
                    .optional(),
                  duration: z
                    .number()
                    .int()
                    .describe(
                      "Charging_ Schedule. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569236\r\nDuration of the charging schedule in seconds. If the duration is left empty, the last period will continue indefinitely or until end of the transaction if chargingProfilePurpose = TxProfile.\r\n",
                    )
                    .optional(),
                  chargingRateUnit: z
                    .enum(["W", "A"])
                    .describe(
                      "Charging_ Schedule. Charging_ Rate_ Unit. Charging_ Rate_ Unit_ Code\r\nurn:x-oca:ocpp:uid:1:569238\r\nThe unit of measure Limit is expressed in.\r\n",
                    ),
                  chargingSchedulePeriod: z
                    .array(
                      z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          startPeriod: z
                            .number()
                            .int()
                            .describe(
                              "Charging_ Schedule_ Period. Start_ Period. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569240\r\nStart of the period, in seconds from the start of schedule. The value of StartPeriod also defines the stop time of the previous period.\r\n",
                            ),
                          limit: z
                            .number()
                            .describe(
                              "Charging_ Schedule_ Period. Limit. Measure\r\nurn:x-oca:ocpp:uid:1:569241\r\nCharging rate limit during the schedule period, in the applicable chargingRateUnit, for example in Amperes (A) or Watts (W). Accepts at most one digit fraction (e.g. 8.1).\r\n",
                            ),
                          numberPhases: z
                            .number()
                            .int()
                            .describe(
                              "Charging_ Schedule_ Period. Number_ Phases. Counter\r\nurn:x-oca:ocpp:uid:1:569242\r\nThe number of phases that can be used for charging. If a number of phases is needed, numberPhases=3 will be assumed unless another number is given.\r\n",
                            )
                            .optional(),
                          phaseToUse: z
                            .number()
                            .int()
                            .describe(
                              "Values: 1..3, Used if numberPhases=1 and if the EVSE is capable of switching the phase connected to the EV, i.e. ACPhaseSwitchingSupported is defined and true. It’s not allowed unless both conditions above are true. If both conditions are true, and phaseToUse is omitted, the Charging Station / EVSE will make the selection on its own.\r\n\r\n",
                            )
                            .optional(),
                        })
                        .strict()
                        .describe(
                          "Charging_ Schedule_ Period\r\nurn:x-oca:ocpp:uid:2:233257\r\nCharging schedule period structure defines a time period in a charging schedule.\r\n",
                        ),
                    )
                    .min(1)
                    .max(1024),
                  minChargingRate: z
                    .number()
                    .describe(
                      "Charging_ Schedule. Min_ Charging_ Rate. Numeric\r\nurn:x-oca:ocpp:uid:1:569239\r\nMinimum charging rate supported by the EV. The unit of measure is defined by the chargingRateUnit. This parameter is intended to be used by a local smart charging algorithm to optimize the power allocation for in the case a charging process is inefficient at lower charging rates. Accepts at most one digit fraction (e.g. 8.1)\r\n",
                    )
                    .optional(),
                  salesTariff: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nSalesTariff identifier used to identify one sales tariff. An SAID remains a unique identifier for one schedule throughout a charging session.\r\n",
                        ),
                      salesTariffDescription: z
                        .string()
                        .max(32)
                        .describe(
                          "Sales_ Tariff. Sales. Tariff_ Description\r\nurn:x-oca:ocpp:uid:1:569283\r\nA human readable title/short description of the sales tariff e.g. for HMI display purposes.\r\n",
                        )
                        .optional(),
                      numEPriceLevels: z
                        .number()
                        .int()
                        .describe(
                          "Sales_ Tariff. Num_ E_ Price_ Levels. Counter\r\nurn:x-oca:ocpp:uid:1:569284\r\nDefines the overall number of distinct price levels used across all provided SalesTariff elements.\r\n",
                        )
                        .optional(),
                      salesTariffEntry: z
                        .array(
                          z
                            .object({
                              customData: z
                                .object({ vendorId: z.string().max(255) })
                                .describe(
                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                )
                                .optional(),
                              relativeTimeInterval: z
                                .object({
                                  customData: z
                                    .object({ vendorId: z.string().max(255) })
                                    .describe(
                                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                    )
                                    .optional(),
                                  start: z
                                    .number()
                                    .int()
                                    .describe(
                                      "Relative_ Timer_ Interval. Start. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569279\r\nStart of the interval, in seconds from NOW.\r\n",
                                    ),
                                  duration: z
                                    .number()
                                    .int()
                                    .describe(
                                      "Relative_ Timer_ Interval. Duration. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569280\r\nDuration of the interval, in seconds.\r\n",
                                    )
                                    .optional(),
                                })
                                .strict()
                                .describe(
                                  "Relative_ Timer_ Interval\r\nurn:x-oca:ocpp:uid:2:233270\r\n",
                                ),
                              ePriceLevel: z
                                .number()
                                .int()
                                .gte(0)
                                .describe(
                                  "Sales_ Tariff_ Entry. E_ Price_ Level. Unsigned_ Integer\r\nurn:x-oca:ocpp:uid:1:569281\r\nDefines the price level of this SalesTariffEntry (referring to NumEPriceLevels). Small values for the EPriceLevel represent a cheaper TariffEntry. Large values for the EPriceLevel represent a more expensive TariffEntry.\r\n",
                                )
                                .optional(),
                              consumptionCost: z
                                .array(
                                  z
                                    .object({
                                      customData: z
                                        .object({
                                          vendorId: z.string().max(255),
                                        })
                                        .describe(
                                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                        )
                                        .optional(),
                                      startValue: z
                                        .number()
                                        .describe(
                                          "Consumption_ Cost. Start_ Value. Numeric\r\nurn:x-oca:ocpp:uid:1:569246\r\nThe lowest level of consumption that defines the starting point of this consumption block. The block interval extends to the start of the next interval.\r\n",
                                        ),
                                      cost: z
                                        .array(
                                          z
                                            .object({
                                              customData: z
                                                .object({
                                                  vendorId: z.string().max(255),
                                                })
                                                .describe(
                                                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                                                )
                                                .optional(),
                                              costKind: z
                                                .enum([
                                                  "CarbonDioxideEmission",
                                                  "RelativePricePercentage",
                                                  "RenewableGenerationPercentage",
                                                ])
                                                .describe(
                                                  "Cost. Cost_ Kind. Cost_ Kind_ Code\r\nurn:x-oca:ocpp:uid:1:569243\r\nThe kind of cost referred to in the message element amount\r\n",
                                                ),
                                              amount: z
                                                .number()
                                                .int()
                                                .describe(
                                                  "Cost. Amount. Amount\r\nurn:x-oca:ocpp:uid:1:569244\r\nThe estimated or actual cost per kWh\r\n",
                                                ),
                                              amountMultiplier: z
                                                .number()
                                                .int()
                                                .describe(
                                                  "Cost. Amount_ Multiplier. Integer\r\nurn:x-oca:ocpp:uid:1:569245\r\nValues: -3..3, The amountMultiplier defines the exponent to base 10 (dec). The final value is determined by: amount * 10 ^ amountMultiplier\r\n",
                                                )
                                                .optional(),
                                            })
                                            .strict()
                                            .describe(
                                              "Cost\r\nurn:x-oca:ocpp:uid:2:233258\r\n",
                                            ),
                                        )
                                        .min(1)
                                        .max(3),
                                    })
                                    .strict()
                                    .describe(
                                      "Consumption_ Cost\r\nurn:x-oca:ocpp:uid:2:233259\r\n",
                                    ),
                                )
                                .min(1)
                                .max(3)
                                .optional(),
                            })
                            .strict()
                            .describe(
                              "Sales_ Tariff_ Entry\r\nurn:x-oca:ocpp:uid:2:233271\r\n",
                            ),
                        )
                        .min(1)
                        .max(1024),
                    })
                    .strict()
                    .describe(
                      "Sales_ Tariff\r\nurn:x-oca:ocpp:uid:2:233272\r\nNOTE: This dataType is based on dataTypes from &lt;&lt;ref-ISOIEC15118-2,ISO 15118-2&gt;&gt;.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe(
                  "Charging_ Schedule\r\nurn:x-oca:ocpp:uid:2:233256\r\nCharging schedule structure defines a list of charging periods, as used in: GetCompositeSchedule.conf and ChargingProfile. \r\n",
                ),
            )
            .min(1)
            .max(3),
          transactionId: z
            .string()
            .max(36)
            .describe(
              "SHALL only be included if ChargingProfilePurpose is set to TxProfile. The transactionId is used to match the profile to a specific transaction.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Charging_ Profile\r\nurn:x-oca:ocpp:uid:2:233255\r\nA ChargingProfile consists of ChargingSchedule, describing the amount of power or current that can be delivered per time interval.\r\n",
        ),
    })
    .strict(),

  SetDisplayMessage: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      message: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          display: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              evse: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  id: z
                    .number()
                    .int()
                    .describe(
                      "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                    ),
                  connectorId: z
                    .number()
                    .int()
                    .describe(
                      "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe(
                  "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                )
                .optional(),
              name: z
                .string()
                .max(50)
                .describe(
                  "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                ),
              instance: z
                .string()
                .max(50)
                .describe(
                  "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                )
                .optional(),
            })
            .strict()
            .describe("A physical or logical component\r\n")
            .optional(),
          id: z
            .number()
            .int()
            .describe(
              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nMaster resource identifier, unique within an exchange context. It is defined within the OCPP context as a positive Integer value (greater or equal to zero).\r\n",
            ),
          priority: z
            .enum(["AlwaysFront", "InFront", "NormalCycle"])
            .describe(
              "Message_ Info. Priority. Message_ Priority_ Code\r\nurn:x-enexis:ecdm:uid:1:569253\r\nWith what priority should this message be shown\r\n",
            ),
          state: z
            .enum(["Charging", "Faulted", "Idle", "Unavailable"])
            .describe(
              "Message_ Info. State. Message_ State_ Code\r\nurn:x-enexis:ecdm:uid:1:569254\r\nDuring what state should this message be shown. When omitted this message should be shown in any state of the Charging Station.\r\n",
            )
            .optional(),
          startDateTime: z
            .string()
            .datetime()
            .describe(
              "Message_ Info. Start. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569256\r\nFrom what date-time should this message be shown. If omitted: directly.\r\n",
            )
            .optional(),
          endDateTime: z
            .string()
            .datetime()
            .describe(
              "Message_ Info. End. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569257\r\nUntil what date-time should this message be shown, after this date/time this message SHALL be removed.\r\n",
            )
            .optional(),
          transactionId: z
            .string()
            .max(36)
            .describe(
              "During which transaction shall this message be shown.\r\nMessage SHALL be removed by the Charging Station after transaction has\r\nended.\r\n",
            )
            .optional(),
          message: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              format: z
                .enum(["ASCII", "HTML", "URI", "UTF8"])
                .describe(
                  "Message_ Content. Format. Message_ Format_ Code\r\nurn:x-enexis:ecdm:uid:1:570848\r\nFormat of the message.\r\n",
                ),
              language: z
                .string()
                .max(8)
                .describe(
                  "Message_ Content. Language. Language_ Code\r\nurn:x-enexis:ecdm:uid:1:570849\r\nMessage language identifier. Contains a language code as defined in &lt;&lt;ref-RFC5646,[RFC5646]&gt;&gt;.\r\n",
                )
                .optional(),
              content: z
                .string()
                .max(512)
                .describe(
                  "Message_ Content. Content. Message\r\nurn:x-enexis:ecdm:uid:1:570852\r\nMessage contents.\r\n\r\n",
                ),
            })
            .strict()
            .describe(
              "Message_ Content\r\nurn:x-enexis:ecdm:uid:2:234490\r\nContains message details, for a message to be displayed on a Charging Station.\r\n\r\n",
            ),
        })
        .strict()
        .describe(
          "Message_ Info\r\nurn:x-enexis:ecdm:uid:2:233264\r\nContains message details, for a message to be displayed on a Charging Station.\r\n",
        ),
    })
    .strict(),

  SetMonitoringBase: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      monitoringBase: z
        .enum(["All", "FactoryDefault", "HardWiredOnly"])
        .describe("Specify which monitoring base will be set\r\n"),
    })
    .strict(),

  SetMonitoringLevel: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      severity: z
        .number()
        .int()
        .describe(
          "The Charging Station SHALL only report events with a severity number lower than or equal to this severity.\r\nThe severity range is 0-9, with 0 as the highest and 9 as the lowest severity level.\r\n\r\nThe severity levels have the following meaning: +\r\n*0-Danger* +\r\nIndicates lives are potentially in danger. Urgent attention is needed and action should be taken immediately. +\r\n*1-Hardware Failure* +\r\nIndicates that the Charging Station is unable to continue regular operations due to Hardware issues. Action is required. +\r\n*2-System Failure* +\r\nIndicates that the Charging Station is unable to continue regular operations due to software or minor hardware issues. Action is required. +\r\n*3-Critical* +\r\nIndicates a critical error. Action is required. +\r\n*4-Error* +\r\nIndicates a non-urgent error. Action is required. +\r\n*5-Alert* +\r\nIndicates an alert event. Default severity for any type of monitoring event.  +\r\n*6-Warning* +\r\nIndicates a warning event. Action may be required. +\r\n*7-Notice* +\r\nIndicates an unusual event. No immediate action is required. +\r\n*8-Informational* +\r\nIndicates a regular operational event. May be used for reporting, measuring throughput, etc. No action is required. +\r\n*9-Debug* +\r\nIndicates information useful to developers for debugging, not useful during operations.\r\n\r\n\r\n",
        ),
    })
    .strict(),

  SetNetworkProfile: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      configurationSlot: z
        .number()
        .int()
        .describe("Slot in which the configuration should be stored.\r\n"),
      connectionData: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          apn: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              apn: z
                .string()
                .max(512)
                .describe(
                  "APN. APN. URI\r\nurn:x-oca:ocpp:uid:1:568814\r\nThe Access Point Name as an URL.\r\n",
                ),
              apnUserName: z
                .string()
                .max(20)
                .describe(
                  "APN. APN. User_ Name\r\nurn:x-oca:ocpp:uid:1:568818\r\nAPN username.\r\n",
                )
                .optional(),
              apnPassword: z
                .string()
                .max(20)
                .describe(
                  "APN. APN. Password\r\nurn:x-oca:ocpp:uid:1:568819\r\nAPN Password.\r\n",
                )
                .optional(),
              simPin: z
                .number()
                .int()
                .describe(
                  "APN. SIMPIN. PIN_ Code\r\nurn:x-oca:ocpp:uid:1:568821\r\nSIM card pin code.\r\n",
                )
                .optional(),
              preferredNetwork: z
                .string()
                .max(6)
                .describe(
                  "APN. Preferred_ Network. Mobile_ Network_ ID\r\nurn:x-oca:ocpp:uid:1:568822\r\nPreferred network, written as MCC and MNC concatenated. See note.\r\n",
                )
                .optional(),
              useOnlyPreferredNetwork: z
                .boolean()
                .describe(
                  "APN. Use_ Only_ Preferred_ Network. Indicator\r\nurn:x-oca:ocpp:uid:1:568824\r\nDefault: false. Use only the preferred Network, do\r\nnot dial in when not available. See Note.\r\n",
                )
                .default(false),
              apnAuthentication: z
                .enum(["CHAP", "NONE", "PAP", "AUTO"])
                .describe(
                  "APN. APN_ Authentication. APN_ Authentication_ Code\r\nurn:x-oca:ocpp:uid:1:568828\r\nAuthentication method.\r\n",
                ),
            })
            .strict()
            .describe(
              "APN\r\nurn:x-oca:ocpp:uid:2:233134\r\nCollection of configuration data needed to make a data-connection over a cellular network.\r\n\r\nNOTE: When asking a GSM modem to dial in, it is possible to specify which mobile operator should be used. This can be done with the mobile country code (MCC) in combination with a mobile network code (MNC). Example: If your preferred network is Vodafone Netherlands, the MCC=204 and the MNC=04 which means the key PreferredNetwork = 20404 Some modems allows to specify a preferred network, which means, if this network is not available, a different network is used. If you specify UseOnlyPreferredNetwork and this network is not available, the modem will not dial in.\r\n",
            )
            .optional(),
          ocppVersion: z
            .enum(["OCPP12", "OCPP15", "OCPP16", "OCPP20"])
            .describe(
              "Communication_ Function. OCPP_ Version. OCPP_ Version_ Code\r\nurn:x-oca:ocpp:uid:1:569355\r\nDefines the OCPP version used for this communication function.\r\n",
            ),
          ocppTransport: z
            .enum(["JSON", "SOAP"])
            .describe(
              "Communication_ Function. OCPP_ Transport. OCPP_ Transport_ Code\r\nurn:x-oca:ocpp:uid:1:569356\r\nDefines the transport protocol (e.g. SOAP or JSON). Note: SOAP is not supported in OCPP 2.0, but is supported by other versions of OCPP.\r\n",
            ),
          ocppCsmsUrl: z
            .string()
            .max(512)
            .describe(
              "Communication_ Function. OCPP_ Central_ System_ URL. URI\r\nurn:x-oca:ocpp:uid:1:569357\r\nURL of the CSMS(s) that this Charging Station  communicates with.\r\n",
            ),
          messageTimeout: z
            .number()
            .int()
            .describe(
              "Duration in seconds before a message send by the Charging Station via this network connection times-out.\r\nThe best setting depends on the underlying network and response times of the CSMS.\r\nIf you are looking for a some guideline: use 30 seconds as a starting point.\r\n",
            ),
          securityProfile: z
            .number()
            .int()
            .describe(
              "This field specifies the security profile used when connecting to the CSMS with this NetworkConnectionProfile.\r\n",
            ),
          ocppInterface: z
            .enum([
              "Wired0",
              "Wired1",
              "Wired2",
              "Wired3",
              "Wireless0",
              "Wireless1",
              "Wireless2",
              "Wireless3",
            ])
            .describe("Applicable Network Interface.\r\n"),
          vpn: z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              server: z
                .string()
                .max(512)
                .describe(
                  "VPN. Server. URI\r\nurn:x-oca:ocpp:uid:1:569272\r\nVPN Server Address\r\n",
                ),
              user: z
                .string()
                .max(20)
                .describe(
                  "VPN. User. User_ Name\r\nurn:x-oca:ocpp:uid:1:569273\r\nVPN User\r\n",
                ),
              group: z
                .string()
                .max(20)
                .describe(
                  "VPN. Group. Group_ Name\r\nurn:x-oca:ocpp:uid:1:569274\r\nVPN group.\r\n",
                )
                .optional(),
              password: z
                .string()
                .max(20)
                .describe(
                  "VPN. Password. Password\r\nurn:x-oca:ocpp:uid:1:569275\r\nVPN Password.\r\n",
                ),
              key: z
                .string()
                .max(255)
                .describe(
                  "VPN. Key. VPN_ Key\r\nurn:x-oca:ocpp:uid:1:569276\r\nVPN shared secret.\r\n",
                ),
              type: z
                .enum(["IKEv2", "IPSec", "L2TP", "PPTP"])
                .describe(
                  "VPN. Type. VPN_ Code\r\nurn:x-oca:ocpp:uid:1:569277\r\nType of VPN\r\n",
                ),
            })
            .strict()
            .describe(
              "VPN\r\nurn:x-oca:ocpp:uid:2:233268\r\nVPN Configuration settings\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Communication_ Function\r\nurn:x-oca:ocpp:uid:2:233304\r\nThe NetworkConnectionProfile defines the functional and technical parameters of a communication link.\r\n",
        ),
    })
    .strict(),

  SetVariableMonitoring: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      setMonitoringData: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              id: z
                .number()
                .int()
                .describe(
                  "An id SHALL only be given to replace an existing monitor. The Charging Station handles the generation of id's for new monitors.\r\n\r\n",
                )
                .optional(),
              transaction: z
                .boolean()
                .describe(
                  "Monitor only active when a transaction is ongoing on a component relevant to this transaction. Default = false.\r\n\r\n",
                )
                .default(false),
              value: z
                .number()
                .describe(
                  "Value for threshold or delta monitoring.\r\nFor Periodic or PeriodicClockAligned this is the interval in seconds.\r\n\r\n",
                ),
              type: z
                .enum([
                  "UpperThreshold",
                  "LowerThreshold",
                  "Delta",
                  "Periodic",
                  "PeriodicClockAligned",
                ])
                .describe(
                  "The type of this monitor, e.g. a threshold, delta or periodic monitor. \r\n\r\n",
                ),
              severity: z
                .number()
                .int()
                .describe(
                  "The severity that will be assigned to an event that is triggered by this monitor. The severity range is 0-9, with 0 as the highest and 9 as the lowest severity level.\r\n\r\nThe severity levels have the following meaning: +\r\n*0-Danger* +\r\nIndicates lives are potentially in danger. Urgent attention is needed and action should be taken immediately. +\r\n*1-Hardware Failure* +\r\nIndicates that the Charging Station is unable to continue regular operations due to Hardware issues. Action is required. +\r\n*2-System Failure* +\r\nIndicates that the Charging Station is unable to continue regular operations due to software or minor hardware issues. Action is required. +\r\n*3-Critical* +\r\nIndicates a critical error. Action is required. +\r\n*4-Error* +\r\nIndicates a non-urgent error. Action is required. +\r\n*5-Alert* +\r\nIndicates an alert event. Default severity for any type of monitoring event.  +\r\n*6-Warning* +\r\nIndicates a warning event. Action may be required. +\r\n*7-Notice* +\r\nIndicates an unusual event. No immediate action is required. +\r\n*8-Informational* +\r\nIndicates a regular operational event. May be used for reporting, measuring throughput, etc. No action is required. +\r\n*9-Debug* +\r\nIndicates information useful to developers for debugging, not useful during operations.\r\n\r\n",
                ),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n"),
            })
            .strict()
            .describe(
              "Class to hold parameters of SetVariableMonitoring request.\r\n",
            ),
        )
        .min(1),
    })
    .strict(),

  SetVariables: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      setVariableData: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              attributeType: z
                .enum(["Actual", "Target", "MinSet", "MaxSet"])
                .describe(
                  "Type of attribute: Actual, Target, MinSet, MaxSet. Default is Actual when omitted.\r\n",
                )
                .default("Actual"),
              attributeValue: z
                .string()
                .max(1000)
                .describe(
                  "Value to be assigned to attribute of variable.\r\n\r\nThe Configuration Variable &lt;&lt;configkey-configuration-value-size,ConfigurationValueSize&gt;&gt; can be used to limit SetVariableData.attributeValue and VariableCharacteristics.valueList. The max size of these values will always remain equal. \r\n",
                ),
              component: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  evse: z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      id: z
                        .number()
                        .int()
                        .describe(
                          "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
                        ),
                      connectorId: z
                        .number()
                        .int()
                        .describe(
                          "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the component. Name should be taken from the list of standardized component names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the component exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("A physical or logical component\r\n"),
              variable: z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  name: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of the variable. Name should be taken from the list of standardized variable names whenever possible. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    ),
                  instance: z
                    .string()
                    .max(50)
                    .describe(
                      "Name of instance in case the variable exists as multiple instances. Case Insensitive. strongly advised to use Camel Case.\r\n",
                    )
                    .optional(),
                })
                .strict()
                .describe("Reference key to a component-variable.\r\n"),
            })
            .strict(),
        )
        .min(1),
    })
    .strict(),

  SignCertificate: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      csr: z
        .string()
        .max(5500)
        .describe(
          "The Charging Station SHALL send the public key in form of a Certificate Signing Request (CSR) as described in RFC 2986 [22] and then PEM encoded, using the &lt;&lt;signcertificaterequest,SignCertificateRequest&gt;&gt; message.\r\n",
        ),
      certificateType: z
        .enum(["ChargingStationCertificate", "V2GCertificate"])
        .describe(
          "Indicates the type of certificate that is to be signed. When omitted the certificate is to be used for both the 15118 connection (if implemented) and the Charging Station to CSMS connection.\r\n\r\n",
        )
        .optional(),
    })
    .strict(),

  StatusNotification: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      timestamp: z
        .string()
        .datetime()
        .describe(
          "The time for which the status is reported. If absent time of receipt of the message will be assumed.\r\n",
        ),
      connectorStatus: z
        .enum(["Available", "Occupied", "Reserved", "Unavailable", "Faulted"])
        .describe("This contains the current status of the Connector.\r\n"),
      evseId: z
        .number()
        .int()
        .describe(
          "The id of the EVSE to which the connector belongs for which the the status is reported.\r\n",
        ),
      connectorId: z
        .number()
        .int()
        .describe(
          "The id of the connector within the EVSE for which the status is reported.\r\n",
        ),
    })
    .strict(),

  TransactionEvent: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      eventType: z
        .enum(["Ended", "Started", "Updated"])
        .describe(
          'This contains the type of this event.\r\nThe first TransactionEvent of a transaction SHALL contain: "Started" The last TransactionEvent of a transaction SHALL contain: "Ended" All others SHALL contain: "Updated"\r\n',
        ),
      meterValue: z
        .array(
          z
            .object({
              customData: z
                .object({ vendorId: z.string().max(255) })
                .describe(
                  "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                )
                .optional(),
              sampledValue: z
                .array(
                  z
                    .object({
                      customData: z
                        .object({ vendorId: z.string().max(255) })
                        .describe(
                          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                        )
                        .optional(),
                      value: z
                        .number()
                        .describe(
                          "Sampled_ Value. Value. Measure\r\nurn:x-oca:ocpp:uid:1:569260\r\nIndicates the measured value.\r\n\r\n",
                        ),
                      context: z
                        .enum([
                          "Interruption.Begin",
                          "Interruption.End",
                          "Other",
                          "Sample.Clock",
                          "Sample.Periodic",
                          "Transaction.Begin",
                          "Transaction.End",
                          "Trigger",
                        ])
                        .describe(
                          'Sampled_ Value. Context. Reading_ Context_ Code\r\nurn:x-oca:ocpp:uid:1:569261\r\nType of detail value: start, end or sample. Default = "Sample.Periodic"\r\n',
                        )
                        .default("Sample.Periodic"),
                      measurand: z
                        .enum([
                          "Current.Export",
                          "Current.Import",
                          "Current.Offered",
                          "Energy.Active.Export.Register",
                          "Energy.Active.Import.Register",
                          "Energy.Reactive.Export.Register",
                          "Energy.Reactive.Import.Register",
                          "Energy.Active.Export.Interval",
                          "Energy.Active.Import.Interval",
                          "Energy.Active.Net",
                          "Energy.Reactive.Export.Interval",
                          "Energy.Reactive.Import.Interval",
                          "Energy.Reactive.Net",
                          "Energy.Apparent.Net",
                          "Energy.Apparent.Import",
                          "Energy.Apparent.Export",
                          "Frequency",
                          "Power.Active.Export",
                          "Power.Active.Import",
                          "Power.Factor",
                          "Power.Offered",
                          "Power.Reactive.Export",
                          "Power.Reactive.Import",
                          "SoC",
                          "Voltage",
                        ])
                        .describe(
                          'Sampled_ Value. Measurand. Measurand_ Code\r\nurn:x-oca:ocpp:uid:1:569263\r\nType of measurement. Default = "Energy.Active.Import.Register"\r\n',
                        )
                        .default("Energy.Active.Import.Register"),
                      phase: z
                        .enum([
                          "L1",
                          "L2",
                          "L3",
                          "N",
                          "L1-N",
                          "L2-N",
                          "L3-N",
                          "L1-L2",
                          "L2-L3",
                          "L3-L1",
                        ])
                        .describe(
                          "Sampled_ Value. Phase. Phase_ Code\r\nurn:x-oca:ocpp:uid:1:569264\r\nIndicates how the measured value is to be interpreted. For instance between L1 and neutral (L1-N) Please note that not all values of phase are applicable to all Measurands. When phase is absent, the measured value is interpreted as an overall value.\r\n",
                        )
                        .optional(),
                      location: z
                        .enum(["Body", "Cable", "EV", "Inlet", "Outlet"])
                        .describe(
                          'Sampled_ Value. Location. Location_ Code\r\nurn:x-oca:ocpp:uid:1:569265\r\nIndicates where the measured value has been sampled. Default =  "Outlet"\r\n\r\n',
                        )
                        .default("Outlet"),
                      signedMeterValue: z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          signedMeterData: z
                            .string()
                            .max(2500)
                            .describe(
                              "Base64 encoded, contains the signed data which might contain more then just the meter value. It can contain information like timestamps, reference to a customer etc.\r\n",
                            ),
                          signingMethod: z
                            .string()
                            .max(50)
                            .describe(
                              "Method used to create the digital signature.\r\n",
                            ),
                          encodingMethod: z
                            .string()
                            .max(50)
                            .describe(
                              "Method used to encode the meter values before applying the digital signature algorithm.\r\n",
                            ),
                          publicKey: z
                            .string()
                            .max(2500)
                            .describe(
                              "Base64 encoded, sending depends on configuration variable _PublicKeyWithSignedMeterValue_.\r\n",
                            ),
                        })
                        .strict()
                        .describe(
                          "Represent a signed version of the meter value.\r\n",
                        )
                        .optional(),
                      unitOfMeasure: z
                        .object({
                          customData: z
                            .object({ vendorId: z.string().max(255) })
                            .describe(
                              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                            )
                            .optional(),
                          unit: z
                            .string()
                            .max(20)
                            .describe(
                              'Unit of the value. Default = "Wh" if the (default) measurand is an "Energy" type.\r\nThis field SHALL use a value from the list Standardized Units of Measurements in Part 2 Appendices. \r\nIf an applicable unit is available in that list, otherwise a "custom" unit might be used.\r\n',
                            )
                            .default("Wh"),
                          multiplier: z
                            .number()
                            .int()
                            .describe(
                              "Multiplier, this value represents the exponent to base 10. I.e. multiplier 3 means 10 raised to the 3rd power. Default is 0.\r\n",
                            )
                            .default(0),
                        })
                        .strict()
                        .describe(
                          "Represents a UnitOfMeasure with a multiplier\r\n",
                        )
                        .optional(),
                    })
                    .strict()
                    .describe(
                      "Sampled_ Value\r\nurn:x-oca:ocpp:uid:2:233266\r\nSingle sampled value in MeterValues. Each value can be accompanied by optional fields.\r\n\r\nTo save on mobile data usage, default values of all of the optional fields are such that. The value without any additional fields will be interpreted, as a register reading of active import energy in Wh (Watt-hour) units.\r\n",
                    ),
                )
                .min(1),
              timestamp: z
                .string()
                .datetime()
                .describe(
                  "Meter_ Value. Timestamp. Date_ Time\r\nurn:x-oca:ocpp:uid:1:569259\r\nTimestamp for measured value(s).\r\n",
                ),
            })
            .strict()
            .describe(
              "Meter_ Value\r\nurn:x-oca:ocpp:uid:2:233265\r\nCollection of one or more sampled values in MeterValuesRequest and TransactionEvent. All sampled values in a MeterValue are sampled at the same point in time.\r\n",
            ),
        )
        .min(1)
        .optional(),
      timestamp: z
        .string()
        .datetime()
        .describe(
          "The date and time at which this transaction event occurred.\r\n",
        ),
      triggerReason: z
        .enum([
          "Authorized",
          "CablePluggedIn",
          "ChargingRateChanged",
          "ChargingStateChanged",
          "Deauthorized",
          "EnergyLimitReached",
          "EVCommunicationLost",
          "EVConnectTimeout",
          "MeterValueClock",
          "MeterValuePeriodic",
          "TimeLimitReached",
          "Trigger",
          "UnlockCommand",
          "StopAuthorized",
          "EVDeparted",
          "EVDetected",
          "RemoteStop",
          "RemoteStart",
          "AbnormalCondition",
          "SignedDataReceived",
          "ResetCommand",
        ])
        .describe(
          "Reason the Charging Station sends this message to the CSMS\r\n",
        ),
      seqNo: z
        .number()
        .int()
        .describe(
          "Incremental sequence number, helps with determining if all messages of a transaction have been received.\r\n",
        ),
      offline: z
        .boolean()
        .describe(
          "Indication that this transaction event happened when the Charging Station was offline. Default = false, meaning: the event occurred when the Charging Station was online.\r\n",
        )
        .default(false),
      numberOfPhasesUsed: z
        .number()
        .int()
        .describe(
          "If the Charging Station is able to report the number of phases used, then it SHALL provide it. When omitted the CSMS may be able to determine the number of phases used via device management.\r\n",
        )
        .optional(),
      cableMaxCurrent: z
        .number()
        .int()
        .describe(
          "The maximum current of the connected cable in Ampere (A).\r\n",
        )
        .optional(),
      reservationId: z
        .number()
        .int()
        .describe(
          "This contains the Id of the reservation that terminates as a result of this transaction.\r\n",
        )
        .optional(),
      transactionInfo: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          transactionId: z
            .string()
            .max(36)
            .describe("This contains the Id of the transaction.\r\n"),
          chargingState: z
            .enum([
              "Charging",
              "EVConnected",
              "SuspendedEV",
              "SuspendedEVSE",
              "Idle",
            ])
            .describe(
              "Transaction. State. Transaction_ State_ Code\r\nurn:x-oca:ocpp:uid:1:569419\r\nCurrent charging state, is required when state\r\nhas changed.\r\n",
            )
            .optional(),
          timeSpentCharging: z
            .number()
            .int()
            .describe(
              "Transaction. Time_ Spent_ Charging. Elapsed_ Time\r\nurn:x-oca:ocpp:uid:1:569415\r\nContains the total time that energy flowed from EVSE to EV during the transaction (in seconds). Note that timeSpentCharging is smaller or equal to the duration of the transaction.\r\n",
            )
            .optional(),
          stoppedReason: z
            .enum([
              "DeAuthorized",
              "EmergencyStop",
              "EnergyLimitReached",
              "EVDisconnected",
              "GroundFault",
              "ImmediateReset",
              "Local",
              "LocalOutOfCredit",
              "MasterPass",
              "Other",
              "OvercurrentFault",
              "PowerLoss",
              "PowerQuality",
              "Reboot",
              "Remote",
              "SOCLimitReached",
              "StoppedByEV",
              "TimeLimitReached",
              "Timeout",
            ])
            .describe(
              'Transaction. Stopped_ Reason. EOT_ Reason_ Code\r\nurn:x-oca:ocpp:uid:1:569413\r\nThis contains the reason why the transaction was stopped. MAY only be omitted when Reason is "Local".\r\n',
            )
            .optional(),
          remoteStartId: z
            .number()
            .int()
            .describe(
              "The ID given to remote start request (&lt;&lt;requeststarttransactionrequest, RequestStartTransactionRequest&gt;&gt;. This enables to CSMS to match the started transaction to the given start request.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe("Transaction\r\nurn:x-oca:ocpp:uid:2:233318\r\n"),
      evse: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          id: z
            .number()
            .int()
            .describe(
              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
            ),
          connectorId: z
            .number()
            .int()
            .describe(
              "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
        )
        .optional(),
      idToken: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          additionalInfo: z
            .array(
              z
                .object({
                  customData: z
                    .object({ vendorId: z.string().max(255) })
                    .describe(
                      "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
                    )
                    .optional(),
                  additionalIdToken: z
                    .string()
                    .max(36)
                    .describe(
                      "This field specifies the additional IdToken.\r\n",
                    ),
                  type: z
                    .string()
                    .max(50)
                    .describe(
                      "This defines the type of the additionalIdToken. This is a custom type, so the implementation needs to be agreed upon by all involved parties.\r\n",
                    ),
                })
                .strict()
                .describe(
                  "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
                ),
            )
            .min(1)
            .optional(),
          idToken: z
            .string()
            .max(36)
            .describe(
              "IdToken is case insensitive. Might hold the hidden id of an RFID tag, but can for example also contain a UUID.\r\n",
            ),
          type: z
            .enum([
              "Central",
              "eMAID",
              "ISO14443",
              "ISO15693",
              "KeyCode",
              "Local",
              "MacAddress",
              "NoAuthorization",
            ])
            .describe("Enumeration of possible idToken types.\r\n"),
        })
        .strict()
        .describe(
          "Contains a case insensitive identifier to use for the authorization and the type of authorization to support multiple forms of identifiers.\r\n",
        )
        .optional(),
    })
    .strict(),

  TriggerMessage: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      evse: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          id: z
            .number()
            .int()
            .describe(
              "Identified_ Object. MRID. Numeric_ Identifier\r\nurn:x-enexis:ecdm:uid:1:569198\r\nEVSE Identifier. This contains a number (&gt; 0) designating an EVSE of the Charging Station.\r\n",
            ),
          connectorId: z
            .number()
            .int()
            .describe(
              "An id to designate a specific connector (on an EVSE) by connector index number.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "EVSE\r\nurn:x-oca:ocpp:uid:2:233123\r\nElectric Vehicle Supply Equipment\r\n",
        )
        .optional(),
      requestedMessage: z
        .enum([
          "BootNotification",
          "LogStatusNotification",
          "FirmwareStatusNotification",
          "Heartbeat",
          "MeterValues",
          "SignChargingStationCertificate",
          "SignV2GCertificate",
          "StatusNotification",
          "TransactionEvent",
          "SignCombinedCertificate",
          "PublishFirmwareStatusNotification",
        ])
        .describe("Type of message to be triggered.\r\n"),
    })
    .strict(),

  UnlockConnector: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      evseId: z
        .number()
        .int()
        .describe(
          "This contains the identifier of the EVSE for which a connector needs to be unlocked.\r\n",
        ),
      connectorId: z
        .number()
        .int()
        .describe(
          "This contains the identifier of the connector that needs to be unlocked.\r\n",
        ),
    })
    .strict(),

  UnpublishFirmware: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      checksum: z
        .string()
        .max(32)
        .describe(
          "The MD5 checksum over the entire firmware file as a hexadecimal string of length 32. \r\n",
        ),
    })
    .strict(),

  UpdateFirmware: z
    .object({
      customData: z
        .object({ vendorId: z.string().max(255) })
        .describe(
          "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
        )
        .optional(),
      retries: z
        .number()
        .int()
        .describe(
          "This specifies how many times Charging Station must try to download the firmware before giving up. If this field is not present, it is left to Charging Station to decide how many times it wants to retry.\r\n",
        )
        .optional(),
      retryInterval: z
        .number()
        .int()
        .describe(
          "The interval in seconds after which a retry may be attempted. If this field is not present, it is left to Charging Station to decide how long to wait between attempts.\r\n",
        )
        .optional(),
      requestId: z.number().int().describe("The Id of this request\r\n"),
      firmware: z
        .object({
          customData: z
            .object({ vendorId: z.string().max(255) })
            .describe(
              "This class does not get 'AdditionalProperties = false' in the schema generation, so it can be extended with arbitrary JSON properties to allow adding custom data.",
            )
            .optional(),
          location: z
            .string()
            .max(512)
            .describe(
              "Firmware. Location. URI\r\nurn:x-enexis:ecdm:uid:1:569460\r\nURI defining the origin of the firmware.\r\n",
            ),
          retrieveDateTime: z
            .string()
            .datetime()
            .describe(
              "Firmware. Retrieve. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569461\r\nDate and time at which the firmware shall be retrieved.\r\n",
            ),
          installDateTime: z
            .string()
            .datetime()
            .describe(
              "Firmware. Install. Date_ Time\r\nurn:x-enexis:ecdm:uid:1:569462\r\nDate and time at which the firmware shall be installed.\r\n",
            )
            .optional(),
          signingCertificate: z
            .string()
            .max(5500)
            .describe(
              "Certificate with which the firmware was signed.\r\nPEM encoded X.509 certificate.\r\n",
            )
            .optional(),
          signature: z
            .string()
            .max(800)
            .describe(
              "Firmware. Signature. Signature\r\nurn:x-enexis:ecdm:uid:1:569464\r\nBase64 encoded firmware signature.\r\n",
            )
            .optional(),
        })
        .strict()
        .describe(
          "Firmware\r\nurn:x-enexis:ecdm:uid:2:233291\r\nRepresents a copy of the firmware that can be loaded/updated on the Charging Station.\r\n",
        ),
    })
    .strict(),
} satisfies Record<CallActions, z.AnyZodObject | null>;
