import { PlusCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MessageInput = ({
  messageInput,
  isTyping,
  channelName,
  onMessageChange,
  onSubmit
}: {
  messageInput: string;
  isTyping: boolean;
  channelName: string;
  onMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <form onSubmit={onSubmit} className="p-3 border-t border-zinc-800">
    <div className="flex items-center space-x-2">
      <button 
        type="button"
        className="text-zinc-400 hover:text-blue-400 transition-colors"
      >
        <PlusCircle size={20} />
      </button>
      <div className="flex-1 relative">
        <Input
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={`Message #${channelName}`}
          className="flex-1 bg-zinc-900 border-zinc-700 focus:border-blue-500 h-9"
        />
        {isTyping && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-xs text-zinc-400">typing...</span>
          </div>
        )}
      </div>
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className={cn(
          "h-9 w-9 transition-colors",
          messageInput.trim() 
            ? "text-blue-500 hover:text-blue-400" 
            : "text-zinc-500"
        )}
        disabled={!messageInput.trim()}
      >
        <Send size={18} />
      </Button>
    </div>
  </form>
);