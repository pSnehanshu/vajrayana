import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { IoMenuOutline } from "react-icons/io5";
import { cn, useOrgLogo } from "@/lib/utils";
import { useMobileMenuStore } from "@/store";

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Topbar({ className, ...props }: TopbarProps) {
  const toggleMenu = useMobileMenuStore((s) => s.toggle);
  const logo = useOrgLogo();

  return (
    <nav className={cn("border-b p-1 bg-background", className)} {...props}>
      <div className="grid grid-cols-8">
        <div className="col-span-4 flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="ZigBolt LOGO"
              className="h-12 object-contain"
            />
          </Link>
        </div>

        <div className="col-start-8 col-span-1 flex items-center">
          <Button variant="secondary" onClick={toggleMenu}>
            <IoMenuOutline />
          </Button>
        </div>
      </div>
    </nav>
  );
}
