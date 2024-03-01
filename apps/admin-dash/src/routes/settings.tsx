import { authGuard } from "@/lib/guards";
import {
  createFileRoute,
  useRouterState,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/settings")({
  beforeLoad: authGuard,
  component: Settings,
});

function Settings() {
  const routerState = useRouterState();
  const split = routerState.location.pathname.split("/").at(-1);

  return (
    <>
      <Tabs value={split} className="w-full max-w-[800px] mx-auto">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="server" asChild>
            <Link to="/settings/server">Server</Link>
          </TabsTrigger>

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
          <TabsContent value="server">
            <Outlet />
          </TabsContent>

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
