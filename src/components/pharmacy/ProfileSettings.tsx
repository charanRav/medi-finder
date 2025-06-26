
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Pharmacy {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
}

interface ProfileSettingsProps {
  pharmacy: Pharmacy;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ pharmacy }) => {
  return (
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
  );
};

export default ProfileSettings;
