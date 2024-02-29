import { ReactNode, createElement, useState } from "react";
import {
  TRPCLink,
  createTRPCProxyClient,
  httpBatchLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import SuperJSON from "superjson";
import type { AppRouter } from "../../../backend/src/routers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** Define all the links for tRPC */
const links = [
  // Logger link, only for dev
  loggerLink({ enabled: () => import.meta.env.DEV }),

  // This actually sends the request
  httpBatchLink({ url: "/api/trpc" }),
] satisfies TRPCLink<AppRouter>[];

/** Initialize tRPC React Query integration */
export const trpcRQ = createTRPCReact<AppRouter>();

/** Initialize tRPC vanilla client integration */
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links,
});

/** The inputs accepted by the tRPC procedures */
export type RouterInputs = inferRouterInputs<AppRouter>;

/** The outputs given by the tRPC procedures */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * This provides its children with tRPC+RQ integration.
 * Written using createElement instead of JSX to avoid
 * naming this file with .tsx extension
 * */
export function TrpcReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000 },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpcRQ.createClient({
      transformer: SuperJSON,
      links,
    }),
  );

  return createElement(trpcRQ.Provider, {
    client: trpcClient,
    queryClient,
    children: createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    ),
  });
}
