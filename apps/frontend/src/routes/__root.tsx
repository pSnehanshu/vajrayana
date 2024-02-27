import { createRootRoute, Outlet } from "@tanstack/react-router";
import { trpc } from "@/lib/trpc";
import { useAppStore } from "@/store";
import { unstable_batchedUpdates } from "react-dom";
import { NotFound } from "@/components/not-found";
import { GlobalLayout } from "@/components/layout/global-layout";

export const Route = createRootRoute({
  async beforeLoad() {
    // Here we try to fetch the user and save in store

    // Get the store obj
    const { user } = useAppStore.getState();

    // Fetch current user
    if (!user) {
      try {
        const user = await trpc.auth.whoAmI.query();

        // If succesfully fetched, save in store
        unstable_batchedUpdates(() => useAppStore.setState(() => ({ user })));
      } catch (error) {
        // Failed to fetch the user, probably not logged in
      }
    }

    document.getElementById("full-screen-spinner")?.remove();
  },
  component: () => (
    <GlobalLayout>
      <Outlet />
    </GlobalLayout>
  ),
  notFoundComponent: () => (
    <GlobalLayout>
      <NotFound />
    </GlobalLayout>
  ),
});
