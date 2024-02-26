import { prisma } from "@zigbolt/prisma";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./trpc";

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
