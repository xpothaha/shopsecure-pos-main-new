
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent",
        {
          "h-6 w-6": size === "sm",
          "h-8 w-8": size === "md",
          "h-12 w-12": size === "lg",
        },
        "text-primary",
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
