import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { StatusIndicator } from '@/components/StatusIndicator';
import { UserPopover } from './UserPopover';

interface ServersSidebarProps {
  currentUser: {
    id: string;
    name: string;
    status: 'online' | 'idle' | 'dnd' | 'offline';
    customStatus?: string;
    joinedAt: string;
    roles?: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  };
}

const ServersSidebar: React.FC<ServersSidebarProps> = ({ currentUser }) => {
  return (
    <div className="bg-zinc-950 flex flex-col items-center m-2 mr-0 space-y-4 rounded-md p-2">
      <div className="flex-1 overflow-y-auto flex flex-col items-center space-y-4">
        <Button 
          variant="outline" 
          className="mask-broom w-12 h-12 p-0 rounded-lg hover:bg-blue-950 bg-white"
        />
        {/* Example server icons */}
        <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
          <img src="https://picsum.photos/200/310" alt="Server 1" className="w-full h-full rounded-lg" />
        </Button>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
          <img src="https://picsum.photos/200/320" alt="Server 2" className="w-full h-full rounded-lg" />
        </Button>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
          <img src="https://picsum.photos/200/330" alt="Server 3" className="w-full h-full rounded-lg" />
        </Button>
      </div>

      <Button 
        variant="outline" 
        className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700"
      >
        <Plus size={24} />
      </Button>

      {/* User Status */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="p-3 border-t border-zinc-800 flex items-center space-x-3 hover:bg-zinc-900 transition-colors cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <StatusIndicator status={currentUser.status} />
            </div>
          </div>
        </PopoverTrigger>
        <UserPopover user={currentUser} />
      </Popover>
    </div>
  );
};

export default ServersSidebar;