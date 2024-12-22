import { useState } from "react";
import { cn } from "@/lib/utils";

export const SidebarIcon = ({
  icon: Icon,
  isActive,
  tooltip,
  count,
  onClick,
}: {
  icon: React.ElementType;
  isActive: boolean;
  tooltip: string;
  count?: number;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center justify-center h-12 w-12 hover:bg-[#e8e8e8] cursor-pointer relative",
          isActive && "border-l-2 border-blue-600",
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* icon */}
        <Icon className={cn("h-5 w-5", isActive && "text-blue-600")} />

        {/* badge */}
        {count && (
          <span className="absolute right-0.5 top-1 px-0.5 text-xs text-blue-800 bg-blue-100 rounded-sm">
            {count}
          </span>
        )}
      </div>
      {isHovered && (
        <div className="absolute top-1/2 left-full z-50 py-1 px-2 ml-2 text-xs text-white bg-black rounded -translate-y-1/2">
          {tooltip}
        </div>
      )}
    </div>
  );
};
