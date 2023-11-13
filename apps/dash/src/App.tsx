import { useState } from "react";
import superjson from "superjson";
import { Toaster } from "react-hot-toast";
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

  if (typeof org?.isActive === "boolean" && !org.isActive)
    return (
      <h1 className="text-4xl m-4 text-red-500 text-center">
        Your organization has been blocked! Contact admin for more information.
      </h1>
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
