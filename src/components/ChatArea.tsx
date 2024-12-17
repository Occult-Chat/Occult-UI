import React from 'react';
import { Users, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { ChannelIcon } from '@/components/ui/ChannelIcon';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'gallery' | 'forum' | 'documentation';
}

interface ChatAreaProps {
  selectedChannel?: Channel;
  messages: Message[];
  messageInput: string;
  isTyping: boolean;
  showMemberList: boolean;
  onToggleMemberList: () => void;
  onMessageChange: (value: string) => void;
  onMessageSubmit: (e: React.FormEvent) => void;
  onChannelSelect: (channel: Channel) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  defaultChannels?: Channel[];
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChannel,
  messages,
  messageInput,
  isTyping,
  showMemberList,
  onToggleMemberList,
  onMessageChange,
  onMessageSubmit,
  onChannelSelect,
  messagesEndRef,
  defaultChannels = []
}) => {
  if (!selectedChannel) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 bg-black">
        <div className="text-center space-y-4">
          <Hash size={48} className="mx-auto text-zinc-600" />
          <h2 className="text-xl font-semibold text-zinc-300">
            Welcome to MessageHub
          </h2>
          <p className="text-sm">Select a channel to start messaging</p>
          <div className="flex justify-center space-x-2">
            {defaultChannels.slice(0, 3).map((channel) => (
              <Button
                key={channel.id}
                variant="outline"
                className="gap-2"
                onClick={() => onChannelSelect(channel)}
              >
                <ChannelIcon type={channel.type} />
                {channel.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black">
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center">
          <ChannelIcon type={selectedChannel.type} />
          <span className="font-semibold text-zinc-100">
            {selectedChannel.name}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-zinc-400">
          <button
            onClick={onToggleMemberList}
            className={cn(
              "hover:text-zinc-200 transition-colors",
              showMemberList && "text-blue-400"
            )}
          >
            <Users size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <div className="p-4 border-t border-zinc-800">
        <MessageInput
          messageInput={messageInput}
          isTyping={isTyping}
          channelName={selectedChannel.name}
          onMessageChange={onMessageChange}
          onSubmit={onMessageSubmit}
        />
      </div>
    </div>
  );
};

export default ChatArea;