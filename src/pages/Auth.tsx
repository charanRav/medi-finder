
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, User, Mail, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ 
    email: '', 
    phone: '',
    password: '',
    loginType: 'email'
  });
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    phone: '',
    password: '', 
    confirmPassword: '', 
    userType: 'user',
    signupType: 'email'
  });
  
  const { signIn, signInWithPhone, signUp, signUpWithPhone, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    let error;
    if (loginForm.loginType === 'email') {
      const result = await signIn(loginForm.email, loginForm.password);
      error = result.error;
    } else {
      const result = await signInWithPhone(loginForm.phone, loginForm.password);
      error = result.error;
    }
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    let error;
    if (signupForm.signupType === 'email') {
      const result = await signUp(signupForm.email, signupForm.password, signupForm.userType);
      error = result.error;
    } else {
      const result = await signUpWithPhone(signupForm.phone, signupForm.password, signupForm.userType);
      error = result.error;
    }
    
    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: signupForm.signupType === 'email' 
          ? "Please check your email to verify your account."
          : "Please check your phone for verification code.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Authentication</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <p className="text-gray-600">Sign in to your account</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={loginForm.loginType === 'email' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoginForm({...loginForm, loginType: 'email'})}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={loginForm.loginType === 'phone' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoginForm({...loginForm, loginType: 'phone'})}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </Button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginForm.loginType === 'email' ? (
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email Address</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                          placeholder="user@example.com"
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="login-phone">Phone Number</Label>
                        <Input
                          id="login-phone"
                          type="tel"
                          value={loginForm.phone}
                          onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                          placeholder="+1234567890"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <p className="text-gray-600">Join our medicine finder platform</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={signupForm.signupType === 'email' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSignupForm({...signupForm, signupType: 'email'})}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={signupForm.signupType === 'phone' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSignupForm({...signupForm, signupType: 'phone'})}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </Button>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    {signupForm.signupType === 'email' ? (
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                          placeholder="user@example.com"
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone Number</Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          value={signupForm.phone}
                          onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                          placeholder="+1234567890"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="user-type">Account Type</Label>
                      <select
                        id="user-type"
                        value={signupForm.userType}
                        onChange={(e) => setSignupForm({...signupForm, userType: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="user">General User</option>
                        <option value="pharmacy">Pharmacy Owner</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        placeholder="Create a password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
