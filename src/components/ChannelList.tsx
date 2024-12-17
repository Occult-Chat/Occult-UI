import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChannelIcon } from '@/components/ui/ChannelIcon';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'gallery' | 'forum' | 'documentation';
  unread?: boolean;
  mentions?: number;
}

interface Category {
  id: string;
  name: string;
  channels: Channel[];
  isExpanded?: boolean;
}

interface ChannelSectionProps {
  categories: Category[];
  selectedChannelId?: string;
  onToggleCategory: (categoryId: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onAddChannel: (categoryId: string) => void;
  onAddCategory: () => void;
}

const ChannelSection: React.FC<ChannelSectionProps> = ({
  categories,
  selectedChannelId,
  onToggleCategory,
  onSelectChannel,
  onAddChannel,
  onAddCategory,
}) => {
  return (
    <div className="w-64 bg-zinc-950 flex flex-col min-h-0 rounded-b-md">
      <button className="p-3 border-b border-zinc-800 flex items-center justify-between hover:bg-zinc-900 transition-colors">
        <h1 className="text-lg font-bold text-zinc-100">My Server</h1>
        <ChevronDown size={20} className="text-zinc-400" />
      </button>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map((category) => (
            <div key={category.id} className="mb-4">
              <button
                onClick={() => onToggleCategory(category.id)}
                className="w-full text-sm text-zinc-400 font-semibold mb-1 px-2 flex items-center justify-between hover:text-zinc-300"
              >
                <div className="flex items-center">
                  <ChevronDown
                    size={16}
                    className={cn(
                      "mr-1 transition-transform",
                      !category.isExpanded && "-rotate-90"
                    )}
                  />
                  <span>{category.name.toUpperCase()}</span>
                </div>
                <Plus
                  size={16}
                  className="hover:text-zinc-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChannel(category.id);
                  }}
                />
              </button>

              {category.isExpanded &&
                category.channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1 rounded group hover:bg-zinc-800 transition-colors",
                      selectedChannelId === channel.id &&
                        "bg-blue-500 bg-opacity-20 text-blue-400"
                    )}
                  >
                    <div className="flex items-center">
                      <ChannelIcon type={channel.type} />
                      <span
                        className={cn(
                          "text-zinc-400 group-hover:text-zinc-300",
                          channel.unread && "font-semibold text-zinc-100"
                        )}
                      >
                        {channel.name}
                      </span>
                    </div>
                    {channel.mentions && (
                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                        {channel.mentions}
                      </span>
                    )}
                  </button>
                ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      <button
        onClick={onAddCategory}
        className="m-2 p-2 w-full text-sm text-zinc-400 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        Add Category
      </button>
    </div>
  );
};

export default ChannelSection;