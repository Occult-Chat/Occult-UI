import React, { useState, useRef, useEffect } from 'react';
import { Hash, Settings, Users, Bell, ChevronDown, Plus, Mic, Image, MessageSquare, Book} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TitleBar } from '@/components/TitleBar';
import { TabBar } from '@/components/TabBar';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { StatusIndicator } from '@/components/StatusIndicator';
import UserSidebar from '@/components/UserSidebar';

// Types
interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
}

interface Category {
  id: string;
  name: string;
  channels: Channel[];
  isExpanded?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'gallery' | 'forum' | 'documentation';
  unread?: boolean;
  mentions?: number;
}

interface Role {
  id: string;
  name: string;
  color: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
}

interface Activity {
  type: 'gaming' | 'listening' | 'custom' | 'streaming';
  name: string;
  details?: string;
  startedAt?: string;
}

interface User {
  id: string;
  name: string;
  displayName?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar?: string;
  customStatus?: string;
  roles?: Role[];
  pronouns?: string;
  description?: string;
  joinedAt: string;
  badges?: Badge[];
  activities?: Activity[];
}

interface Tab {
  id: string;
  state: {
    selectedChannel: Channel | undefined;
    messages: Message[];
  };
}

const ChannelIcon: React.FC<{ type: Channel['type'] }> = ({ type }) => {
  switch (type) {
    case 'voice':
      return <Mic size={18} className="mr-2 text-zinc-400" />;
    case 'gallery':
      return <Image size={18} className="mr-2 text-zinc-400" />;
    case 'forum':
      return <MessageSquare size={18} className="mr-2 text-zinc-400" />;
    case 'documentation':
      return <Book size={18} className="mr-2 text-zinc-400" />;
    default:
      return <Hash size={18} className="mr-2 text-zinc-400" />;
  }
};

const UserPopover: React.FC<{ user: User }> = ({ user }) => {
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
              {user.avatar && <img src={user.avatar} alt="" className="w-full h-full rounded-full" />}
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
            <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Roles</h4>
            <div className="flex flex-wrap gap-2">
              {user.roles.map(role => (
                <span key={role.id} className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-300">
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-zinc-800 hover:bg-zinc-700">
            Message
          </Button>
          <Button variant="outline" className="flex-1 bg-zinc-800 hover:bg-zinc-700">
            Profile
          </Button>
        </div>
      </div>
    </PopoverContent>
  );
};

export default function MessagingApp() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'General',
      isExpanded: true,
      channels: [
        { id: '1', name: 'welcome', type: 'text' },
        { id: '2', name: 'announcements', type: 'text', mentions: 2 }
      ]
    },
    {
      id: '2',
      name: 'Voice',
      isExpanded: true,
      channels: [
        { id: '3', name: 'General Voice', type: 'voice' },
        { id: '4', name: 'Music', type: 'voice' }
      ]
    }
  ]);
  
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: '1',
      state: {
        selectedChannel: undefined,
        messages: []
      }
    }
  ]);
  
  const [activeTabId, setActiveTabId] = useState('1');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMemberList, setShowMemberList] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newChannel, setNewChannel] = useState<{ name: string; type: Channel['type'] }>({ name: '', type: 'text' });
  
  const [users] = useState<User[]>([
    { 
      id: '1',
      name: 'AliceGaming',
      displayName: 'Alice',
      status: 'online',
      pronouns: 'she/her',
      description: 'Senior developer and gaming enthusiast. Always up for a gaming session!',
      customStatus: '🎮 Playing Cyberpunk 2077',
      joinedAt: '2023-01-15',
      activities: [
        {
          type: 'gaming',
          name: 'Cyberpunk 2077',
          details: 'Night City - Level 45',
          startedAt: '2024-12-15T10:00:00Z'
        },
        {
          type: 'listening',
          name: 'Spotify',
          details: 'Cyberpunk 2077 OST',
          startedAt: '2024-12-15T11:30:00Z'
        }
      ],
      roles: [
        {
          id: 'r1',
          name: 'Admin',
          color: '#ff4444'
        },
        {
          id: 'r2',
          name: 'Moderator',
          color: '#44ff44'
        }
      ],
      badges: [
        {
          id: 'b1',
          name: 'Early Supporter',
          icon: '⭐'
        },
        {
          id: 'b2',
          name: 'Server Booster',
          icon: '🚀'
        }
      ]
    },
    { 
      id: '2', 
      name: 'BobTheBuilder',
      displayName: 'Bob',
      status: 'idle',
      pronouns: 'he/him',
      description: 'Can we fix it? Yes we can!',
      joinedAt: '2023-03-20',
      customStatus: '🏗️ Building something cool',
      roles: [
        {
          id: 'r3',
          name: 'Member',
          color: '#4444ff'
        }
      ],
      badges: [
        {
          id: 'b3',
          name: 'Bug Hunter',
          icon: '🐛'
        }
      ]
    },
    { 
      id: '3',
      name: 'CharlieDev',
      displayName: 'Charlie',
      status: 'dnd',
      pronouns: 'they/them',
      description: 'Full-stack developer by day, pixel artist by night',
      customStatus: '🎯 Focused',
      joinedAt: '2023-06-10',
      activities: [
        {
          type: 'custom',
          name: 'Coding',
          details: 'Working on a secret project',
          startedAt: '2024-12-15T09:00:00Z'
        }
      ],
      roles: [
        {
          id: 'r4',
          name: 'Developer',
          color: '#bb44ff'
        }
      ],
      badges: [
        {
          id: 'b4',
          name: 'Code Contributor',
          icon: '💻'
        },
        {
          id: 'b5',
          name: 'Artist',
          icon: '🎨'
        }
      ]
    },
    { 
      id: '4',
      name: 'DavidOffline',
      displayName: 'David',
      status: 'offline',
      pronouns: 'he/him',
      description: 'Casual gamer and meme enthusiast',
      joinedAt: '2023-09-01',
      roles: [
        {
          id: 'r5',
          name: 'Member',
          color: '#4444ff'
        }
      ],
      badges: [
        {
          id: 'b6',
          name: 'Meme Lord',
          icon: '🎭'
        }
      ]
    }
  ]);

  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  useEffect(() => {
    if (activeTab?.state.selectedChannel) {
      scrollToBottom(false);
    }
  }, [activeTab?.state.messages]);

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isExpanded: !cat.isExpanded }
        : cat
    ));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      channels: [],
      isExpanded: true
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setShowCategoryModal(false);
  };

  const addChannel = () => {
    if (!newChannel.name.trim() || !selectedCategory) return;
    
    setCategories(categories.map(cat => 
      cat.id === selectedCategory
        ? {
            ...cat,
            channels: [...cat.channels, {
              id: Date.now().toString(),
              name: newChannel.name,
              type: newChannel.type
            }]
          }
        : cat
    ));
    
    setNewChannel({ name: '', type: 'text' });
    setShowChannelModal(false);
  };

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      state: {
        selectedChannel: undefined,
        messages: []
      }
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (tabId === activeTabId) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
    }
    
    setTabs(newTabs);
  };

  const selectChannel = (channel: Channel) => {
    if (!activeTab) return;
    const isNewChannel = activeTab.state.selectedChannel?.id !== channel.id;
    const updatedMessages: Message[] = isNewChannel ? [
      { 
        id: Date.now().toString(),
        author: 'System',
        content: `Welcome to #${channel.name}!`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }
    ] : activeTab.state.messages;

    setTabs(tabs.map(tab => 
      tab.id === activeTabId
        ? { 
            ...tab, 
            state: { 
              selectedChannel: channel,
              messages: updatedMessages
            } 
          }
        : tab
    ));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab || !messageInput.trim() || !activeTab.state.selectedChannel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: 'You',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString(),
      isSystem: false
    };

    setTabs(tabs.map(tab => 
      tab.id === activeTabId
        ? {
            ...tab,
            state: {
              ...tab.state,
              messages: [...tab.state.messages, newMessage]
            }
          }
        : tab
    ));
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-gray-100 rounded-lg">
      <TitleBar/>

      <div className="flex flex-1 min-h-0">
        {/* Servers Sidebar */}
        <div className="bg-zinc-950 flex flex-col items-center m-2 mr-0 space-y-4 rounded-md p-2">
          <div className="flex-1 overflow-y-auto flex flex-col items-center space-y-4">
            <Button variant="outline" className="mask-broom w-12 h-12 p-0 rounded-lg hover:bg-blue-950 bg-white"/>
            {/* Example server icons */}
            <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
              <img src="https://via.placeholder.com/48" alt="Server 1" className="w-full h-full rounded-lg" />
            </Button>
            <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
              <img src="https://via.placeholder.com/48" alt="Server 2" className="w-full h-full rounded-lg" />
            </Button>
            <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
              <img src="https://via.placeholder.com/48" alt="Server 3" className="w-full h-full rounded-lg" />
            </Button>
          </div>
          <Button variant="outline" className="w-12 h-12 p-0 rounded-lg bg-zinc-800 hover:bg-zinc-700">
            <Plus size={24} />
          </Button>
        </div>

      {/* Tab Layout */}
      <div className="flex-1 flex flex-col min-h-0 m-2 rounded-md">

        <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabClose={closeTab}
        onTabAdd={addTab}
      />

      <div className="flex flex-1 min-h-0">
        {/* Categories and Channels Sidebar */}
        <div className="w-64 bg-zinc-950 flex flex-col min-h-0  rounded-b-md">
          <button className="p-3 border-b border-zinc-800 flex items-center justify-between hover:bg-zinc-900 transition-colors">
            <h1 className="text-lg font-bold text-zinc-100">MessageHub</h1>
            <ChevronDown size={20} className="text-zinc-400" />
          </button>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {categories.map(category => (
                <div key={category.id} className="mb-4">
                  <button
                    onClick={() => toggleCategory(category.id)}
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
                        setSelectedCategory(category.id);
                        setShowChannelModal(true);
                      }}
                    />
                  </button>
                  
                  {category.isExpanded && category.channels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => selectChannel(channel)}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1 rounded group hover:bg-zinc-800 transition-colors",
                        activeTab?.state.selectedChannel?.id === channel.id && "bg-blue-500 bg-opacity-20 text-blue-400"
                      )}
                    >
                      <div className="flex items-center">
                        <ChannelIcon type={channel.type} />
                        <span className={cn(
                          "text-zinc-400 group-hover:text-zinc-300",
                          channel.unread && "font-semibold text-zinc-100"
                        )}>{channel.name}</span>
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
            onClick={() => setShowCategoryModal(true)}
            className="m-2 p-2 w-full text-sm text-zinc-400 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors">
            <Plus size={16} className="mr-2" />
            Add Category
          </button>

          {/* User Status */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-3 border-t border-zinc-800 flex items-center space-x-3 hover:bg-zinc-900 transition-colors cursor-pointer">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                  <StatusIndicator status="online" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">Your Name</div>
                  <div className="text-xs text-zinc-400">online</div>
                </div>
                <div className="flex space-x-2 text-zinc-400">
                  <button className="hover:text-zinc-200">
                    <Bell size={18} />
                  </button>
                  <button className="hover:text-zinc-200">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </PopoverTrigger>
            <UserPopover user={{
              id: '0',
              name: 'Your Name',
              status: 'online',
              customStatus: '🎮 Available',
              joinedAt: '2023-01-01',
              roles: [{ id: 'r1', name: 'Member', color: '#4444ff' }]
            }} />
          </Popover>
        </div>


        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">

          {activeTab?.state.selectedChannel ? (
            <>
              <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
                <div className="flex items-center">
                  <ChannelIcon type={activeTab.state.selectedChannel.type} />
                  <span className="font-semibold">{activeTab.state.selectedChannel.name}</span>
                </div>
                <div className="flex items-center space-x-4 text-zinc-400">
                  <button 
                    onClick={() => setShowMemberList(!showMemberList)}
                    className={cn(
                      "hover:text-zinc-200 transition-colors",
                      showMemberList && "text-blue-400"
                    )}
                  >
                    <Users size={20} />
                  </button>
                </div>
              </div>

              <MessageList 
                messages={activeTab.state.messages}
                messagesEndRef={messagesEndRef}
              />

              <MessageInput
                messageInput={messageInput}
                isTyping={isTyping}
                channelName={activeTab.state.selectedChannel.name}
                onMessageChange={(value) => {
                  setMessageInput(value);
                  setIsTyping(true);
                  setTimeout(() => setIsTyping(false), 1000);
                }}
                onSubmit={sendMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center space-y-4">
                <Hash size={48} className="mx-auto text-zinc-600" />
                <h2 className="text-xl font-semibold text-zinc-300">Welcome to MessageHub</h2>
                <p className="text-sm">Select a channel to start messaging</p>
                <div className="flex justify-center space-x-2">
                  {categories[0]?.channels.slice(0, 3).map(channel => (
                    <Button
                      key={channel.id}
                      variant="outline"
                      className="gap-2"
                      onClick={() => selectChannel(channel)}
                    >
                      <ChannelIcon type={channel.type} />
                      {channel.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Members Sidebar */}
        <UserSidebar 
          users={users}
          showMemberList={showMemberList}
        />
      </div>
    </div>
    </div>

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="bg-zinc-800 border-zinc-700"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCategoryModal(false)}
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={addCategory}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Channel Modal */}
      <Dialog open={showChannelModal} onOpenChange={setShowChannelModal}>
        <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newChannel.name}
              onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
              placeholder="Channel name"
              className="bg-zinc-800 border-zinc-700"
            />
            <Select
              value={newChannel.type}
              onValueChange={(value: Channel['type']) => setNewChannel({ ...newChannel, type: value })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Channel type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="text">Text Channel</SelectItem>
                <SelectItem value="voice">Voice Channel</SelectItem>
                <SelectItem value="gallery">Gallery Channel</SelectItem>
                <SelectItem value="forum">Forum Channel</SelectItem>
                <SelectItem value="documentation">Documentation Channel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowChannelModal(false)}
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={addChannel}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}