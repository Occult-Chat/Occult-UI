import React, { useState, useRef, useEffect } from 'react';
import { TitleBar } from '@/components/TitleBar';
import { TabBar } from '@/components/TabBar';
import UserSidebar, { User } from '@/components/UserSidebar';
import ServersSidebar from '@/components/ServersList';
import ChannelSection from '@/components/ChannelList';
import ChatArea from '@/components/ChatArea';
import CategoryModal from '@/components/NewCategoryModal';
import ChannelModal from '@/components/ChannelModal';
import SearchOverlay from '@/components/SearchOverlay';
import ScreenMirror from '@/components/ScreenMirror';
import CallPanel from '@/components/CallPanel';

const participants = [
  {
    id: '1',
    name: 'John Doe',
    isVideoOn: true,
    isAudioOn: true,
    isScreenSharing: false,
    isPinned: false
  },
  // ... more participants
];


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

interface Tab {
  id: string;
  state: {
    selectedChannel: Channel | undefined;
    messages: Message[];
  };
}

export default function MessagingApp() {
  // State
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

  const [tabs, setTabs] = useState<Tab[]>([{ 
    id: '1',
    state: {
      selectedChannel: undefined,
      messages: []
    }
  }]);

  const [activeTabId, setActiveTabId] = useState('1');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMemberList, setShowMemberList] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [newChannel, setNewChannel] = useState<{ name: string; type: Channel['type'] }>({
    name: '',
    type: 'text'
  });

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

  // Utility functions
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

  // Event handlers
  const handleToggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isExpanded: !cat.isExpanded }
        : cat
    ));
  };

  const handleAddCategory = () => {
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

  const handleAddChannel = () => {
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

  const handleTabAdd = () => {
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

  const handleTabClose = (tabId: string, e: React.MouseEvent) => {
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

  const handleSelectChannel = (channel: Channel) => {
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

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab || !messageInput.trim() || !activeTab.state.selectedChannel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: 'You',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString(),
      isSystem: false
    };

    let JSONMessage = JSON.stringify(newMessage);

    try {
      await fetch('https://your-api-endpoint.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSONMessage
      });
      
      console.log('Message sent:', JSONMessage);
      
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
    } catch (error) {
      console.error('Error posting message:', error);
      console.log('Message Data: ', JSONMessage);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 rounded-lg overflow-hidden">
      <TitleBar />

      <div className="flex flex-1 min-h-0">
        <ServersSidebar 
          currentUser={{
            id: '0',
            name: 'Trident_For_U',
            avatar: 'https://avatars.githubusercontent.com/u/34868944?v=4',
            status: 'online',
            customStatus: 'Cooking some insane Rust project probably',
            joinedAt: '2023-01-01',
            roles: [{ id: 'r1', name: 'Member', color: '#4444ff' }]
          }}
        />

        <div className="flex-1 flex flex-col min-h-0 m-2 rounded-md">
          <div className="h-12 bg-zinc-950 flex items-center border-b border-zinc-800 relative rounded-t-md w-full">
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onTabSelect={setActiveTabId}
              onTabClose={handleTabClose}
              onTabAdd={handleTabAdd}
            />
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <ChannelSection
              categories={categories}
              selectedChannelId={activeTab?.state.selectedChannel?.id}
              onToggleCategory={handleToggleCategory}
              onSelectChannel={handleSelectChannel}
              onAddChannel={(categoryId) => {
                setSelectedCategory(categoryId);
                setShowChannelModal(true);
              }}
              onAddCategory={() => setShowCategoryModal(true)}
            />

            {/* <ChatArea
              selectedChannel={activeTab?.state.selectedChannel}
              messages={activeTab?.state.messages || []}
              messageInput={messageInput}
              isTyping={isTyping}
              showMemberList={showMemberList}
              onToggleMemberList={() => setShowMemberList(!showMemberList)}
              onMessageChange={(value) => {
                setMessageInput(value);
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 1000);
              }}
              onMessageSubmit={handleMessageSubmit}
              onChannelSelect={handleSelectChannel}
              messagesEndRef={messagesEndRef}
              defaultChannels={categories[0]?.channels}
            /> */}


              <CallPanel
                participants={participants}
                currentUserId="1"
                onToggleVideo={() => {}}
                onToggleAudio={() => {}}
                onShareScreen={() => {}}
                onLeaveCall={() => {}}
              />

            <UserSidebar users={users} showMemberList={showMemberList} />
          </div>
        </div>
      </div>

      <SearchOverlay
        isOpen={showSearch}a
        onClose={() => setShowSearch(false)}
        onSearch={(query) => {
          console.log('Searching for:', query);
        }}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleAddCategory}
        categoryName={newCategoryName}
        onCategoryNameChange={setNewCategoryName}
      />

      <ChannelModal
        isOpen={showChannelModal}
        onClose={() => setShowChannelModal(false)}
        onSubmit={handleAddChannel}
        channelData={newChannel}
        onChannelDataChange={setNewChannel}
      />
    </div>
  );
}