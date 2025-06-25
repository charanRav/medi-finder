
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Plus } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  category: string;
}

interface CategoryCarouselProps {
  category: {
    id: string;
    name: string;
  };
  medicines: Medicine[];
  onAddMedicine: (medicineId: string) => void;
  inventoryMedicineIds: string[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  category, 
  medicines, 
  onAddMedicine, 
  inventoryMedicineIds 
}) => {
  const categoryMedicines = medicines.filter(medicine => 
    medicine.category === category.id
  );

  if (categoryMedicines.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{category.name}</span>
          <Badge variant="secondary">{categoryMedicines.length} medicines</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {categoryMedicines.map((medicine) => {
              const isInInventory = inventoryMedicineIds.includes(medicine.id);
              return (
                <CarouselItem key={medicine.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm leading-tight">{medicine.name}</h4>
                        <div className="flex items-center justify-between">
                          {isInInventory ? (
                            <Badge variant="default" className="text-xs">
                              In Inventory
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 px-2 text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => onAddMedicine(medicine.id)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default CategoryCarousel;
