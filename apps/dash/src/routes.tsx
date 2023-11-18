import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useStore } from "./store";
import LoginPage from "./pages/auth/Login";
import HomePage from "./pages/Home";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";
import { TopBar } from "./components/layout/topbar";
import { SideBar } from "./components/layout/sidebar";
import SettingsPage from "./pages/settings";
import { FullPageLoading } from "./components/full-page-loading";

export function Routes() {
  const setUser = useStore((s) => s.setUser);
  const setOrg = useStore((s) => s.setOrg);

  const lookupQuery = trpc.org.lookup.useQuery(
    { domain: window.location.hostname },
    {
      retry(failureCount, error) {
        if (error.data?.code === "NOT_FOUND") return false;
        if (failureCount > 3) return false;
        return true;
      },
    },
  );

  const whoamiQuery = trpc.auth.whoAmI.useQuery(undefined, {
    retry(failureCount, error) {
      if (error.data?.code === "UNAUTHORIZED") return false;
      if (failureCount > 3) return false;
      return true;
    },
  });

  useEffect(() => {
    if (lookupQuery.data) {
      setOrg(lookupQuery.data);
    }

    if (whoamiQuery.data) {
      setUser(whoamiQuery.data);
    }
  }, [lookupQuery.data, whoamiQuery.data, setOrg, setUser]);

  if (lookupQuery.isLoading || whoamiQuery.isLoading)
    return <FullPageLoading />;

  if (lookupQuery.isError) return <h1>Failed to lookup the org</h1>;

  if (!lookupQuery.data.isActive)
    return (
      <h1 className="text-4xl m-4 text-red-500 text-center">
        Your organization has been blocked! Contact admin for more information.
      </h1>
    );

  return (
    <Router>
      {whoamiQuery.data ? (
        <>
          <TopBar />
          <SideBar />

          <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <main className="p-4 md:ml-64 h-auto min-h-screen pt-20 dark:text-white">
              <Switch>
                <Route path="/dashboard">
                  <HomePage />
                </Route>

                <Route path="/cs">
                  <h1>CS!</h1>
                </Route>

                <Route path="/transactions">
                  <h1>Transactions!</h1>
                </Route>

                <Route path="/tarrif">
                  <h1>Tarrif!</h1>
                </Route>

                <Route path="/customers">
                  <h1>Customers!</h1>
                </Route>

                <Route path="/revenue">
                  <h1>Revenue!</h1>
                </Route>

                <Route path="/ext-platforms">
                  <h1>External platforms!</h1>
                </Route>

                <Route path="/reports">
                  <h1>Reports!</h1>
                </Route>

                <Route path="/settings">
                  <SettingsPage />
                </Route>

                <Route path="/account">
                  <h1>My account!</h1>
                </Route>

                <Route path="/">
                  <Redirect to="/dashboard" />
                </Route>
              </Switch>
            </main>
          </div>
        </>
      ) : (
        <Switch>
          <Route path="/auth/login">
            <LoginPage />
          </Route>

          <Route path="/">
            <Redirect to="/auth/login" />
          </Route>
        </Switch>
      )}
    </Router>
  );
}
