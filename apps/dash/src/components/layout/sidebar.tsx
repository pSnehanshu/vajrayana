import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useOnClickOutside } from "usehooks-ts";
import { ReactNode, useRef, useState } from "react";
import { HiDocument } from "react-icons/hi2";
import { PiCaretDownBold } from "react-icons/pi";
import { IoPieChartSharp, IoSettingsSharp } from "react-icons/io5";
import { MdElectricCar, MdAttachMoney } from "react-icons/md";
import { FaPlugCircleBolt, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaChargingStation, FaBoxes, FaDotCircle } from "react-icons/fa";
import { useStore } from "../../store";

type MenuItem = {
  title: string;
  icon?: ReactNode;
  link?: string;
  children?: MenuItem[];
};

const menu: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <IoPieChartSharp />,
    link: "/dashboard",
  },
  {
    title: "Charging stations",
    icon: <FaChargingStation />,
    children: [
      {
        title: "Locations",
        link: "/cs/locations",
      },
      {
        title: "EVSEs",
        link: "/cs/evse",
      },
    ],
  },
  {
    title: "Charging sessions",
    icon: <FaPlugCircleBolt />,
    link: "/sessions",
  },
  {
    title: "Tarrif",
    icon: <MdAttachMoney />,
    link: "/tarrif",
  },
  {
    title: "Customers",
    icon: <MdElectricCar />,
    link: "/customers",
  },
  {
    title: "External platforms",
    icon: <FaBoxes />,
    link: "/ext-platforms",
  },
  {
    title: "Revenue",
    icon: <FaMoneyBillTrendUp />,
    link: "/revenue",
  },
  {
    title: "Reports",
    icon: <HiDocument />,
    link: "/reports",
  },
  {
    title: "Settings",
    icon: <IoSettingsSharp />,
    link: "/settings",
  },
];

function MenuItem({ item }: { item: MenuItem }) {
  const [expanded, setExpanded] = useState(false);

  return item.link ? (
    <NavLink
      to={item.link}
      activeClassName="bg-gray-100 dark:bg-gray-700"
      className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      {item.icon ?? <FaDotCircle />}

      <span className="ml-3">{item.title}</span>
    </NavLink>
  ) : (
    <>
      <button
        onClick={() => setExpanded((v) => !v)}
        type="button"
        className="hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group dark:text-white"
        aria-controls="dropdown-pages"
      >
        {item.icon ?? <FaDotCircle />}

        <span className="flex-1 ml-3 text-left whitespace-nowrap">
          {item.title}
        </span>

        {item.children && (
          <PiCaretDownBold
            className={classNames(
              { "-rotate-180": expanded },
              "w-4 h-4 transition-transform",
            )}
          />
        )}
      </button>

      {item.children && (
        <ul className={classNames({ hidden: !expanded }, "py-2 space-y-2")}>
          {item.children.map((citem, j) => (
            <li key={j}>
              <NavLink
                to={citem.link ?? "#"}
                exact
                activeClassName="bg-gray-100 dark:bg-gray-700"
                className="flex items-center p-2 pl-11 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                {citem.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function SideBar() {
  const mobileSideBarVisible = useStore((s) => s.mobileSideBarVisible);
  const setMobileSideBarVisible = useStore((s) => s.setMobileSideBarVisible);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setMobileSideBarVisible(false));

  return (
    <aside
      ref={ref}
      className={classNames(
        mobileSideBarVisible ? "transform-none" : "-translate-x-full",
        "fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700",
      )}
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
        <form action="#" method="GET" className="md:hidden mb-2">
          <label htmlFor="sidebar-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="sidebar-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search"
            />
          </div>
        </form>

        <ul className="space-y-2">
          {menu.map((item, i) => (
            <li key={i}>
              <MenuItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
