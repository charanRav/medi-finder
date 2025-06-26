
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Minus } from "lucide-react";
import CategoryCarousel from "@/components/CategoryCarousel";

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

interface InventoryManagementProps {
  inventory: InventoryItem[];
  medicines: Medicine[];
  isUpdating: string | null;
  onToggleStock: (inventoryId: string, currentStock: boolean) => void;
  onUpdateQuantity: (inventoryId: string, newQuantity: number) => void;
  onAddMedicine: (medicineId: string) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  inventory,
  medicines,
  isUpdating,
  onToggleStock,
  onUpdateQuantity,
  onAddMedicine
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Medicines' },
    { id: 'fever', name: 'Fever & Pain' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'bp', name: 'Blood Pressure' },
    { id: 'heart', name: 'Heart' },
    { id: 'cough', name: 'Cough & Cold' },
    { id: 'antibiotics', name: 'Antibiotics' },
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.medicines.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.medicines.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const inventoryMedicineIds = inventory.map(item => item.medicine_id);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <p className="text-gray-600">Manage your medicine stock and availability</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Current Stock ({filteredInventory.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.medicines.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isUpdating === item.id || item.quantity <= 0}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating === item.id}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={item.in_stock ? "default" : "secondary"}>
                    {item.in_stock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleStock(item.id, item.in_stock)}
                    disabled={isUpdating === item.id}
                    className={item.in_stock ? "border-red-600 text-red-600 hover:bg-red-50" : "border-green-600 text-green-600 hover:bg-green-50"}
                  >
                    {isUpdating === item.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      item.in_stock ? "Mark Out of Stock" : "Mark In Stock"
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredInventory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No medicines found matching your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category-wise Medicine Carousels */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Browse by Category</h3>
        {categories.slice(1).map((category) => (
          <CategoryCarousel
            key={category.id}
            category={category}
            medicines={medicines}
            onAddMedicine={onAddMedicine}
            inventoryMedicineIds={inventoryMedicineIds}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
