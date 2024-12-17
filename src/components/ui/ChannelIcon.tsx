import React from 'react';
import { Hash, Mic, Image, MessageSquare, Book } from 'lucide-react';

type ChannelType = 'text' | 'voice' | 'gallery' | 'forum' | 'documentation';

interface ChannelIconProps {
  type: ChannelType;
}

export const ChannelIcon: React.FC<ChannelIconProps> = ({ type }) => {
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

export default ChannelIcon;