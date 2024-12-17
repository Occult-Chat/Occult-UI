import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-4 rounded-lg w-1/2">
        <Input
          autoFocus
          placeholder="Search..."
          className="bg-zinc-800 border-zinc-700"
          onChange={(e) => onSearch?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        />
      </div>
    </div>
  );
};

export default SearchOverlay;