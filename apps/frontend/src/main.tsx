import "@/main.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { unstable_batchedUpdates } from "react-dom";
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { ThemeProvider } from "@/components/theme-provider";
import { useMobileMenuStore } from "@/store";
import { LazyTanStackRouterDevtools } from "@/components/LazyRouterDevtool";
import { ErrorComp } from "@/components/error";
import { TrpcReactQueryProvider } from "@/lib/trpc";

// Create a new router instance
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultPendingMinMs: 0,
  defaultPendingComponent: () => <h1>Loading, please wait...</h1>,
  defaultErrorComponent: (data) => {
    const errorMessage =
      typeof data?.error?.message === "string"
        ? (data.error.message as string)
        : "";

    return <ErrorComp message={errorMessage} />;
  },
  InnerWrap({ children }) {
    return (
      <>
        {children}
        <LazyTanStackRouterDevtools />
      </>
    );
  },
});

// For closing mobile menu when navigation happens
router.subscribe("onBeforeLoad", () => {
  unstable_batchedUpdates(() => {
    // Automatically close the mobile menu when nav happens
    useMobileMenuStore.getState().setOpen(false);

    /**
     * This code is to handle a bug, where ui/sheet forgets
     * to remove the `pointer-events:none` style from the
     * `body` when navigation happens from ui/dropdown-menu
     */
    setTimeout(() => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
        console.log(
          "pointer-events:none was applied to body and has been removed.",
        );
      }
    }, 500);
  });
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TrpcReactQueryProvider>
        <RouterProvider router={router} />
      </TrpcReactQueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
