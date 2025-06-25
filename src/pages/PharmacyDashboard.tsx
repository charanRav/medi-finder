
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Package, 
  Search, 
  Settings, 
  LogOut, 
  Plus,
  Edit,
  Minus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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

interface Pharmacy {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
}

const PharmacyDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All Medicines' },
    { id: 'fever', name: 'Fever & Pain' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'bp', name: 'Blood Pressure' },
    { id: 'heart', name: 'Heart' },
    { id: 'cough', name: 'Cough & Cold' },
    { id: 'antibiotics', name: 'Antibiotics' },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/pharmacy-login');
      return;
    }
    
    fetchPharmacyData();
    fetchMedicines();
  }, [user, navigate]);

  useEffect(() => {
    if (pharmacy?.id) {
      fetchInventory();
    }
  }, [pharmacy?.id]);

  const fetchPharmacyData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching pharmacy:', error);
        toast({
          title: "Error",
          description: "Failed to fetch pharmacy data",
          variant: "destructive",
        });
      } else {
        setPharmacy(data);
      }
    } catch (err) {
      console.error('Exception fetching pharmacy:', err);
    }
  };

  const fetchInventory = async () => {
    if (!pharmacy?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pharmacy_inventory')
        .select(`
          *,
          medicines (
            id,
            name,
            category
          )
        `)
        .eq('pharmacy_id', pharmacy.id);
      
      if (error) {
        console.error('Error fetching inventory:', error);
        toast({
          title: "Error",
          description: "Failed to fetch inventory",
          variant: "destructive",
        });
      } else {
        setInventory(data || []);
      }
    } catch (err) {
      console.error('Exception fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching medicines:', error);
      } else {
        setMedicines(data || []);
      }
    } catch (err) {
      console.error('Exception fetching medicines:', err);
    }
  };

  const toggleStock = async (inventoryId: string, currentStock: boolean) => {
    if (isUpdating === inventoryId) return;
    
    try {
      setIsUpdating(inventoryId);
      const { error } = await supabase
        .from('pharmacy_inventory')
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
        setInventory(inventory.map(item => 
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
      const { error } = await supabase
        .from('pharmacy_inventory')
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
        setInventory(inventory.map(item => 
          item.id === inventoryId ? { ...item, quantity: newQuantity } : item
        ));
        toast({
          title: "Success",
          description: "Quantity updated successfully",
        });
      }
    } catch (err) {
      console.error('Exception updating quantity:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const addMedicineToInventory = async (medicineId: string) => {
    if (!pharmacy?.id) return;
    
    try {
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
        .from('pharmacy_inventory')
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
        await fetchInventory();
        toast({
          title: "Success",
          description: "Medicine added to inventory",
        });
      }
    } catch (err) {
      console.error('Exception adding medicine:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.medicines.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.medicines.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const inventoryMedicineIds = inventory.map(item => item.medicine_id);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading dashboard...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{pharmacy?.name || 'Pharmacy Dashboard'}</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">
              <Package className="w-4 h-4 mr-2" />
              Inventory Management
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Shield className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
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
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating === item.id || item.quantity <= 0}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                          onClick={() => toggleStock(item.id, item.in_stock)}
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
                  onAddMedicine={addMedicineToInventory}
                  inventoryMedicineIds={inventoryMedicineIds}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Profile</CardTitle>
                <p className="text-gray-600">Update your pharmacy information</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                    <Input id="pharmacyName" defaultValue={pharmacy?.name || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" defaultValue={pharmacy?.owner_name || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={pharmacy?.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={pharmacy?.email || ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={pharmacy?.address || ''} />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <p className="text-gray-600">Customer orders and requests (Coming Soon)</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Orders Feature Coming Soon</h3>
                  <p className="text-gray-500">You'll be able to manage customer orders and medicine requests here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
