import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ReloadIcon } from "@radix-ui/react-icons";
import { MdContentCopy } from "react-icons/md";
import copy from "copy-to-clipboard";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";
import { toast } from "sonner";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading ? true : disabled}
        {...props}
      >
        <>
          {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {size === "icon" && isLoading ? null : children}
        </>
      </Comp>
    );
  },
);
Button.displayName = "Button";

interface FileButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  render?: React.ComponentType<{ onClick: () => void }>;
}
const FileButton = React.forwardRef<HTMLInputElement, FileButtonProps>(
  ({ render: Render, className, ...props }, ref) => {
    const localRef = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
      if (props.id) {
        document.getElementById(props.id)?.click();
      } else if (ref && "current" in ref) {
        ref.current?.click();
      } else {
        localRef.current?.click();
      }
    };

    return (
      <div className={className}>
        {Render ? (
          <Render onClick={handleClick} />
        ) : (
          <Button type="button" variant="outline" onClick={handleClick}>
            Choose file
          </Button>
        )}
        <input
          {...props}
          ref={ref ?? localRef}
          type="file"
          className="hidden"
        />
      </div>
    );
  },
);
FileButton.displayName = "FileButton";

interface CopyToClipboardProps extends ButtonProps {
  data: string;
}
const CopyToClipboard = React.forwardRef<
  HTMLButtonElement,
  CopyToClipboardProps
>(({ data, ...props }, ref) => {
  const handleCopy = () => {
    try {
      copy(data.toString(), {
        debug: import.meta.env.DEV,
      });
      toast("Copied!");
    } catch (error) {
      console.error(error);
      toast("Failed to copy", { className: "text-destructive" });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            {...props}
            ref={ref}
            onClick={handleCopy}
          >
            <MdContentCopy />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
CopyToClipboard.displayName = "CopyToClipboard";

export { Button, FileButton, CopyToClipboard, buttonVariants };
