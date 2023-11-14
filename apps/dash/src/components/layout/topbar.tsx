import { Link } from "react-router-dom";
import classNames from "classnames";
import { IoHelpCircle } from "react-icons/io5";
import { HiMenuAlt1 } from "react-icons/hi";
import { UserButton } from "./user-button";
import Logo from "../../assets/img/zigbolt-logo.png";
import { useStore } from "../../store";

export function TopBar() {
  const mobileSideBarVisible = useStore((s) => s.mobileSideBarVisible);
  const setMobileSideBarVisible = useStore((s) => s.setMobileSideBarVisible);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            onClick={() => setMobileSideBarVisible()}
            className={classNames(
              { hidden: mobileSideBarVisible },
              "p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
            )}
          >
            <HiMenuAlt1 className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center justify-between mr-4">
            <img src={Logo} className="mr-3 h-8" alt="Logo" />
          </Link>
        </div>
        <div className="flex items-center lg:order-2">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <IoHelpCircle className="w-6 h-6" />
          </button>

          <UserButton />
        </div>
      </div>
    </nav>
  );
}
