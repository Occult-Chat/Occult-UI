import { Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusIndicator } from './StatusIndicator';
import { cn } from '@/lib/utils';

import type { User } from '@/types';

interface UserSidebarProps {
  users: User[];
  showMemberList: boolean;
}

export const UserSidebar = ({ users, showMemberList }: UserSidebarProps) => {
  if (!showMemberList) return null;

  const usersByStatus = {
    online: users.filter(u => u.status === 'online'),
    idle: users.filter(u => u.status === 'idle'),
    dnd: users.filter(u => u.status === 'dnd'),
    offline: users.filter(u => u.status === 'offline')
  };

  const UserSection = ({ 
    status, 
    users, 
    label 
  }: { 
    status: 'online' | 'idle' | 'dnd' | 'offline';
    users: User[];
    label: string;
  }) => (
    <div className="p-2">
      <div className="text-xs text-zinc-500 font-semibold mb-2 px-2">
        {label} — {users.length}
      </div>
      {users.map(user => (
        <button
          key={user.id}
          className="flex items-center w-full py-1.5 px-2 rounded hover:bg-zinc-800 transition-colors"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-zinc-800" />
            <StatusIndicator status={user.status} />
          </div>
          <span className={cn(
            "ml-2 text-sm",
            status === 'offline' && "text-zinc-500"
          )}>{user.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-64 bg-zinc-950 flex flex-col min-h-0 border-l border-zinc-800">
      <div className="p-3 flex items-center text-zinc-400 font-semibold border-b border-zinc-800">
        <Users size={18} className="mr-2" />
        ONLINE — {users.filter(u => u.status !== 'offline').length}
      </div>
      <ScrollArea className="flex-1">
        <UserSection 
          status="online"
          users={usersByStatus.online}
          label="ONLINE"
        />
        <UserSection 
          status="idle"
          users={usersByStatus.idle}
          label="IDLE"
        />
        <UserSection 
          status="dnd"
          users={usersByStatus.dnd}
          label="DO NOT DISTURB"
        />
        <UserSection 
          status="offline"
          users={usersByStatus.offline}
          label="OFFLINE"
        />
      </ScrollArea>
    </div>
  );
};