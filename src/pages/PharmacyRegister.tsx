
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PharmacyRegister = () => {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    ownerName: '',
    licenseNumber: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setLicenseFile(e.target.files[0]);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast({
            title: "Location captured",
            description: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter address manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!licenseFile) {
      toast({
        title: "License Required",
        description: "Please upload your pharmacy license",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Sign up the user first
      const { error: signUpError } = await signUp(formData.email, formData.password, 'pharmacy');
      
      if (signUpError) {
        throw signUpError;
      }

      // Get the current user to get the user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Insert pharmacy data
        const { error: pharmacyError } = await supabase
          .from('pharmacies')
          .insert({
            user_id: user.id,
            name: formData.pharmacyName,
            owner_name: formData.ownerName,
            license_number: formData.licenseNumber,
            phone: formData.phone,
            email: formData.email,
            address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            latitude: null, // You can implement geocoding later
            longitude: null
          });

        if (pharmacyError) {
          console.error('Pharmacy insert error:', pharmacyError);
          throw new Error('Failed to save pharmacy details');
        }
      }

      toast({
        title: "Registration Successful!",
        description: "Please check your email for verification. You can now login after verification.",
      });
      
      // Redirect to login page
      navigate('/pharmacy-login');
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-800">Pharmacy Registration</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Register Your Pharmacy</CardTitle>
            <p className="text-gray-600 text-center">Join our network and help people find medicines easily</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pharmacy Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pharmacy Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                  <Input
                    id="pharmacyName"
                    name="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={handleInputChange}
                    placeholder="e.g., MediCare Pharmacy"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="Full name of the pharmacy owner"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Pharmacy License Number *</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Your pharmacy license number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseUpload">Upload License Document *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="licenseUpload"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="flex-1"
                      required
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="pharmacy@example.com"
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, landmark"
                      className="flex-1"
                      required
                    />
                    <Button type="button" onClick={handleGetLocation} variant="outline">
                      <MapPin className="w-4 h-4 mr-2" />
                      Use GPS
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Security</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  'Register Pharmacy'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/pharmacy-login" className="text-blue-600 hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyRegister;
