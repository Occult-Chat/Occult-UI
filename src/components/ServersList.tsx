import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { StatusIndicator } from '@/components/StatusIndicator';
import { UserPopover } from './UserPopover';
import SettingsModal from './SettingsModal';

interface ServersSidebarProps {
  currentUser: {
    id: string;
    name: string;
    avatar: string;
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
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="bg-zinc-950 flex flex-col items-center m-2 mr-0 space-y-4 rounded-md p-2">
      <div className="flex-1 overflow-y-auto flex flex-col items-center space-y-4">
        <Button 
          variant="outline" 
          className="w-12 h-12 p-0 rounded-lg hover:bg-blue-950 bg-white"
        />
        {/* Example server icons */}
        <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
          <img src="/api/placeholder/200/310" alt="Server 1" className="w-full h-full rounded-lg" />
        </Button>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
          <img src="/api/placeholder/200/320" alt="Server 2" className="w-full h-full rounded-lg" />
        </Button>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
          <img src="/api/placeholder/200/330" alt="Server 3" className="w-full h-full rounded-lg" />
        </Button>
      </div>

      <Button 
        variant="outline" 
        className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700"
      >
        <Plus size={24} />
      </Button>

      {/* User Status and Settings */}
      <div className="border-t border-zinc-800 w-full pt-2">
        <Popover>
          <PopoverTrigger asChild>
            <div className="p-3 flex items-center space-x-3 hover:bg-zinc-900 transition-colors cursor-pointer rounded-lg">
              <div className="relative">
                <img className="w-8 h-8 rounded-full bg-zinc-800" src="https://avatars.githubusercontent.com/u/34868944?v=4" />
                <StatusIndicator status={currentUser.status} />
              </div>
            </div>
          </PopoverTrigger>
          <UserPopover user={currentUser} />
        </Popover>

        <Button
          variant="ghost"
          className="w-full mt-2 p-3 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={20} className="text-zinc-400" />
        </Button>
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default ServersSidebar;