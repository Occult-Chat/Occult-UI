import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

export function TitleBar() {
  const [appWindow, setAppWindow] = useState<any>(null);

  useEffect(() => {
    const initTauri = async () => {
      try {
        const { getCurrent } = await import("@tauri-apps/api/window");
        const windowInstance = getCurrent();
        console.log("Window instance initialized:", windowInstance);
        setAppWindow(windowInstance);
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
}