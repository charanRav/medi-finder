
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Phone, Shield, Clock, Star, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">MediFinder</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Login / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Find Medicines <span className="text-blue-600">Instantly</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Locate nearby pharmacies, check medicine availability, and get directions - all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-12">
          <Link to="/find-medicines" className="flex-1">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4">
              <Search className="w-5 h-5 mr-2" />
              Find Medicines
            </Button>
          </Link>
          <Link to="/pharmacy-login" className="flex-1">
            <Button size="lg" variant="outline" className="w-full py-4">
              <Shield className="w-5 h-5 mr-2" />
              Pharmacy Login
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Registered Pharmacies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
            <div className="text-gray-600">Medicines Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
            <div className="text-gray-600">Happy Users</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Search Medicine</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Enter the name of the medicine you're looking for and we'll find nearby pharmacies that have it in stock.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Find Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get a list of nearby pharmacies with real-time availability, contact details, and directions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Contact & Visit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Call ahead to confirm availability or get directions to visit the pharmacy directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section for Pharmacies */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a Pharmacy Owner?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our network and help people find medicines easily while growing your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pharmacy-register">
              <Button size="lg" variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
                Register Your Pharmacy
              </Button>
            </Link>
            <Link to="/pharmacy-login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800">
                Existing User? Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose MediFinder?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Real-time Updates</h3>
            <p className="text-sm text-gray-600">Get live inventory updates from pharmacies</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Location-based</h3>
            <p className="text-sm text-gray-600">Find the nearest pharmacies to your location</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Verified Pharmacies</h3>
            <p className="text-sm text-gray-600">All pharmacies are licensed and verified</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">User Reviews</h3>
            <p className="text-sm text-gray-600">Read reviews from other customers</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MediFinder</span>
              </div>
              <p className="text-gray-400">
                Making healthcare accessible by connecting people with nearby pharmacies.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Users</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/find-medicines" className="hover:text-white">Find Medicines</Link></li>                <li><Link to="#" className="hover:text-white">How it Works</Link></li>
                <li><Link to="#" className="hover:text-white">Download App</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Pharmacies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pharmacy-register" className="hover:text-white">Register</Link></li>
                <li><Link to="/pharmacy-login" className="hover:text-white">Login</Link></li>
                <li><Link to="#" className="hover:text-white">Benefits</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-white">FAQ</Link></li>
                <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
