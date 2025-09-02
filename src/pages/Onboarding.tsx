import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Upload, Users, CheckCircle, ArrowRight, FileText, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type OnboardingStep = "id-upload" | "emergency-contacts" | "consent" | "blockchain-id";

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("id-upload");
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "", phone: "", relation: "" },
  ]);
  const [consents, setConsents] = useState({
    dataProcessing: false,
    locationTracking: false,
    emergencySharing: false,
    blockchainStorage: false,
  });
  const [isGeneratingId, setIsGeneratingId] = useState(false);

  const stepProgress = {
    "id-upload": 25,
    "emergency-contacts": 50,
    "consent": 75,
    "blockchain-id": 100,
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIdDocument(file);
      toast({
        title: "Document Uploaded",
        description: "Your ID document has been securely uploaded",
      });
    }
  };

  const addEmergencyContact = () => {
    if (emergencyContacts.length < 3) {
      setEmergencyContacts([...emergencyContacts, { name: "", phone: "", relation: "" }]);
    }
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...emergencyContacts];
    updated[index][field] = value;
    setEmergencyContacts(updated);
  };

  const generateBlockchainId = async () => {
    setIsGeneratingId(true);
    
    // Simulate blockchain ID generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const blockchainId = `YG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    toast({
      title: "🔒 Blockchain ID Generated!",
      description: `Your secure ID: ${blockchainId}`,
      duration: 5000,
    });
    
    setIsGeneratingId(false);
    
    // Navigate to dashboard after ID generation
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const nextStep = () => {
    const steps: OnboardingStep[] = ["id-upload", "emergency-contacts", "consent", "blockchain-id"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "id-upload":
        return idDocument !== null;
      case "emergency-contacts":
        return emergencyContacts.some(contact => contact.name && contact.phone);
      case "consent":
        return Object.values(consents).every(consent => consent);
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">YatriGuard Setup</h1>
          </div>
          <p className="text-primary-foreground/90">
            Create your blockchain-secured Digital Tourist ID
          </p>
          <div className="mt-4">
            <Progress value={stepProgress[currentStep]} className="bg-white/20" />
            <p className="text-sm mt-2 text-primary-foreground/80">
              Step {Object.keys(stepProgress).indexOf(currentStep) + 1} of 4
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* ID Upload Step */}
        {currentStep === "id-upload" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6" />
                <span>Upload ID Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Upload your Aadhaar Card, Passport, or other government-issued ID to verify your identity.
                Your document will be encrypted and stored securely on blockchain.
              </p>
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {idDocument ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-success mx-auto" />
                    <div>
                      <p className="font-semibold">{idDocument.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(idDocument.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="font-semibold">Click to upload document</p>
                      <p className="text-sm text-muted-foreground">
                        Supports: JPG, PNG, PDF (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="id-upload"
                />
                <Label htmlFor="id-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-4">
                    {idDocument ? "Change Document" : "Choose File"}
                  </Button>
                </Label>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-primary">Security Guarantee</p>
                    <p className="text-muted-foreground">
                      Your document is encrypted end-to-end and stored on blockchain. 
                      Only you control access to this information.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts Step */}
        {currentStep === "emergency-contacts" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Emergency Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Add up to 3 emergency contacts who will be notified in case of an emergency.
                These contacts will receive your location and status updates.
              </p>

              {emergencyContacts.map((contact, index) => (
                <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
                  <h4 className="font-semibold">Contact {index + 1}</h4>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>Full Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={contact.name}
                        onChange={(e) => updateEmergencyContact(index, "name", e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                      <Input
                        id={`phone-${index}`}
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(index, "phone", e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`relation-${index}`}>Relationship</Label>
                      <Input
                        id={`relation-${index}`}
                        value={contact.relation}
                        onChange={(e) => updateEmergencyContact(index, "relation", e.target.value)}
                        placeholder="e.g., Parent, Spouse, Friend"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {emergencyContacts.length < 3 && (
                <Button variant="outline" onClick={addEmergencyContact} className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Add Another Contact
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Consent Step */}
        {currentStep === "consent" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6" />
                <span>Privacy & Consent</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Please review and accept the following permissions to activate your Digital Tourist ID.
              </p>

              <div className="space-y-4">
                {[
                  {
                    key: "dataProcessing" as keyof typeof consents,
                    title: "Data Processing",
                    description: "Allow YatriGuard to process your ID and personal information for safety services",
                  },
                  {
                    key: "locationTracking" as keyof typeof consents,
                    title: "Location Tracking",
                    description: "Enable real-time location sharing for emergency response and family updates",
                  },
                  {
                    key: "emergencySharing" as keyof typeof consents,
                    title: "Emergency Information Sharing",
                    description: "Share your information with authorities and emergency contacts when needed",
                  },
                  {
                    key: "blockchainStorage" as keyof typeof consents,
                    title: "Blockchain Storage",
                    description: "Store your Digital ID and incident logs on secure blockchain infrastructure",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                    <Checkbox
                      id={item.key}
                      checked={consents[item.key]}
                      onCheckedChange={(checked) => 
                        setConsents(prev => ({ ...prev, [item.key]: checked === true }))
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={item.key} className="font-semibold cursor-pointer">
                        {item.title}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-success/5 p-4 rounded-lg border border-success/20">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-success mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-success">Your Privacy is Protected</p>
                    <p className="text-muted-foreground">
                      You can revoke these permissions anytime in Settings. 
                      Your data is encrypted and only used for your safety.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blockchain ID Generation Step */}
        {currentStep === "blockchain-id" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-6 h-6" />
                <span>Generate Blockchain ID</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              {!isGeneratingId ? (
                <>
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                      <Smartphone className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Ready to Generate Your Digital ID</h3>
                      <p className="text-muted-foreground">
                        Your tamper-proof blockchain ID will be created using your verified information.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg text-left">
                    <h4 className="font-semibold mb-2">Your Digital ID will include:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Unique blockchain hash for verification</li>
                      <li>• QR code for instant identification</li>
                      <li>• Tamper-proof incident logging</li>
                      <li>• Valid for entire trip duration</li>
                    </ul>
                  </div>

                  <Button
                    onClick={generateBlockchainId}
                    size="lg"
                    className="w-full bg-gradient-primary hover:shadow-primary"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Generate My Blockchain ID
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Shield className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Generating Your Blockchain ID...</h3>
                    <p className="text-muted-foreground">
                      Please wait while we create your secure digital identity
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="animate-pulse">🔐 Encrypting your data...</div>
                    <div className="animate-pulse">⚡ Creating blockchain hash...</div>
                    <div className="animate-pulse">🎫 Generating QR code...</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {currentStep !== "blockchain-id" && (
          <div className="max-w-2xl mx-auto mt-8 text-center">
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              size="lg"
              className="w-full sm:w-auto"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;