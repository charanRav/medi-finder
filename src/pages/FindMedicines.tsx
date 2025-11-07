
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, MapPin, Phone, Clock, Navigation, Star, ParkingSquare, Map, List } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SearchWithSuggestions from "@/components/SearchWithSuggestions";
import PharmacyMap from "@/components/PharmacyMap";
import { cities, getPharmaciesInRange, getMedicineStockForPharmacy } from "@/data/dummyData";
import type { PharmacyLocation } from "@/data/dummyData";

interface Medicine {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  manufacturer?: string;
}

const FindMedicines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRange, setSelectedRange] = useState(5);
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching medicines:', error);
    } else {
      setMedicines(data || []);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    try {
      const searchTermLower = searchTerm.toLowerCase();
      const { data: matchedMedicines, error } = await supabase
        .from('medicines')
        .select('*');

      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        return;
      }

      // Client-side fuzzy matching
      const filteredMedicines = matchedMedicines?.filter(medicine => {
        const name = medicine.name.toLowerCase();
        const category = medicine.category.toLowerCase();
        const desc = medicine.description?.toLowerCase() || '';
        
        return name.includes(searchTermLower) || 
               category.includes(searchTermLower) ||
               desc.includes(searchTermLower) ||
               name.startsWith(searchTermLower);
      }) || [];

      // Get pharmacies for selected city and range
      const pharmaciesInRange = getPharmaciesInRange(selectedCity, selectedRange);
      
      // Combine medicine data with pharmacy locations and stock info
      const results = filteredMedicines.map(medicine => {
        // Filter pharmacies that have this medicine in stock
        const availablePharmacies = pharmaciesInRange
          .map(pharmacy => {
            const stock = getMedicineStockForPharmacy(pharmacy.id, medicine.id);
            return {
              ...pharmacy,
              ...stock,
            };
          })
          .filter(p => p.inStock)
          .sort((a, b) => a.distance - b.distance);

        return {
          medicine,
          availableAt: availablePharmacies,
          totalPharmacies: availablePharmacies.length,
        };
      }).filter(result => result.availableAt.length > 0); // Only show medicines available somewhere

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicineSelect = (medicine: Medicine) => {
    setSearchTerm(medicine.name);
    setTimeout(() => handleSearch(), 100);
  };

  const rangeOptions = [1, 2, 5, 10, 15, 20];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Find Medicines</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Search for Medicines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Medicine Search with Autocomplete */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Medicine Name</label>
              <div className="flex space-x-2">
                <SearchWithSuggestions
                  placeholder="Enter medicine name (e.g., Paracetamol, Crocin)"
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onSelect={handleMedicineSelect}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* City Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select City</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {city.name}, {city.state}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Range Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Range</label>
              <div className="flex flex-wrap gap-2">
                {rangeOptions.map((range) => (
                  <Button
                    key={range}
                    variant={selectedRange === range ? "default" : "outline"}
                    onClick={() => setSelectedRange(range)}
                    size="sm"
                  >
                    {range} km
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Selected range: {selectedRange} km - Shows approximately {getPharmaciesInRange(selectedCity, selectedRange).length} pharmacies in {cities.find(c => c.id === selectedCity)?.name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results ({searchResults.length} medicine{searchResults.length !== 1 ? 's' : ''} found in {cities.find(c => c.id === selectedCity)?.name})
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-2" />
                  List View
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map View
                </Button>
              </div>
            </div>

            {viewMode === 'map' ? (
              <div className="h-[600px] w-full rounded-lg overflow-hidden border">
                {searchResults.length > 0 && searchResults[0].availableAt.length > 0 && (
                  <PharmacyMap
                    pharmacies={searchResults.flatMap(result =>
                      result.availableAt.map((pharmacy: any) => ({
                        ...pharmacy,
                        medicineName: result.medicine.name,
                      }))
                    )}
                    cityCoords={cities.find(c => c.id === selectedCity)?.coords || { lat: 0, lng: 0 }}
                  />
                )}
              </div>
            ) : (
              <>
                {searchResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-blue-700">
                            {result.medicine.name}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary">{result.medicine.category}</Badge>
                            {result.medicine.manufacturer && (
                              <span className="text-sm text-gray-500">
                                by {result.medicine.manufacturer}
                              </span>
                            )}
                          </div>
                          {result.medicine.description && (
                            <p className="text-sm text-gray-600 mt-2">{result.medicine.description}</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">
                          Available at {result.totalPharmacies} {result.totalPharmacies === 1 ? 'pharmacy' : 'pharmacies'} within {selectedRange} km:
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {result.availableAt.slice(0, 8).map((pharmacy: PharmacyLocation & { inStock: boolean; quantity: number; price: number }) => (
                            <div key={pharmacy.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-medium text-gray-800 flex-1">{pharmacy.name}</h5>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  <Navigation className="w-3 h-3 mr-1" />
                                  {pharmacy.distance} km
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3 flex items-start">
                                <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                <span>{pharmacy.address}</span>
                              </p>
                              
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-700 border-green-300">
                                      In Stock: {pharmacy.quantity} units
                                    </Badge>
                                    <span className="font-semibold text-blue-600">₹{pharmacy.price}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {pharmacy.openingHours}
                                  </div>
                                  {pharmacy.hasParking && (
                                    <div className="flex items-center">
                                      <ParkingSquare className="w-3 h-3 mr-1" />
                                      Parking
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{pharmacy.rating}</span>
                                  <span className="text-xs text-gray-500">/5.0</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Phone className="w-3 h-3 mr-1" />
                                  Call
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
                                    window.open(url, '_blank');
                                  }}
                                >
                                  <Navigation className="w-3 h-3 mr-1" />
                                  Directions
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {result.availableAt.length > 8 && (
                          <p className="text-sm text-gray-500 text-center">
                            +{result.availableAt.length - 8} more {result.availableAt.length - 8 === 1 ? 'pharmacy' : 'pharmacies'} available
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}

        {/* No Results */}
        {searchResults.length === 0 && searchTerm && !isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No medicines found for "{searchTerm}". Please try a different search term.</p>
            </CardContent>
          </Card>
        )}

        {/* Popular Medicines */}
        {!searchTerm && medicines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Popular Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {medicines.slice(0, 8).map((medicine) => (
                  <Button
                    key={medicine.id}
                    variant="outline"
                    onClick={() => setSearchTerm(medicine.name)}
                    className="h-auto p-4 text-left"
                  >
                    <div>
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{medicine.category}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindMedicines;
