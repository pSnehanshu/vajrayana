import { cn, useOrgLogo } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ReactNode, useMemo } from "react";
import { FileRoutesByPath, Link } from "@tanstack/react-router";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { HiDocument } from "react-icons/hi2";
import { IoPieChartSharp, IoSettingsSharp } from "react-icons/io5";
import { MdAttachMoney, MdOutlineElectricCar } from "react-icons/md";
import { FaPlugCircleBolt, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaChargingStation, FaDotCircle } from "react-icons/fa";
import { RiOrganizationChart } from "react-icons/ri";
import jsSHA from "jssha/sha256";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiMenuKebab } from "react-icons/ci";
import { useTheme } from "@/components/theme-provider";
import { ScrollArea } from "../ui/scroll-area";

type MenuItem = {
  title: string;
  icon?: ReactNode;
  link?: keyof FileRoutesByPath;
  children?: MenuItem[];
};

const menu: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <IoPieChartSharp />,
    link: "/",
  },
  {
    title: "Charging stations",
    icon: <FaChargingStation />,
    link: "/charging-stations",
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
    link: "/external-platforms",
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  showLogo?: boolean;
}

export function Sidebar({
  className,
  showLogo = true,
  ...props
}: SidebarProps) {
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const { setTheme, theme } = useTheme();
  const logo = useOrgLogo();

  const emailHash = useMemo(() => {
    if (user?.email) {
      const sha256 = new jsSHA("SHA-256", "TEXT");
      sha256.update(user.email);
      return sha256.getHash("HEX");
    }
    return null;
  }, [user?.email]);

  async function handleLogout() {
    await logout();
    toast("You have been logged out");
    window.location.href = import.meta.env.BASE_URL;
  }

  return (
    <nav className={cn("overflow-hidden", className)} {...props}>
      <div className="h-full grid grid-rows-9">
        {showLogo && (
          <div className="row-span-1 p-2">
            <Link to="/">
              <img src={logo} alt="ZigBolt LOGO" className="h-full m-auto" />
            </Link>
          </div>
        )}

        <ScrollArea className="row-span-7">
          <ul className="space-y-2 px-1 lg:px-4 pt-2">
            {menu.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.link}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start",
                  )}
                  activeProps={{
                    className: cn(
                      buttonVariants({ variant: "secondary" }),
                      "w-full justify-start",
                    ),
                  }}
                >
                  {item.icon ?? <FaDotCircle />}
                  <span className="ml-2">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>

        <footer className="grid grid-cols-6 max-h-full border-t w-full">
          <div className="my-auto mx-auto col-span-2 lg:col-span-1">
            <img
              className="w-8 h-8 rounded-full"
              src={`https://gravatar.com/avatar/${emailHash}?s=64&d=mp`}
              alt={user?.name}
            />
          </div>

          <div className="col-span-3 lg:col-span-4 my-auto">
            <span className="font-light text-sm">{user?.name}</span>
          </div>

          <div className="p-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-full translate-y-0.5"
                >
                  <CiMenuKebab />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">My profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings/account">Account settings</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuCheckboxItem
                        checked={theme === "system"}
                        onCheckedChange={() => setTheme("system")}
                      >
                        System
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={theme === "light"}
                        onCheckedChange={() => setTheme("light")}
                      >
                        Light
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={theme === "dark"}
                        onCheckedChange={() => setTheme("dark")}
                      >
                        Dark
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </footer>
      </div>
    </nav>
  );
}
