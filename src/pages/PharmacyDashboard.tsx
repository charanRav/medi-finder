
import React, { useState } from 'react';
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
  Trash2,
  Edit
} from "lucide-react";

const PharmacyDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Paracetamol 500mg', category: 'fever', inStock: true, quantity: 50 },
    { id: 2, name: 'Aspirin 75mg', category: 'heart', inStock: true, quantity: 30 },
    { id: 3, name: 'Crocin 650mg', category: 'fever', inStock: false, quantity: 0 },
    { id: 4, name: 'Metformin 500mg', category: 'diabetes', inStock: true, quantity: 25 },
  ]);

  const categories = [
    { id: 'all', name: 'All Medicines' },
    { id: 'fever', name: 'Fever & Pain' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'bp', name: 'Blood Pressure' },
    { id: 'heart', name: 'Heart' },
    { id: 'cough', name: 'Cough & Cold' },
    { id: 'antibiotics', name: 'Antibiotics' },
  ];

  const masterMedicines = [
    'Paracetamol 500mg', 'Paracetamol 650mg', 'Aspirin 75mg', 'Aspirin 325mg',
    'Crocin 500mg', 'Crocin 650mg', 'Dolo 650mg', 'Combiflam',
    'Metformin 500mg', 'Metformin 850mg', 'Glimepiride 1mg', 'Glimepiride 2mg',
    'Amlodipine 5mg', 'Amlodipine 10mg', 'Atenolol 50mg', 'Atenolol 25mg',
    'Azithromycin 250mg', 'Azithromycin 500mg', 'Amoxicillin 250mg', 'Amoxicillin 500mg'
  ];

  const toggleStock = (id) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    ));
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <h1 className="text-2xl font-bold text-gray-800">HealthPlus Pharmacy</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
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
                  <div className="flex-1">
                    <Input
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
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
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={item.inStock ? "default" : "secondary"}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStock(item.id)}
                          className={item.inStock ? "border-red-600 text-red-600 hover:bg-red-50" : "border-green-600 text-green-600 hover:bg-green-50"}
                        >
                          {item.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Medicines */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Add Popular Medicines</CardTitle>
                <p className="text-gray-600">Select from our master database</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {masterMedicines.slice(0, 8).map((medicine, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-3 hover:bg-green-50 hover:border-green-600"
                    >
                      <Plus className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">{medicine}</span>
                    </Button>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  View All Medicines in Database
                </Button>
              </CardContent>
            </Card>
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
                    <Input id="pharmacyName" defaultValue="HealthPlus Pharmacy" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" defaultValue="Dr. John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="healthplus@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Main Street, City Center" />
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
