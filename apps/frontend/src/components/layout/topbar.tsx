import { Link } from "@tanstack/react-router";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { IoMenuOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Topbar({ className, ...props }: TopbarProps) {
  return (
    <nav className={cn("border-b p-1 bg-background", className)} {...props}>
      <div className="grid grid-cols-8">
        <div className="col-span-4 flex items-center">
          <Link to="/">
            <img src={logo} alt="ZigBolt LOGO" className="w-24" />
          </Link>
        </div>

        <div className="col-start-8 col-span-1 flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <IoMenuOutline />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Sidebar showLogo={false} className="h-full mt-4" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
