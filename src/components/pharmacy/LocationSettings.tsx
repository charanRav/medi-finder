import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Save, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PharmacyMap from "@/components/PharmacyMap";
import { cities } from "@/data/dummyData";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
}

interface LocationSettingsProps {
  pharmacy: Pharmacy;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({ pharmacy }) => {
  const [latitude, setLatitude] = useState(pharmacy.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(pharmacy.longitude?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          toast({
            title: "Location detected",
            description: "Your current location has been set",
          });
        },
        (error) => {
          console.error('Location error:', error);
          toast({
            title: "Error",
            description: "Unable to detect location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Location settings saved successfully",
      });
      setIsSaving(false);
    }, 1000);
  };

  const currentCoords = latitude && longitude 
    ? { lat: parseFloat(latitude), lng: parseFloat(longitude) }
    : cities[0].coords; // Default to Mumbai

  const pharmacyLocation = latitude && longitude ? [{
    id: pharmacy.id,
    name: pharmacy.name,
    address: pharmacy.address,
    phone: pharmacy.phone,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    distance: 0,
    rating: 4.5,
    openingHours: '8:00 AM - 10:00 PM',
    hasParking: true,
    is24Hours: false,
    city: '',
  }] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Pharmacy Address</Label>
              <Input
                id="address"
                value={pharmacy.address}
                disabled
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Contact support to update your address
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="19.076090"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="72.877426"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDetectLocation} variant="outline" className="flex-1">
                <Navigation className="w-4 h-4 mr-2" />
                Detect Current Location
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!latitude || !longitude || isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Location'}
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Why set your location?</strong>
                <br />
                Setting your exact coordinates helps customers find your pharmacy on the map and get accurate directions.
              </p>
            </div>
          </div>

          {/* Map Preview */}
          {latitude && longitude && (
            <div>
              <h4 className="font-semibold mb-3">Location Preview</h4>
              <div className="h-[400px] rounded-lg overflow-hidden border">
                <PharmacyMap
                  pharmacies={pharmacyLocation}
                  cityCoords={currentCoords}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is how your pharmacy will appear to customers on the map
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSettings;
