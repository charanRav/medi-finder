
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Mail, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PharmacyLogin = () => {
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: ''
  });
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithPhone, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/pharmacy-dashboard');
    }
  }, [user, navigate]);

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForm({
      ...emailForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneForm({
      ...phoneForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(emailForm.email, emailForm.password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      });
    }
    setIsLoading(false);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signInWithPhone(phoneForm.phone, phoneForm.password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      });
    }
    setIsLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-800">Pharmacy Login</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to your pharmacy dashboard</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={emailForm.email}
                      onChange={handleEmailInputChange}
                      placeholder="pharmacy@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-password">Password</Label>
                    <Input
                      id="email-password"
                      name="password"
                      type="password"
                      value={emailForm.password}
                      onChange={handleEmailInputChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      'Sign In with Email'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phoneForm.phone}
                      onChange={handlePhoneInputChange}
                      placeholder="+1234567890"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-password">Password</Label>
                    <Input
                      id="phone-password"
                      name="password"
                      type="password"
                      value={phoneForm.password}
                      onChange={handlePhoneInputChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      'Sign In with Phone'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/pharmacy-register" className="text-green-600 hover:underline">
                    Register your pharmacy
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyLogin;
