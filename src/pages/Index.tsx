
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">MediFinder</h1>
            </div>
            <div className="space-x-4">
              <Link to="/pharmacy-login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Pharmacy Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Find Medicines Near You
            <span className="block text-blue-600">in Seconds</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with nearby pharmacies instantly. Find medicine availability, 
            get directions, and never worry about stock-outs again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-medicines">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                <Search className="w-5 h-5 mr-2" />
                Find Medicines
              </Button>
            </Link>
            <Link to="/pharmacy-register">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Pharmacy Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location-Based Search</h3>
              <p className="text-gray-600">Find pharmacies within your preferred radius with accurate location services.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Medicine Search</h3>
              <p className="text-gray-600">Advanced search with autocomplete and spelling correction for accurate results.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Availability</h3>
              <p className="text-gray-600">Get instant updates on medicine stock availability from registered pharmacies.</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold">Enter Location & Medicine</h3>
              <p className="text-gray-600">Share your location or enter manually, then search for the medicine you need.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold">View Available Pharmacies</h3>
              <p className="text-gray-600">See nearby pharmacies with your medicine in stock, sorted by distance.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold">Get Directions & Contact</h3>
              <p className="text-gray-600">Get directions to the pharmacy or call them directly from the app.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">MediFinder</h3>
              <p className="text-gray-400">Making healthcare accessible by connecting you with nearby pharmacies instantly.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Pharmacies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pharmacy-register" className="hover:text-white">Register Your Pharmacy</Link></li>
                <li><Link to="/pharmacy-login" className="hover:text-white">Pharmacy Login</Link></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
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
