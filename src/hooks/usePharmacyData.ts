
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

interface Pharmacy {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
}

export const usePharmacyData = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initializeData = async () => {
    if (!user) {
      navigate('/pharmacy-login');
      return;
    }

    try {
      setLoading(true);
      console.log('Initializing pharmacy dashboard data...');
      
      // Fetch pharmacy data and medicines in parallel
      const [pharmacyResponse, medicinesResponse] = await Promise.all([
        supabase
          .from('pharmacies')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('medicines')
          .select('*')
          .order('name')
      ]);

      if (pharmacyResponse.error) {
        console.error('Error fetching pharmacy:', pharmacyResponse.error);
        toast({
          title: "Error",
          description: "Failed to fetch pharmacy data",
          variant: "destructive",
        });
        return;
      }

      if (medicinesResponse.error) {
        console.error('Error fetching medicines:', medicinesResponse.error);
        toast({
          title: "Error", 
          description: "Failed to fetch medicines data",
          variant: "destructive",
        });
        return;
      }

      setPharmacy(pharmacyResponse.data);
      setMedicines(medicinesResponse.data || []);
      
      // Fetch inventory after we have pharmacy data
      if (pharmacyResponse.data?.id) {
        const inventoryResponse = await supabase
          .from('inventory')
          .select(`
            *,
            medicines (
              id,
              name,
              category
            )
          `)
          .eq('pharmacy_id', pharmacyResponse.data.id);

        if (inventoryResponse.error) {
          console.error('Error fetching inventory:', inventoryResponse.error);
          toast({
            title: "Error",
            description: "Failed to fetch inventory",
            variant: "destructive",
          });
        } else {
          setInventory(inventoryResponse.data || []);
        }
      }

      setDataLoaded(true);
      console.log('Dashboard data loaded successfully');
      
    } catch (err) {
      console.error('Exception during data initialization:', err);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStock = async (inventoryId: string, currentStock: boolean) => {
    if (isUpdating === inventoryId) return;
    
    try {
      setIsUpdating(inventoryId);
      console.log(`Toggling stock for inventory ${inventoryId} from ${currentStock} to ${!currentStock}`);
      
      const { error } = await supabase
        .from('inventory')
        .update({ in_stock: !currentStock })
        .eq('id', inventoryId);
      
      if (error) {
        console.error('Error updating stock:', error);
        toast({
          title: "Error",
          description: "Failed to update stock status",
          variant: "destructive",
        });
      } else {
        setInventory(prev => prev.map(item => 
          item.id === inventoryId ? { ...item, in_stock: !currentStock } : item
        ));
        toast({
          title: "Success",
          description: `Medicine marked as ${!currentStock ? 'in stock' : 'out of stock'}`,
        });
      }
    } catch (err) {
      console.error('Exception updating stock:', err);
      toast({
        title: "Error",
        description: "Failed to update stock status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const updateQuantity = async (inventoryId: string, newQuantity: number) => {
    if (newQuantity < 0 || isUpdating === inventoryId) return;
    
    try {
      setIsUpdating(inventoryId);
      console.log(`Updating quantity for inventory ${inventoryId} to ${newQuantity}`);
      
      const { error } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', inventoryId);
      
      if (error) {
        console.error('Error updating quantity:', error);
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive",
        });
      } else {
        setInventory(prev => prev.map(item => 
          item.id === inventoryId ? { ...item, quantity: newQuantity } : item
        ));
        toast({
          title: "Success",
          description: "Quantity updated successfully",
        });
      }
    } catch (err) {
      console.error('Exception updating quantity:', err);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const addMedicineToInventory = async (medicineId: string) => {
    if (!pharmacy?.id) return;
    
    try {
      console.log(`Adding medicine ${medicineId} to inventory`);
      
      // Check if medicine already exists in inventory
      const existingItem = inventory.find(item => item.medicine_id === medicineId);
      if (existingItem) {
        toast({
          title: "Already in inventory",
          description: "This medicine is already in your inventory",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('inventory')
        .insert({
          pharmacy_id: pharmacy.id,
          medicine_id: medicineId,
          in_stock: true,
          quantity: 10
        });
      
      if (error) {
        console.error('Error adding medicine:', error);
        toast({
          title: "Error",
          description: "Failed to add medicine to inventory",
          variant: "destructive",
        });
      } else {
        // Refresh inventory data
        const inventoryResponse = await supabase
          .from('inventory')
          .select(`
            *,
            medicines (
              id,
              name,
              category
            )
          `)
          .eq('pharmacy_id', pharmacy.id);

        if (inventoryResponse.data) {
          setInventory(inventoryResponse.data);
        }
        
        toast({
          title: "Success",
          description: "Medicine added to inventory",
        });
      }
    } catch (err) {
      console.error('Exception adding medicine:', err);
      toast({
        title: "Error",
        description: "Failed to add medicine to inventory",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    initializeData();
  }, [user]);

  return {
    inventory,
    pharmacy,
    medicines,
    loading,
    isUpdating,
    dataLoaded,
    initializeData,
    toggleStock,
    updateQuantity,
    addMedicineToInventory
  };
};
