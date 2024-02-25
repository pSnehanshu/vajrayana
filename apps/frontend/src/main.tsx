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
  InnerWrap({ children }) {
    return <ThemeProvider>{children}</ThemeProvider>;
  },
});

// For closing mobile menu when navigation happens
router.subscribe("onBeforeLoad", () => {
  unstable_batchedUpdates(() => {
    useMobileMenuStore.getState().setOpen(false);
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
    <RouterProvider router={router} />
  </StrictMode>,
);
