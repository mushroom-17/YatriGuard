import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { YatriGuardLayout } from "./components/YatriGuardLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route 
            path="/dashboard" 
            element={
              <YatriGuardLayout>
                <Dashboard />
              </YatriGuardLayout>
            } 
          />
          <Route 
            path="/map" 
            element={
              <YatriGuardLayout>
                <Map />
              </YatriGuardLayout>
            } 
          />
          <Route 
            path="/itinerary" 
            element={
              <YatriGuardLayout>
                <div className="container mx-auto px-4 py-6">
                  <h1 className="text-2xl font-bold mb-4">Trip Itinerary</h1>
                  <p className="text-muted-foreground">Coming soon - Plan and manage your travel itinerary</p>
                </div>
              </YatriGuardLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <YatriGuardLayout>
                <div className="container mx-auto px-4 py-6">
                  <h1 className="text-2xl font-bold mb-4">Settings</h1>
                  <p className="text-muted-foreground">Coming soon - Privacy settings and app configuration</p>
                </div>
              </YatriGuardLayout>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
