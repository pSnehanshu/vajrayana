import { lazy, Suspense } from "react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { trpc } from "@/lib/trpc";
import { useStore } from "@/store";
import { unstable_batchedUpdates } from "react-dom";

const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )
  : () => null;

export const Route = createRootRoute({
  async beforeLoad() {
    // Here we try to fetch the user and the org and save in store

    // Get the store obj
    const store = useStore.getState();

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
  component: Root,
  pendingComponent: () => <h1>Loading, please wait...</h1>,
});

function Root() {
  const userId = useStore((s) => s.user?.id);
  const orgId = useStore((s) => s.org?.id);

  return (
    <>
      {userId && orgId && (
        <>
          <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>
          </div>
          <p>
            {userId} @ {orgId}
          </p>
          <hr />
        </>
      )}
      <Outlet />

      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  );
}
