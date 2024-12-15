import { cn } from '@/lib/utils';

export const StatusIndicator = ({ status }: { status: string }) => (
  <div className={cn(
    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950",
    status === 'online' && "bg-green-500",
    status === 'idle' && "bg-yellow-500",
    status === 'dnd' && "bg-red-500",
    status === 'offline' && "bg-zinc-500"
  )} />
);
