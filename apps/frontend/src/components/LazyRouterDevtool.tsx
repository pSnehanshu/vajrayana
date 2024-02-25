import { Suspense, lazy } from "react";

// Dev tool
// eslint-disable-next-line react-refresh/only-export-components
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

/** Lazily load TanStack Router Devtools. Doesn't load on production. */
export function LazyTanStackRouterDevtools() {
  return (
    <Suspense>
      <TanStackRouterDevtools position="bottom-right" />
    </Suspense>
  );
}
