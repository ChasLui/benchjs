import {
  ChartPieIcon,
  FolderTreeIcon,
  SettingsIcon,
  // PackageIcon,
} from "lucide-react";
import { SidebarIcon } from "@/components/playground/SidebarIcon";

export type SidebarTab = "code" | "compare" | "environment" | "settings";

export interface SidebarProps {
  children?: React.ReactNode;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export const Sidebar = ({ children, activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 border-r">
        <SidebarIcon
          icon={FolderTreeIcon}
          isActive={activeTab === "code"}
          tooltip="Code"
          onClick={() => onTabChange("code")}
        />
        <SidebarIcon
          icon={ChartPieIcon}
          isActive={activeTab === "compare"}
          tooltip="Compare"
          onClick={() => onTabChange("compare")}
        />
        {/* <SidebarIcon */}
        {/*   icon={PackageIcon} */}
        {/*   isActive={activeTab === "environment"} */}
        {/*   tooltip="Environment" */}
        {/*   onClick={() => onTabChange("environment")} */}
        {/* /> */}
        <SidebarIcon
          icon={SettingsIcon}
          isActive={activeTab === "settings"}
          tooltip="Settings"
          onClick={() => onTabChange("settings")}
        />
      </div>
      {children}
    </div>
  );
};
