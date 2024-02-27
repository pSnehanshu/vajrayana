import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Link,
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const routerState = useRouterState();
  const split = routerState.location.pathname.split("/").at(-1);

  return (
    <>
      <Tabs value={split} className="w-full max-w-[800px] mx-auto">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4">
          {/* <TabsTrigger value="org" asChild>
            <Link to="/settings/org">Organization</Link>
          </TabsTrigger> */}

          <TabsTrigger value="members" asChild>
            <Link to="/settings/members">Members</Link>
          </TabsTrigger>

          <TabsTrigger value="roles" asChild>
            <Link to="/settings/roles">Roles & permissions</Link>
          </TabsTrigger>

          <TabsTrigger value="account" asChild>
            <Link to="/settings/account">My Account</Link>
          </TabsTrigger>
        </TabsList>

        <div className="p-2 mt-2">
          {/* <TabsContent value="org">
            <Outlet />
          </TabsContent> */}

          <TabsContent value="members">
            <Outlet />
          </TabsContent>

          <TabsContent value="roles">
            <Outlet />
          </TabsContent>

          <TabsContent value="account">
            <Outlet />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
