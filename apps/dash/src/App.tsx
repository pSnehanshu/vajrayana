import { useState } from "react";
import superjson from "superjson";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "./store";
import { trpc } from "./utils/trpc";
import { Routes } from "./routes";

export default function App() {
  const org = useStore((s) => s.org);

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
        httpBatchLink({
          url: "/api/trpc",
          headers() {
            return {
              "x-org-id": org?.id ?? "",
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
      </QueryClientProvider>
    </trpc.Provider>
  );
}
