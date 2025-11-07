import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation, X } from 'lucide-react';
import type { PharmacyLocation } from '@/data/dummyData';

interface PharmacyMapProps {
  pharmacies: (PharmacyLocation & { medicineName?: string; price?: number; inStock?: boolean })[];
  cityCoords: { lat: number; lng: number };
  onPharmacySelect?: (pharmacy: PharmacyLocation) => void;
}

const PharmacyMap: React.FC<PharmacyMapProps> = ({ pharmacies, cityCoords, onPharmacySelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyLocation | null>(null);

  useEffect(() => {
    // Check if token is in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setTokenSaved(true);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !tokenSaved || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [cityCoords.lng, cityCoords.lat],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocateControl, 'top-right');

    return () => {
      // Clear markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [cityCoords, tokenSaved, mapboxToken]);

  useEffect(() => {
    if (!map.current || !tokenSaved) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each pharmacy
    pharmacies.forEach((pharmacy) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'pharmacy-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="
          background: ${pharmacy.inStock !== false ? '#10b981' : '#ef4444'};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 16px;
        ">
          ₹
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true })
        .setHTML(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1f2937;">
              ${pharmacy.name}
            </h3>
            <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
              ${pharmacy.address}
            </p>
            ${pharmacy.medicineName ? `
              <p style="font-size: 12px; margin-bottom: 4px;">
                <strong>${pharmacy.medicineName}</strong>
              </p>
            ` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              ${pharmacy.price ? `
                <span style="font-weight: 600; color: #2563eb;">₹${pharmacy.price}</span>
              ` : ''}
              <span style="
                font-size: 11px;
                padding: 2px 8px;
                border-radius: 12px;
                background: ${pharmacy.inStock !== false ? '#dcfce7' : '#fee2e2'};
                color: ${pharmacy.inStock !== false ? '#166534' : '#991b1b'};
              ">
                ${pharmacy.inStock !== false ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
              📍 ${pharmacy.distance} km away
            </div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
              📞 ${pharmacy.phone}
            </div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
              ⭐ ${pharmacy.rating}/5.0
            </div>
            <button 
              id="navigate-${pharmacy.id}"
              style="
                width: 100%;
                padding: 6px 12px;
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 8px;
              "
            >
              Get Directions
            </button>
          </div>
        `);

      // Add click handler for navigation button after popup opens
      popup.on('open', () => {
        const navButton = document.getElementById(`navigate-${pharmacy.id}`);
        if (navButton) {
          navButton.addEventListener('click', () => {
            handleNavigate(pharmacy);
          });
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([pharmacy.longitude, pharmacy.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedPharmacy(pharmacy);
        if (onPharmacySelect) {
          onPharmacySelect(pharmacy);
        }
      });

      markers.current.push(marker);
    });

    // Fit bounds to show all markers
    if (pharmacies.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      pharmacies.forEach(pharmacy => {
        bounds.extend([pharmacy.longitude, pharmacy.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [pharmacies, tokenSaved, onPharmacySelect]);

  const handleNavigate = (pharmacy: PharmacyLocation) => {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
    window.open(url, '_blank');
  };

  const handleSaveToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setTokenSaved(true);
    }
  };

  const handleRemoveToken = () => {
    localStorage.removeItem('mapbox_token');
    setMapboxToken('');
    setTokenSaved(false);
  };

  if (!tokenSaved) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
              <p className="text-sm text-gray-600 mb-4">
                To display the interactive map, please enter your Mapbox public access token. 
                You can get one for free at{' '}
                <a 
                  href="https://account.mapbox.com/access-tokens/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91cl91c2VybmFtZSIsImEiOiJ5b3VyX3Rva2VuIn0..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveToken} disabled={!mapboxToken.trim()}>
                Save Token
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your token will be saved locally in your browser and used only for map display.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemoveToken}
        className="absolute top-2 left-2 z-10 bg-white shadow-md"
      >
        <X className="w-4 h-4 mr-1" />
        Remove Token
      </Button>
      {selectedPharmacy && (
        <Card className="absolute bottom-4 left-4 right-4 z-10 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold">{selectedPharmacy.name}</h4>
                <p className="text-sm text-gray-600">{selectedPharmacy.address}</p>
              </div>
              <Button size="sm" onClick={() => handleNavigate(selectedPharmacy)}>
                <Navigation className="w-4 h-4 mr-1" />
                Navigate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PharmacyMap;
