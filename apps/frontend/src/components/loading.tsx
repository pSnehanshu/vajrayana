import { cn } from "@/lib/utils";
import { AiOutlineLoading } from "react-icons/ai";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <div className="flex justify-center items-center h-36 animate-pulse">
        <AiOutlineLoading
          className="animate-spin"
          size="3em"
          title="Data loading spinner"
        />
      </div>
    </div>
  );
}
