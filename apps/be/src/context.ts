import * as trpcExpress from "@trpc/server/adapters/express";

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return {};
};

// type Context = inferAsyncReturnType<typeof createContext>;
