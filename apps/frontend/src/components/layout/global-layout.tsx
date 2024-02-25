import { useAppStore } from "@/store";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { type ReactNode, Suspense } from "react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";

export function GlobalLayout({ children }: { children: ReactNode }) {
  const isLoggedIn = useAppStore((s) => !!(s.user?.id && s.org?.id));

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-5">
        {isLoggedIn && <Sidebar className="hidden md:block h-screen" />}

        <main
          className={cn(
            "col-span-3 h-screen overflow-y-scroll overflow-x-auto p-4 border-2",
            [isLoggedIn ? "md:col-span-4 md:border-l" : "md:col-span-5"],
          )}
        >
          {children}
        </main>
      </div>

      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>

      <Toaster />
    </>
  );
}
