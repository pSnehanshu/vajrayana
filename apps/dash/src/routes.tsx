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

export function Routes() {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const setOrg = useStore((s) => s.setOrg);

  const lookupQuery = trpc.org.lookup.useQuery({
    domain: window.location.hostname,
  });

  useEffect(() => {
    if (lookupQuery.data) {
      setOrg(lookupQuery.data);
    }
  }, [lookupQuery.data, setOrg]);

  if (lookupQuery.isLoading) return <h1>Wait...</h1>;
  if (lookupQuery.isError) return <h1>Failed to lookup the org</h1>;

  return (
    <Router>
      {isLoggedIn ? (
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
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
