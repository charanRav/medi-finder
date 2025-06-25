
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SearchWithSuggestions from "@/components/SearchWithSuggestions";

// Mock pharmacy locations for realistic range simulation
const mockPharmacyLocations = [
  { id: 1, distance: 0.5, name: "City Medical Store", address: "Main Street, Downtown" },
  { id: 2, distance: 1.2, name: "Health Plus Pharmacy", address: "Park Avenue, Central" },
  { id: 3, distance: 1.8, name: "Care Pharmacy", address: "Mall Road, Sector 15" },
  { id: 4, distance: 2.3, name: "MediCare Center", address: "Hospital Road, Medical District" },
  { id: 5, distance: 2.7, name: "Wellness Pharmacy", address: "Shopping Complex, Phase 2" },
  { id: 6, distance: 3.1, name: "Quick Heal Medicines", address: "Metro Station, Line 1" },
  { id: 7, distance: 3.8, name: "Life Care Pharmacy", address: "Residential Area, Block A" },
  { id: 8, distance: 4.2, name: "Healing Touch", address: "Commercial Street, Zone 3" },
  { id: 9, distance: 4.9, name: "Medicine World", address: "Tech Park, IT Corridor" },
  { id: 10, distance: 5.5, name: "Pharma Plus", address: "University Area, Student Zone" },
  { id: 11, distance: 6.2, name: "Health Hub", address: "Industrial Area, Sector 8" },
  { id: 12, distance: 7.1, name: "Medical Corner", address: "Old City, Heritage Lane" },
  { id: 13, distance: 7.8, name: "Remedy Pharmacy", address: "New Town, Development Area" },
  { id: 14, distance: 8.4, name: "Cure All Medicines", address: "Airport Road, Terminal 2" },
  { id: 15, distance: 9.2, name: "Health Station", address: "Highway Plaza, Mile 15" },
  { id: 16, distance: 9.8, name: "Medicine Express", address: "Suburb Area, Green Valley" }
];

interface Medicine {
  id: string;
  name: string;
  category: string;
  aliases?: string[];
}

const FindMedicines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRange, setSelectedRange] = useState(5);
  const [location, setLocation] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
    fetchPharmacies();
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

  const fetchPharmacies = async () => {
    const { data, error } = await supabase
      .from('pharmacies')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching pharmacies:', error);
    } else {
      setPharmacies(data || []);
    }
  };

  const getPharmaciesByRange = (rangeKm) => {
    return mockPharmacyLocations.filter(pharmacy => pharmacy.distance <= rangeKm);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Enhanced search with better matching
      const searchTermLower = searchTerm.toLowerCase();
      const { data: matchedMedicines, error } = await supabase
        .from('medicines')
        .select('*');

      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        return;
      }

      // Client-side fuzzy matching for better results
      const filteredMedicines = matchedMedicines?.filter(medicine => {
        const name = medicine.name.toLowerCase();
        const aliases = medicine.aliases?.map(alias => alias.toLowerCase()) || [];
        
        return name.includes(searchTermLower) || 
               aliases.some(alias => alias.includes(searchTermLower)) ||
               name.startsWith(searchTermLower) ||
               aliases.some(alias => alias.startsWith(searchTermLower));
      }) || [];

      // Get pharmacies within selected range
      const pharmaciesInRange = getPharmaciesByRange(selectedRange);
      
      // Combine real medicine data with mock pharmacy locations for realistic results
      const results = filteredMedicines?.map(medicine => ({
        medicine,
        availableAt: pharmaciesInRange.slice(0, Math.min(pharmaciesInRange.length, Math.floor(Math.random() * pharmaciesInRange.length) + 1)),
      })) || [];

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
    handleSearch();
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Current Location (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`);
        },
        (error) => {
          console.error('Location error:', error);
          alert('Unable to detect location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
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

            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Location</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your location or use GPS"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleLocationDetect} variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Detect
                </Button>
              </div>
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
                Selected range: {selectedRange} km - Shows approximately {getPharmaciesByRange(selectedRange).length} pharmacies
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Search Results ({searchResults.length} medicine{searchResults.length !== 1 ? 's' : ''} found)
            </h2>
            
            {searchResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-700">
                        {result.medicine.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{result.medicine.category}</Badge>
                        {result.medicine.aliases && result.medicine.aliases.length > 0 && (
                          <span className="text-sm text-gray-500">
                            Also known as: {result.medicine.aliases.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">
                      Available at {result.availableAt.length} pharmacies within {selectedRange} km:
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.availableAt.map((pharmacy) => (
                        <div key={pharmacy.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-800">{pharmacy.name}</h5>
                            <Badge variant="outline" className="ml-2">
                              <Navigation className="w-3 h-3 mr-1" />
                              {pharmacy.distance} km
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {pharmacy.address}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Badge variant="default" className="bg-green-100 text-green-700">
                                In Stock
                              </Badge>
                              <span className="text-sm text-gray-500">
                                <Clock className="w-3 h-3 inline mr-1" />
                                Open till 10 PM
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
