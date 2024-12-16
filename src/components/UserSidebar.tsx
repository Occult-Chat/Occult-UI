import React, { useState, useRef, useEffect } from 'react';
import { Users, Music, Gamepad, Radio, Clock, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusIndicator } from './StatusIndicator';
import { cn } from '@/lib/utils';

export interface User {
  id: string;
  name: string;
  displayName?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  pronouns?: string;
  description?: string;
  joinedAt: string;
  activities?: {
    type: 'gaming' | 'listening' | 'streaming' | 'custom';
    name: string;
    details?: string;
    startedAt?: string;
  }[];
  roles?: {
    id: string;
    name: string;
    color: string;
  }[];
  badges?: {
    id: string;
    name: string;
    icon: string;
  }[];
  customStatus?: string;
}

export interface UserSidebarProps {
  users: User[];
  showMemberList: boolean;
}

const formatDuration = (startDate: string) => {
  const start = new Date(startDate);
  const now = new Date();
  const hours = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60));
  return `${hours} hours`;
};

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'gaming':
      return <Gamepad className="w-4 h-4 text-green-400" />;
    case 'listening':
      return <Music className="w-4 h-4 text-green-400" />;
    case 'streaming':
      return <Radio className="w-4 h-4 text-purple-400" />;
    default:
      return null;
  }
};

const UserProfile = ({ 
  user, 
  position, 
  onClose 
}: { 
  user: User;
  position: { top: number; left: number };
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const popup = ref.current;
    const rect = popup.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    let top = position.top;
    if (top + rect.height > viewportHeight) {
      top = Math.max(16, viewportHeight - rect.height - 16);
    }
    
    let left = position.left;
    if (left + rect.width > viewportWidth) {
      left = Math.max(16, viewportWidth - rect.width - 16);
    }
    
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 w-80 bg-zinc-900 rounded-lg shadow-lg border border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-200"
      style={{
        top: position.top,
        left: position.left,
        maxHeight: 'calc(100vh - 32px)',
      }}
    >
      {/* Banner with Profile Picture */}
      <div className="relative h-32">
        {/* Banner Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 animate-in zoom-in-95 duration-300" />
        
        {/* Profile Picture Container */}
        <div className="absolute -bottom-10 left-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-900" />
            <div className="absolute bottom-0 right-0">
              <StatusIndicator status={user.status} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 pt-12 pb-4 overflow-y-auto max-h-[calc(100vh-32px-8rem)]">
        {/* User Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-white">{user.displayName || user.name}</h3>
          </div>
          <div className="text-sm text-zinc-400 font-medium flex items-center gap-2">
            {user.name}
            {user.pronouns ? (
              <span className="text-zinc-500">({user.pronouns})</span>
            ) : (
              <>
                <span className="text-zinc-600">•</span>
                <button className="text-blue-400 hover:underline text-xs">
                  Add pronouns
                </button>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            You can add a custom message here
          </div>
        </div>

        {/* About Me Section */}
        <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg animate-in fade-in slide-in-from-bottom-1 duration-300 delay-150">
          <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">About Me</div>
          <button className="text-sm text-zinc-400 hover:text-zinc-300">
            Add a little bit about yourself
          </button>
        </div>

        {/* Note Section */}
        <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg animate-in fade-in slide-in-from-bottom-1 duration-300 delay-200">
          <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Note</div>
          <button className="text-sm text-zinc-400 hover:text-zinc-300">
            Click to add a note
          </button>
        </div>

        {/* Description */}
        {user.description && (
          <div className="mb-4 p-3 bg-zinc-950 rounded-lg">
            <div className="text-sm text-zinc-300">{user.description}</div>
          </div>
        )}

        {/* Custom Status */}
        {user.customStatus && (
          <div className="mb-4 text-sm text-zinc-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            {user.customStatus}
          </div>
        )}

        {/* Activities */}
        {user.activities && user.activities.length > 0 && (
          <div className="mb-4 p-3 bg-zinc-950 rounded-lg space-y-3">
            {user.activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-2">
                <ActivityIcon type={activity.type} />
                <div>
                  <div className="text-sm font-medium text-zinc-300">{activity.name}</div>
                  {activity.details && (
                    <div className="text-xs text-zinc-400">{activity.details}</div>
                  )}
                  {activity.startedAt && (
                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(activity.startedAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Roles */}
        {user.roles && user.roles.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Roles</div>
            <div className="flex flex-wrap gap-2">
              {user.roles.map(role => (
                <span
                  key={role.id}
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${role.color}20`, color: role.color }}
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mutual Servers */}
        <div className="mb-4 animate-in fade-in slide-in-from-bottom-1 duration-300 delay-250">
          <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Mutual Servers</div>
          <div className="flex -space-x-2">
            {[1,2,3].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900" />
            ))}
          </div>
        </div>

        {/* Add Role Section */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Roles</div>
          <div className="flex flex-wrap gap-2">
            <button className="px-2 py-1 rounded text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
              Add Role
            </button>
          </div>
        </div>

        {/* Member Since */}
        <div className="mb-4 text-sm text-zinc-400 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Member since today
        </div>

        {/* Profile Badges */}
        <div className="mb-4 animate-in fade-in slide-in-from-bottom-1 duration-300 delay-300">
          <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">Profile Badges</div>
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
              >
                <span className="text-zinc-500">+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors">
            Message
          </button>
          <button className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-sm font-medium transition-colors">
            View Profile
          </button>
          <button className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-sm font-medium transition-colors">
            More
          </button>
        </div>
      </div>
    </div>
  );
};

const UserSection = ({ 
  status, 
  users, 
  label,
  onUserClick
}: { 
  status: 'online' | 'idle' | 'dnd' | 'offline';
  users: User[];
  label: string;
  onUserClick: (user: User, event: React.MouseEvent) => void;
}) => (
  <div className="p-2">
    <div className="text-xs text-zinc-500 font-semibold mb-2 px-2">
      {label} — {users.length}
    </div>
    {users.map(user => (
      <button
        key={user.id}
        onClick={(e) => onUserClick(user, e)}
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

const UserSidebar = ({ users, showMemberList }: UserSidebarProps) => {
  const [selectedUser, setSelectedUser] = useState<{
    user: User;
    position: { top: number; left: number };
  } | null>(null);

  if (!showMemberList) return null;

  const usersByStatus = {
    online: users.filter(u => u.status === 'online'),
    idle: users.filter(u => u.status === 'idle'),
    dnd: users.filter(u => u.status === 'dnd'),
    offline: users.filter(u => u.status === 'offline')
  };

  const handleUserClick = (user: User, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      top: rect.top,
      left: rect.left - 288, // 272px (width) + 16px (gap)
    };

    setSelectedUser({ user, position });
  };

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
          onUserClick={handleUserClick}
        />
        <UserSection 
          status="idle"
          users={usersByStatus.idle}
          label="IDLE"
          onUserClick={handleUserClick}
        />
        <UserSection 
          status="dnd"
          users={usersByStatus.dnd}
          label="DO NOT DISTURB"
          onUserClick={handleUserClick}
        />
        <UserSection 
          status="offline"
          users={usersByStatus.offline}
          label="OFFLINE"
          onUserClick={handleUserClick}
        />
      </ScrollArea>

      {selectedUser && (
        <UserProfile
          user={selectedUser.user}
          position={selectedUser.position}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserSidebar;