import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

interface EditInventoryDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, quantity: number, inStock: boolean) => Promise<void>;
}

const EditInventoryDialog: React.FC<EditInventoryDialogProps> = ({
  item,
  open,
  onOpenChange,
  onSave
}) => {
  const [quantity, setQuantity] = useState(item?.quantity || 0);
  const [inStock, setInStock] = useState(item?.in_stock || false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      setInStock(item.in_stock);
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;
    
    try {
      setSaving(true);
      await onSave(item.id, quantity, inStock);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Update stock details for {item.medicines.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="in-stock" className="text-right">
              In Stock
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="in-stock"
                checked={inStock}
                onCheckedChange={setInStock}
              />
              <span className="ml-2 text-sm text-muted-foreground">
                {inStock ? "Available" : "Out of stock"}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryDialog;
