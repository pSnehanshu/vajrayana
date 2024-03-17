import { prisma } from "@zigbolt/prisma";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./trpc";
import { isAfter, isValid } from "date-fns";
import path from "node:path";

export const api = express.Router();

// Here we can check status of different services this app depends on
api.get("/check", async (req, res) => {
  // Check DB session TZ
  const tz =
    await prisma.$queryRaw`SELECT current_setting('TIMEZONE') AS session_timezone_offset;`;

  res.json(tz);
});

api.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

// Endpoint to fetch logo. Handles caching
api.get("/logo", async (req, res) => {
  try {
    const { updatedAt } = await prisma.settings.findUniqueOrThrow({
      select: { updatedAt: true },
      where: { key: "logoB64" },
    });

    // Cache for 1 year
    res.setHeader("Cache-Control", "public, max-age=0");
    res.setHeader("Last-Modified", updatedAt.toUTCString());

    // Parse the if-modified-since header
    const ifModifiedSince = new Date(req.headers["if-modified-since"] ?? "");

    if (
      isValid(ifModifiedSince) && // Must be a valid date, invalid values are ignored
      !isAfter(updatedAt, ifModifiedSince)
    ) {
      return res.status(304).end(); // Not Modified
    }

    // Either logo changed or not cacehed
    // Send the actual file
    const { value: logoValue } = await prisma.settings.findUniqueOrThrow({
      select: { value: true },
      where: { key: "logoB64" },
    });

    if (logoValue.startsWith("data:")) {
      const value = logoValue.split(",").at(1);
      if (value) {
        return res.send(Buffer.from(value, "base64"));
      }
    }

    res.send(Buffer.from(logoValue, "base64"));
  } catch (error) {
    // something went wrong, serve default logo
    const defaultLogoPath = path.join(__dirname, "./assets/default-logo.png");
    res.sendFile(defaultLogoPath);
  }
});
