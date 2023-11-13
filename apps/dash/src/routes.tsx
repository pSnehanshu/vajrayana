import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useStore } from "./store";
import LoginPage from "./pages/auth/Login";
import HomePage from "./pages/Home";

export function Routes() {
  const [isLoggedIn, setLoggedIn] = useStore((s) => [
    s.isLoggedIn,
    s.setLoggedIn,
  ]);

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

      <button onClick={() => setLoggedIn(!isLoggedIn)}>Toggle signin</button>
    </Router>
  );
}
