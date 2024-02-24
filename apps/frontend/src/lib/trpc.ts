import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import SuperJSON from "superjson";
import { useAppStore } from "@/store";
import type { AppRouter } from "../../../backend/src/routers";

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: "/api/trpc",
      headers: () => ({
        "x-org-id": useAppStore.getState().org?.id ?? "",
      }),
    }),
  ],
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
