import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type ChannelType = 'text' | 'voice' | 'gallery' | 'forum' | 'documentation';

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  channelData: {
    name: string;
    type: ChannelType;
  };
  onChannelDataChange: (data: { name: string; type: ChannelType }) => void;
}

const ChannelModal: React.FC<ChannelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  channelData,
  onChannelDataChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            value={channelData.name}
            onChange={(e) => 
              onChannelDataChange({ ...channelData, name: e.target.value })
            }
            placeholder="Channel name"
            className="bg-zinc-800 border-zinc-700"
          />
          
          <Select
            value={channelData.type}
            onValueChange={(value: ChannelType) =>
              onChannelDataChange({ ...channelData, type: value })
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Channel type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="text">Text Channel</SelectItem>
              <SelectItem value="voice">Voice Channel</SelectItem>
              <SelectItem value="gallery">Gallery Channel</SelectItem>
              <SelectItem value="forum">Forum Channel</SelectItem>
              <SelectItem value="documentation">Documentation Channel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelModal;