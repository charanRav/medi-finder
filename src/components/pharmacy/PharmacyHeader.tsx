
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
}

interface PharmacyHeaderProps {
  pharmacy: Pharmacy;
  onLogout: () => void;
}

const PharmacyHeader: React.FC<PharmacyHeaderProps> = ({ pharmacy, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pharmacy.name}</h1>
              <p className="text-sm text-gray-600">Dashboard</p>
            </div>
          </div>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PharmacyHeader;
