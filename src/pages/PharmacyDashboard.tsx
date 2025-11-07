
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Settings, 
  ShoppingCart,
  MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { usePharmacyData } from "@/hooks/usePharmacyData";
import PharmacyHeader from "@/components/pharmacy/PharmacyHeader";
import InventoryManagement from "@/components/pharmacy/InventoryManagement";
import ProfileSettings from "@/components/pharmacy/ProfileSettings";
import OrdersManagement from "@/components/pharmacy/OrdersManagement";
import LocationSettings from "@/components/pharmacy/LocationSettings";

const PharmacyDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const {
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
  } = usePharmacyData();

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dataLoaded || !pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load pharmacy data. Please try refreshing the page.</p>
          <Button 
            onClick={initializeData} 
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <PharmacyHeader pharmacy={pharmacy} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory">
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="location">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <InventoryManagement
              inventory={inventory}
              medicines={medicines}
              isUpdating={isUpdating}
              onToggleStock={toggleStock}
              onUpdateQuantity={updateQuantity}
              onAddMedicine={addMedicineToInventory}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="location">
            <LocationSettings pharmacy={pharmacy} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings pharmacy={pharmacy} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
