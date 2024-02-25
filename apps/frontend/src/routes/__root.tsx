import { createRootRoute, Outlet } from "@tanstack/react-router";
import { trpc } from "@/lib/trpc";
import { useAppStore } from "@/store";
import { unstable_batchedUpdates } from "react-dom";
import { NotFound } from "@/components/not-found";
import { GlobalLayout } from "@/components/layout/global-layout";

export const Route = createRootRoute({
  async beforeLoad() {
    // Here we try to fetch the user and the org and save in store

    // Get the store obj
    const store = useAppStore.getState();

    // Fetch current user and the org
    const requests = [
      // Only fetch if not in store
      store.org
        ? Promise.resolve(store.org)
        : trpc.org.lookup.query({ domain: window.location.hostname }),
      // Only fetch if not in store
      store.user ? Promise.resolve(store.user) : trpc.auth.whoAmI.query(),
    ] as const;

    // Run the fetch
    const results = await Promise.allSettled(requests);

    // If succesfully fetched, save in store
    if (results[0].status === "fulfilled") {
      const org = results[0].value;
      unstable_batchedUpdates(() => {
        store.setOrg(org);
      });
    }

    // If succesfully fetched, save in store
    if (results[1].status === "fulfilled") {
      const user = results[1].value;
      unstable_batchedUpdates(() => {
        store.setUser(user);
      });
    }
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
