
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Phone, Navigation, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FindMedicines = () => {
  const [location, setLocation] = useState('');
  const [medicine, setMedicine] = useState('');
  const [radius, setRadius] = useState(5);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const radiusOptions = [2, 3, 5, 10, 15];

  const samplePharmacies = [
    {
      id: 1,
      name: "HealthPlus Pharmacy",
      address: "123 Main Street, City Center",
      distance: "0.8 km",
      phone: "+91 98765 43210",
      available: true,
      rating: 4.5
    },
    {
      id: 2,
      name: "MediCare Store",
      address: "456 Park Avenue, Downtown",
      distance: "1.2 km",
      phone: "+91 98765 43211",
      available: true,
      rating: 4.3
    },
    {
      id: 3,
      name: "City Chemist",
      address: "789 Commercial Street, Business District",
      distance: "2.1 km",
      phone: "+91 98765 43212",
      available: false,
      rating: 4.1
    }
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = () => {
    if (!location || !medicine) {
      alert('Please enter both location and medicine name');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(samplePharmacies);
      setIsLoading(false);
    }, 1500);
  };

  const handleDirections = (pharmacy) => {
    const query = encodeURIComponent(pharmacy.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Find Medicines</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Search for Medicines Near You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Location</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter city, state, or pincode"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleGetLocation} variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
              </div>
            </div>

            {/* Medicine Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Medicine Name</label>
              <Input
                placeholder="e.g., Paracetamol, Crocin, Aspirin..."
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
              />
            </div>

            {/* Radius Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Search Radius</label>
              <div className="flex space-x-2">
                {radiusOptions.map((r) => (
                  <Button
                    key={r}
                    variant={radius === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRadius(r)}
                    className={radius === r ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {r} km
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Pharmacies
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Found {searchResults.length} pharmacies with "{medicine}" in stock
            </h2>
            
            {searchResults.map((pharmacy) => (
              <Card key={pharmacy.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{pharmacy.name}</h3>
                        <Badge variant={pharmacy.available ? "default" : "secondary"}>
                          {pharmacy.available ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{pharmacy.address}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {pharmacy.distance}
                        </span>
                        <span>⭐ {pharmacy.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        onClick={() => handleDirections(pharmacy)}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => window.open(`tel:${pharmacy.phone}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {searchResults.length === 0 && medicine && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No pharmacies found</h3>
              <p className="text-gray-500">Try expanding your search radius or check the medicine name spelling.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindMedicines;
