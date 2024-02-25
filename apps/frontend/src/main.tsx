import "@/main.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { ThemeProvider } from "@/components/theme-provider";
import { useMobileMenuStore } from "./store";
import { unstable_batchedUpdates } from "react-dom";

// Create a new router instance
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultPendingComponent: () => <h1>Loading, please wait...</h1>,
  defaultErrorComponent: () => <h1>Something went wrong!</h1>,
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
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
