import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { HiDocument } from "react-icons/hi2";
import { PiCaretDownBold } from "react-icons/pi";
import { IoPieChartSharp, IoSettingsSharp } from "react-icons/io5";
import { MdAttachMoney, MdOutlineElectricCar } from "react-icons/md";
import { FaPlugCircleBolt, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaChargingStation, FaDotCircle } from "react-icons/fa";
import { RiOrganizationChart } from "react-icons/ri";

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
    link: "/cs",
  },
  {
    title: "Transactions",
    icon: <FaPlugCircleBolt />,
    link: "/transactions",
  },
  {
    title: "Tarrif",
    icon: <MdAttachMoney className="text-xl -translate-x-1 -mr-1" />,
    link: "/tarrif",
  },
  {
    title: "Customers",
    icon: <MdOutlineElectricCar className="text-xl -translate-x-1 -mr-1" />,
    link: "/customers",
  },
  {
    title: "External platforms",
    icon: <RiOrganizationChart />,
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const [isLoggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  // const isLoggedIn = useAppStore((s) => !!(s.user?.id && s.org?.id));
  const logout = useAppStore((s) => s.logout);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    toast("You have been logged out");
    navigate({ to: "/login" });
  }

  return (
    <nav className={cn("pb-12 mt-4", className)} {...props}>
      <ul className="space-y-2 px-4 mb-4">
        {menu.map((item, i) => (
          <li key={i}>
            <Link
              to={item.link}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start",
              )}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Button onClick={handleLogout} className="m-2" isLoading={isLoggingOut}>
        Logout
      </Button>
    </nav>
  );
}
