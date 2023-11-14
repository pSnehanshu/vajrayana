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

  if (lookupQuery.isLoading || whoamiQuery.isLoading) return <h1>Wait...</h1>;
  if (lookupQuery.isError) return <h1>Failed to lookup the org</h1>;

  return (
    <Router>
      {whoamiQuery.data ? (
        <>
          <TopBar />
          <SideBar />

          <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <main className="p-4 md:ml-64 h-auto min-h-screen pt-20">
              <Switch>
                <Route path="/dashboard">
                  <HomePage />
                </Route>

                <Route path="/cs">
                  <h1 className="dark:text-white">CS!</h1>
                </Route>

                <Route path="/sessions">
                  <h1 className="dark:text-white">Sessions!</h1>
                </Route>

                <Route path="/tarrif">
                  <h1 className="dark:text-white">Tarrif!</h1>
                </Route>

                <Route path="/customers">
                  <h1 className="dark:text-white">Customers!</h1>
                </Route>

                <Route path="/revenue">
                  <h1 className="dark:text-white">Revenue!</h1>
                </Route>

                <Route path="/ext-platforms">
                  <h1 className="dark:text-white">External platforms!</h1>
                </Route>

                <Route path="/reports">
                  <h1 className="dark:text-white">Reports!</h1>
                </Route>

                <Route path="/settings">
                  <h1 className="dark:text-white">Settings!</h1>
                </Route>

                <Route path="/account">
                  <h1 className="dark:text-white">My account!</h1>
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
