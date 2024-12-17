import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  categoryName: string;
  onCategoryNameChange: (value: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  onCategoryNameChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <Input
          value={categoryName}
          onChange={(e) => onCategoryNameChange(e.target.value)}
          placeholder="Category name"
          className="bg-zinc-800 border-zinc-700"
        />
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

export default CategoryModal;