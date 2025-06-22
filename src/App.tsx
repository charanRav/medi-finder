
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FindMedicines from "./pages/FindMedicines";
import PharmacyRegister from "./pages/PharmacyRegister";
import PharmacyLogin from "./pages/PharmacyLogin";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/find-medicines" element={<FindMedicines />} />
          <Route path="/pharmacy-register" element={<PharmacyRegister />} />
          <Route path="/pharmacy-login" element={<PharmacyLogin />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
