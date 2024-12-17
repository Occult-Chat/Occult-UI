import React from 'react';
import { Button } from '@/components/ui/button';
import { PopoverContent } from '@/components/ui/popover';
import { StatusIndicator } from '@/components/StatusIndicator';

interface Role {
  id: string;
  name: string;
  color: string;
}

interface User {
  id: string;
  name: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar?: string;
  customStatus?: string;
  roles?: Role[];
  pronouns?: string;
  description?: string;
  joinedAt: string;
}

interface UserPopoverProps {
  user: User;
}

export const UserPopover: React.FC<UserPopoverProps> = ({ user }) => {
  return (
    <PopoverContent 
      side="right" 
      className="w-80 p-0 bg-zinc-900 border border-zinc-800 animate-in slide-in-from-left-1 duration-200"
    >
      <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600" />
      <div className="p-4">
        <div className="flex items-start mb-4">
          <div className="relative -mt-10">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-900">
              {user.avatar && (
                <img 
                  src={user.avatar} 
                  alt="" 
                  className="w-full h-full rounded-full" 
                />
              )}
            </div>
            <StatusIndicator status={user.status} />
          </div>
          <div className="ml-4 mt-2">
            <h3 className="text-xl font-bold text-zinc-100">{user.name}</h3>
            {user.customStatus && (
              <p className="text-sm text-zinc-400">{user.customStatus}</p>
            )}
          </div>
        </div>
        
        {user.roles && user.roles.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">
              Roles
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.roles.map(role => (
                <span 
                  key={role.id} 
                  className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-300"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 bg-zinc-800 hover:bg-zinc-700"
          >
            Message
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-zinc-800 hover:bg-zinc-700"
          >
            Profile
          </Button>
        </div>
      </div>
    </PopoverContent>
  );
};

export default UserPopover;