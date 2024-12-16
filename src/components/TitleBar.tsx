import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentWindow } from '@tauri-apps/api/window';
export function TitleBar() {
  const [appWindow, setAppWindow] = useState<any>(null);

  useEffect(() => {
    const initTauri = async () => {
      try {
        const appWindow = getCurrentWindow();
        console.log("Window instance initialized:", appWindow);
        setAppWindow(appWindow);
      } catch (error) {
        console.error("Failed to initialize Tauri:", error);
      }
    };
  
    initTauri();
  }, []);
  

  const onMinimize = async () => {
    try {
      console.log("minimize");
      await appWindow?.minimize();
    } catch (error) {
      console.error("Failed to minimize window:", error);
    }
  };

  const onMaximize = async () => {
    try {
      await appWindow?.toggleMaximize();
    } catch (error) {
      console.error("Failed to maximize window:", error);
    }
  };

  const onClose = async () => {
    try {
      await appWindow?.close();
    } catch (error) {
      console.error("Failed to close window:", error);
    }
  };

  return (
    <div
      className="h-7 min-h-[28px] bg-zinc-950 flex items-center justify-between border-b border-zinc-800 drag-region"
      data-tauri-drag
    >
      <div className="flex items-center h-full px-3">
        <span className="text-sm font-semibold text-zinc-400">MessageHub</span>
      </div>
      <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={onMinimize}
          className="h-full w-11 inline-flex items-center justify-center hover:bg-zinc-800 transition-colors"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <Minus size={16} />
        </button>
        <button
          onClick={onMaximize}
          className="h-full w-11 inline-flex items-center justify-center hover:bg-zinc-800 transition-colors"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <Square size={14} />
        </button>
        <button
          onClick={onClose}
          className="h-full w-11 inline-flex items-center justify-center hover:bg-red-500 transition-colors"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}