import superjson from "superjson";
import { prisma } from "@vajrayana/prisma";
import { type inferAsyncReturnType, initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/* Define the context */
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return { prisma };
};

export type Context = inferAsyncReturnType<typeof createContext>;

/* Initialize tRPC */
const t = initTRPC.context<Context>().create({ transformer: superjson });

/* Define utils */
export const router = t.router;
export const publicProcedure = t.procedure;
