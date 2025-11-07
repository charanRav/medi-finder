import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Medicine {
  id: string;
  name: string;
  category: string;
}

interface InventoryItem {
  id: string;
  medicine_id: string;
  in_stock: boolean;
  quantity: number;
  medicines: Medicine;
}

interface DeleteInventoryDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
  isDeleting: boolean;
}

const DeleteInventoryDialog: React.FC<DeleteInventoryDialogProps> = ({
  item,
  open,
  onOpenChange,
  onConfirm,
  isDeleting
}) => {
  const handleConfirm = async () => {
    if (!item) return;
    await onConfirm(item.id);
  };

  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from Inventory?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{item.medicines.name}</strong> from your inventory? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInventoryDialog;
