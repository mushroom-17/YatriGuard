import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Globe, Users, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImage from "@/assets/hero-image.jpg";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "mr", name: "मराठी" },
  { code: "ta", name: "தமிழ்" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
];

const features = [
  {
    icon: Shield,
    title: "Blockchain-Verified ID",
    description: "Tamper-proof digital tourist identity valid for your entire trip",
    verified: true,
  },
  {
    icon: AlertTriangle,
    title: "Instant SOS Alert",
    description: "One-tap emergency help with offline SMS/USSD fallback",
    verified: true,
  },
  {
    icon: MapPin,
    title: "Smart Safety Map",
    description: "Real-time danger zones, help posts, and location tracking",
    verified: true,
  },
  {
    icon: Users,
    title: "Family Sharing",
    description: "Share trip status securely with loved ones",
    verified: true,
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <h1 className="text-2xl font-bold">YatriGuard</h1>
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Travel Safe, Stay Connected
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              India's first blockchain-powered tourist safety app. Get verified digital ID, 
              instant emergency help, and peace of mind for you and your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/onboarding")}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                Get Started - Create Digital ID
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                I Already Have an Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={heroImage}
          alt="YatriGuard - Tourist Safety in India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Why Choose YatriGuard?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with cutting-edge blockchain technology and government partnerships 
            to ensure your safety is our top priority.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-primary transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-3">{feature.description}</p>
                {feature.verified && (
                  <div className="flex items-center justify-center text-success text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Blockchain Verified</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-success/5 rounded-lg p-8 text-center">
          <h4 className="text-2xl font-bold mb-4">Trusted by 50,000+ Travelers</h4>
          <p className="text-muted-foreground mb-6">
            Government-approved • Privacy-first • 24/7 Emergency Response
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-success" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Government Partnership</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-success" />
              <span>11 Languages Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;