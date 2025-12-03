import { MonacoTab } from "@/components/common/MonacoTab";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface TabContextMenuProps {
  tab: MonacoTab;
  tabs: MonacoTab[];
  onClose: (tab: MonacoTab) => void;
  onCloseOthers: (tab: MonacoTab) => void;
  onCloseLeft: (tab: MonacoTab) => void;
  onCloseRight: (tab: MonacoTab) => void;
  children: React.ReactNode;
}

export const TabContextMenu = ({
  tab,
  tabs,
  onClose,
  onCloseOthers,
  onCloseLeft,
  onCloseRight,
  children,
}: TabContextMenuProps) => {
  const tabIndex = tabs.findIndex((t) => t.id === tab.id);
  const hasTabsToTheLeft = tabIndex > 0;
  const hasTabsToTheRight = tabIndex < tabs.length - 1;
  const hasOtherTabs = tabs.length > 1;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent onClick={(e) => e.stopPropagation()}>
        <ContextMenuItem onClick={() => onClose(tab)}>Close</ContextMenuItem>
        {hasOtherTabs && <ContextMenuItem onClick={() => onCloseOthers(tab)}>Close Others</ContextMenuItem>}
        {hasTabsToTheLeft && (
          <ContextMenuItem onClick={() => onCloseLeft(tab)}>Close Tabs to the Left</ContextMenuItem>
        )}
        {hasTabsToTheRight && (
          <ContextMenuItem onClick={() => onCloseRight(tab)}>Close Tabs to the Right</ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
