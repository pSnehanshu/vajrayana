import classNames from "classnames";
import { useState } from "react";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";

export default function SettingsPage() {
  const match = useRouteMatch();
  const [navVisible, setNavVisible] = useState(true);

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-xl">
      <button
        onClick={() => setNavVisible((v) => !v)}
        className="lg:hidden p-4"
      >
        {navVisible ? "Close" : "Open"} menu
      </button>

      <aside
        className={classNames(
          navVisible ? "visible" : "hidden",
          "w-full lg:w-1/4 xl:w-64 p-2 lg:border-r-2 border-gray-200 dark:border-gray-700",
        )}
      >
        <ul className="space-y-2">
          {Array(10)
            .fill(0)
            .map((_v, i) => (
              <li key={i}>
                <NavLink
                  to={`${match.url}/page-${i}`}
                  activeClassName="bg-gray-100 dark:bg-gray-700"
                  className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  Option {i}
                </NavLink>
              </li>
            ))}
        </ul>
      </aside>

      <div className="border-t-2 lg:border-0 border-gray-200 dark:border-gray-700 lg:flex-grow p-4 py-8">
        <Switch>
          <Route path="/">
            <h1>Settings/</h1>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
