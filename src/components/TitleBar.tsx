import { Minus, Square, X } from 'lucide-react';

export const TitleBar = ({ 
  onMinimize, 
  onMaximize, 
  onClose 
}: { 
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}) => (
  <div className="h-7 min-h-[28px] bg-zinc-950 flex items-center justify-between border-b border-zinc-800" data-tauri-drag-region>
    <div className="flex items-center h-full px-3" data-tauri-drag-region>
      <span className="text-sm font-semibold text-zinc-400">MessageHub</span>
    </div>
    <div className="flex h-full">
      <button 
        onClick={onMinimize}
        className="h-full w-11 inline-flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <Minus size={16} />
      </button>
      <button 
        onClick={onMaximize}
        className="h-full w-11 inline-flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <Square size={14} />
      </button>
      <button 
        onClick={onClose}
        className="h-full w-11 inline-flex items-center justify-center hover:bg-red-500 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  </div>
);