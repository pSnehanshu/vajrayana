import { useState } from "react";
import superjson from "superjson";
import { Toaster } from "react-hot-toast";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "./store";
import { trpc } from "./utils/trpc";
import { Routes } from "./routes";

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: () => process.env.NODE_ENV !== "production",
        }),
        httpBatchLink({
          url: "/api/trpc",
          headers() {
            return {
              "x-org-id": useStore.getState().org?.id ?? "",
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <Toaster position="top-center" />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
