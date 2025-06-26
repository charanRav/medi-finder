
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const OrdersPlaceholder: React.FC = () => {
  return (
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
  );
};

export default OrdersPlaceholder;
