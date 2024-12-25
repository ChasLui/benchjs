import { ZapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "default" | "huge" | "large";
  noIcon?: boolean;
}

export const Logo = ({ noIcon, size = "default" }: LogoProps) => {
  return (
    <div className="flex gap-1 items-center">
      {!noIcon && (
        <ZapIcon
          className={cn(
            "w-5 h-5 text-yellow-500",
            size === "large" && "w-9 h-9",
            size === "huge" && "w-12 h-12",
          )}
        />
      )}
      <span
        className={cn(
          "text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-700 dark:from-zinc-300 dark:to-zinc-400",
          size === "large" && "text-4xl",
          size === "huge" && "text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl/none",
        )}
      >
        <span>Bench</span>
        <span className="p-0.5 bg-yellow-400 text-zinc-800">JS</span>
      </span>
    </div>
  );
};
