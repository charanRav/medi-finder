import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Medicine {
  id: string;
  name: string;
  category: string;
}

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicines: Medicine[];
  inventoryMedicineIds: string[];
  onAddMedicine: (medicineId: string) => void;
}

const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({
  open,
  onOpenChange,
  medicines,
  inventoryMedicineIds,
  onAddMedicine
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'fever', name: 'Fever & Pain' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'bp', name: 'Blood Pressure' },
    { id: 'heart', name: 'Heart' },
    { id: 'cough', name: 'Cough & Cold' },
    { id: 'antibiotics', name: 'Antibiotics' },
    { id: 'vitamins', name: 'Vitamins' },
    { id: 'digestive', name: 'Digestive' },
    { id: 'skincare', name: 'Skin Care' },
  ];

  const availableMedicines = medicines.filter(
    medicine => !inventoryMedicineIds.includes(medicine.id)
  );

  const filteredMedicines = availableMedicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (medicineId: string) => {
    onAddMedicine(medicineId);
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Medicine to Inventory</DialogTitle>
          <DialogDescription>
            Search and add medicines to your pharmacy inventory
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Medicine List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {filteredMedicines.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {availableMedicines.length === 0 
                    ? "All medicines have been added to inventory"
                    : "No medicines found matching your criteria"}
                </div>
              ) : (
                filteredMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{medicine.name}</h4>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {categories.find(c => c.id === medicine.category)?.name || medicine.category}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(medicine.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryDialog;
