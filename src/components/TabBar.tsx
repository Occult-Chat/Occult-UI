import { Hash, Plus, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Tab = {
    id: string;
    state: {
        selectedChannel?: {
            name: string;
        };
    };
};

export const TabBar = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabAdd
}: {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string, e: React.MouseEvent) => void;
  onTabAdd: () => void;
}) => (
  <div className="h-12 bg-zinc-950 flex items-center border-b border-zinc-800 relative rounded-t-md">
    <ScrollArea className="h-full flex-1">
      <div className="flex h-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabSelect(tab.id)}
            className={cn(
              "h-full px-4 flex items-center space-x-2 min-w-[120px] max-w-[200px] group relative rounded-t-md",
              "transition-colors duration-200 ease-in-out p-2 m-1",
              tab.id === activeTabId
                ? "bg-zinc-900 text-blue-400 border-b-2 border-b-blue-500"
                : "hover:bg-zinc-900/70 text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Hash 
              size={16} 
              className={cn(
                "transition-colors duration-200",
                tab.id === activeTabId ? "text-blue-400" : "text-zinc-500"
              )}
            />
            <span className="truncate font-medium">
              {tab.state.selectedChannel?.name ?? 'MessageHub'}
            </span>
            {tabs.length > 1 && (
              <X
                size={14}
                onClick={(e) => onTabClose(tab.id, e)}
                className={cn(
                  "opacity-0 group-hover:opacity-100 hover:text-red-400",
                  "transition-opacity duration-200 ease-in-out",
                  "hover:rotate-90"
                )}
              />
            )}
            {tab.id === activeTabId && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500/50 blur-sm" />
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
    <button
      onClick={onTabAdd}
      className={cn(
        "h-12 w-12 flex items-center justify-center",
        "text-zinc-400 hover:text-blue-400 hover:bg-zinc-900",
        "transition-colors duration-200 ease-in-out"
      )}
      title="New Tab"
    >
      <Plus 
        size={18} 
        className="transition-transform duration-200 hover:rotate-90"
      />
    </button>
  </div>
);

export default TabBar;