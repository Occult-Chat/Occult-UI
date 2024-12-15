import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { StatusIndicator } from './StatusIndicator';
import { Message } from '@/types';


export const MessageList = ({
  messages,
  messagesEndRef
}: {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) => (
  <ScrollArea className="flex-1 px-4 py-2">
    <div className="space-y-4">
      {messages.map(message => (
        <div 
          key={message.id} 
          className={cn(
            "flex",
            message.isSystem && "justify-center"
          )}
        >
          {!message.isSystem && (
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0" />
              <StatusIndicator status="online" />
            </div>
          )}
          <div className={cn(
            "ml-3",
            message.isSystem && "ml-0 text-center text-zinc-500 text-sm"
          )}>
            {!message.isSystem && (
              <div className="flex items-center">
                <span className="font-semibold">{message.author}</span>
                <span className="ml-2 text-xs text-zinc-500">{message.timestamp}</span>
              </div>
            )}
            <p className={cn(
              "text-zinc-300",
              message.isSystem && "text-zinc-500"
            )}>{message.content}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  </ScrollArea>
);
