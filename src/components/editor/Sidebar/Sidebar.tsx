import { ChartPieIcon, FolderTreeIcon, PackageIcon, SettingsIcon } from "lucide-react";
import { SidebarIcon } from "@/components/editor/SidebarIcon";

export type SidebarTab = "code" | "environment" | "results" | "settings";

export interface SidebarProps {
  children?: React.ReactNode;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export const Sidebar = ({ children, activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="flex h-full bg-zinc-100">
      <div className="flex flex-col flex-1 border-r">
        <SidebarIcon
          icon={FolderTreeIcon}
          isActive={activeTab === "code"}
          tooltip="Code"
          onClick={() => onTabChange("code")}
        />
        <SidebarIcon
          icon={ChartPieIcon}
          isActive={activeTab === "results"}
          tooltip="Results"
          onClick={() => onTabChange("results")}
        />
        <SidebarIcon
          icon={PackageIcon}
          isActive={activeTab === "environment"}
          tooltip="Environment"
          onClick={() => onTabChange("environment")}
        />
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
