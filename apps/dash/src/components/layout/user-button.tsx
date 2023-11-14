import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useStore } from "../../store";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";

export function UserButton() {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setUserMenuVisible(false));

  const user = useStore((s) => s.user);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess() {
      // Wait for toast animation to finish
      setTimeout(() => {
        // Redirect back to login
        window.location.pathname = "/";
        window.location.reload();
      }, 1000);
    },
    onError(error) {
      console.error(error);
    },
  });

  return (
    <div ref={ref}>
      <button
        type="button"
        className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        onClick={() => setUserMenuVisible((v) => !v)}
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 rounded-full"
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name ?? "John Doe",
          )}&rounded=true&bold=true`}
          alt={user?.name}
        />
      </button>

      {/* Dropdown menu */}
      <div
        className={classNames(
          { block: userMenuVisible, hidden: !userMenuVisible },
          "absolute top-10 right-2 z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl",
        )}
        id="dropdown"
      >
        <div className="py-3 px-4">
          <span className="block text-sm font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </span>
          <span className="block text-sm text-gray-900 truncate dark:text-white">
            {user?.email}
          </span>
        </div>

        <ul
          className="py-1 text-gray-700 dark:text-gray-300"
          aria-labelledby="dropdown"
        >
          <li>
            <Link
              to="/account/profile"
              className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
            >
              My profile
            </Link>
          </li>
          <li>
            <Link
              to="/account/settings"
              className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
            >
              Account settings
            </Link>
          </li>
        </ul>

        <ul
          className="text-gray-700 dark:text-gray-300"
          aria-labelledby="dropdown"
        >
          <li>
            <button
              onClick={() =>
                toast.promise(logoutMutation.mutateAsync(), {
                  success: "Succesfully logged out!",
                  error: "Failed to logout!",
                  loading: "Logging you out...",
                })
              }
              className="w-full text-left block py-2 px-4 text-sm rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
