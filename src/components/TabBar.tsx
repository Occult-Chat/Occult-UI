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
  <div className="h-8 bg-zinc-950 flex items-center border-b border-zinc-800">
    <ScrollArea className="h-full flex-1">
      <div className="flex h-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabSelect(tab.id)}
            className={cn(
              "h-full px-3 flex items-center space-x-2 min-w-[120px] max-w-[200px] group transition-colors",
              tab.id === activeTabId
                ? "bg-zinc-900 text-blue-400 border-t-2 border-t-blue-500"
                : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Hash size={16} />
            <span className="truncate">
              {tab.state.selectedChannel?.name ?? 'MessageHub'}
            </span>
            {tabs.length > 1 && (
              <X
                size={14}
                onClick={(e) => onTabClose(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
              />
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
    <button
      onClick={onTabAdd}
      className="h-8 w-8 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:bg-zinc-900 transition-colors"
      title="New Tab"
    >
      <Plus size={18} />
    </button>
  </div>
);
