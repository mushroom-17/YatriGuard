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
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/90" />
        <div className="relative">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 text-primary-foreground">
                <div className="w-9 h-9 rounded-lg bg-white/10 grid place-items-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold">YatriGuard</h1>
              </div>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-36 bg-white/10 border-white/20 text-white">
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

            {/* Hero */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mt-12">
              <div className="text-primary-foreground">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Government-aligned • Privacy-first</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
                  Guarding Tourists, Growing Tourism.
                </h2>
                <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl">
                  India's first blockchain-powered tourist safety app. Get your digital ID, receive instant SOS support, and share trip status securely with your family.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => navigate("/digital-id")}
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
                  >
                    Get Started — Create Digital ID
                  </Button>
                  <Button
                    onClick={() => navigate("/signin")}
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
                  >
                    Sign Up
                  </Button>
                </div>

                {/* Stats */}
                <div className="mt-10 grid grid-cols-3 gap-6 text-white/90">
                  <div>
                    <div className="text-2xl font-bold">50k+</div>
                    <div className="text-sm">Travelers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm">Emergency Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">11</div>
                    <div className="text-sm">Languages</div>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute -inset-6 bg-white/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-2xl">
                  <img src={heroImage} alt="YatriGuard" className="w-full h-[380px] object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold mb-3">Built for Peace of Mind</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            YatriGuard brings together verified identity, proactive safety, and seamless sharing — all secured by modern cryptography.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3">
                  <feature.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing CTA removed per request */}

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold">YatriGuard</span>
              </div>
              <p className="text-sm text-muted-foreground">Blockchain-powered safety platform for travelers and families.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Product</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/digital-id')} className="hover:text-foreground">Digital ID</button></li>
                <li><button onClick={() => navigate('/map')} className="hover:text-foreground">Safety Map</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-foreground">Dashboard</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Resources</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy & Security</li>
                <li>Help Center</li>
                <li>Contact Support</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-xs text-muted-foreground flex items-center justify-between">
            <span>© {new Date().getFullYear()} YatriGuard. All rights reserved.</span>
            <span>Made with care for travelers</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;