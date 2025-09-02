import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, type FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

const step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"], { required_error: "Select gender" }),
  nationality: z.string().min(2, "Nationality is required"),
  idDoc: z.instanceof(File).optional(),
  selfie: z.instanceof(File).optional(),
  mobile: z
    .string()
    .min(10, "Enter valid mobile number")
    .regex(/^\+?[0-9\s-]{10,15}$/i, "Enter valid mobile number"),
  otp: z.string().min(4, "Enter OTP").max(8, "OTP too long").optional(),
  email: z.string().email("Enter valid email"),
});

const step2Schema = z.object({
  arrival: z.date({ required_error: "Arrival date is required" }),
  departure: z.date({ required_error: "Departure date is required" }),
  destinations: z.array(z.string().min(2, "Destination required")).min(1, "Add at least one destination"),
  itinerary: z.string().optional(),
  travelMode: z.enum(["flight", "train", "road"], { required_error: "Select mode of travel" }),
  accommodationName: z.string().min(2, "Accommodation name required"),
  accommodationAddress: z.string().min(5, "Address required"),
  bookingRef: z.string().optional(),
});

const step3Schema = z.object({
  emergencyPrimaryName: z.string().min(2, "Name required"),
  emergencyPrimaryRelation: z.string().min(2, "Relation required"),
  emergencyPrimaryPhone: z
    .string()
    .min(10, "Enter valid phone")
    .regex(/^\+?[0-9\s-]{10,15}$/i, "Enter valid phone"),
  emergencySecondaryName: z.string().optional(),
  emergencySecondaryRelation: z.string().optional(),
  emergencySecondaryPhone: z.string().optional(),
  bloodGroup: z
    .enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"], { required_error: "Select blood group" })
    .optional(),
  allergies: z.string().optional(),
  locationConsent: z.enum(["family", "authorities", "none"], { required_error: "Choose one" }),
});

const allSchema = step1Schema
  .and(step2Schema)
  .and(step3Schema)
  .and(z.object({ consent: z.literal(true, { errorMap: () => ({ message: "You must agree to continue" }) }) }))
  ;

// Explicitly type the form values to avoid intersection type issues with react-hook-form's FieldArrayPath
export interface FormValues extends FieldValues {
  fullName: string;
  dob?: Date;
  gender?: "male" | "female" | "other";
  nationality: string;
  idDoc?: File;
  selfie?: File;
  mobile: string;
  otp?: string;
  email: string;

  arrival?: Date;
  departure?: Date;
  destinations: string[];
  itinerary?: string;
  travelMode?: "flight" | "train" | "road";
  accommodationName: string;
  accommodationAddress: string;
  bookingRef?: string;

  emergencyPrimaryName: string;
  emergencyPrimaryRelation: string;
  emergencyPrimaryPhone: string;
  emergencySecondaryName?: string;
  emergencySecondaryRelation?: string;
  emergencySecondaryPhone?: string;
  bloodGroup?: "A+"|"A-"|"B+"|"B-"|"AB+"|"AB-"|"O+"|"O-";
  allergies?: string;
  locationConsent?: "family"|"authorities"|"none";
  consent?: boolean;
}

function DateField({ value, onChange, placeholder }: { value?: Date; onChange: (d: Date | undefined) => void; placeholder: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}> 
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

export default function DigitalID() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [generated, setGenerated] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(allSchema), // full schema; per-step gating handled manually below
    defaultValues: {
      gender: undefined,
      travelMode: undefined,
      locationConsent: undefined,
      consent: undefined as unknown as true,
      destinations: [""],
      accommodationName: "",
      accommodationAddress: "",
      bookingRef: "",
      itinerary: "",
    },
    mode: "onSubmit",
  });

  const { fields: destinationFields, append: addDestination, remove: removeDestination } = useFieldArray<FormValues, "destinations">({
    control: form.control,
    name: "destinations",
  });

  const progress = useMemo(() => (step / 4) * 100, [step]);

  const validateCurrentStep = async () => {
    const values = form.getValues();
    try {
      if (step === 1) await step1Schema.parseAsync(values);
      if (step === 2) await step2Schema.parseAsync(values);
      if (step === 3) await step3Schema.parseAsync(values);
      if (step === 4) await allSchema.parseAsync(values);
      return true;
    } catch (e) {
      form.trigger();
      return false;
    }
  };

  const onNext = async () => {
    const ok = await validateCurrentStep();
    if (ok) setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s));
  };

  const onPrev = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));

  const onGenerate = async () => {
    const ok = await validateCurrentStep();
    if (!ok) return;
    const values = form.getValues();
    const idNumber = `YG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const docHash = `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;
    const payload = {
      idNumber,
      docHash,
      fullName: values.fullName,
      arrival: values.arrival ? (values.arrival as Date).toISOString() : undefined,
      departure: values.departure ? (values.departure as Date).toISOString() : undefined,
      destinations: values.destinations,
      travelMode: values.travelMode,
      accommodationName: values.accommodationName,
      accommodationAddress: values.accommodationAddress,
      bookingRef: values.bookingRef,
      emergencyPrimaryName: values.emergencyPrimaryName,
      emergencyPrimaryPhone: values.emergencyPrimaryPhone,
      locationConsent: values.locationConsent,
    };
    try {
      localStorage.setItem("yg_digital_id", JSON.stringify(payload));
    } catch {}
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Digital Tourist ID (YatriGuard)</CardTitle>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Step {step} of 4</p>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={(e)=>{ e.preventDefault(); step < 4 ? onNext() : onGenerate(); }}>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Step 1: Identity & Verification</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dob" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <DateField value={field.value} onChange={field.onChange} placeholder="Pick a date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nationality" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Indian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormItem>
                      <FormLabel>Upload Aadhaar/Passport</FormLabel>
                      <Input type="file" accept="image/*,application/pdf" onChange={(e)=>{
                        const f = e.target.files?.[0];
                        form.setValue("idDoc", f as any, { shouldValidate: false });
                      }} />
                      <p className="text-xs text-muted-foreground">Image or PDF</p>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Upload Selfie</FormLabel>
                      <Input type="file" accept="image/*" onChange={(e)=>{
                        const f = e.target.files?.[0];
                        form.setValue("selfie", f as any, { shouldValidate: false });
                      }} />
                      <p className="text-xs text-muted-foreground">Clear face photo</p>
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="mobile" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile (OTP)</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="otp" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" inputMode="numeric" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Step 2: Trip Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="arrival" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Date</FormLabel>
                        <FormControl>
                          <DateField value={field.value} onChange={field.onChange} placeholder="Select arrival" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="departure" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Date</FormLabel>
                        <FormControl>
                          <DateField value={field.value} onChange={field.onChange} placeholder="Select departure" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Destinations</FormLabel>
                    <div className="space-y-2">
                      {destinationFields.map((field, idx) => (
                        <div key={field.id} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`destinations.${idx}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder={`Destination ${idx + 1} (e.g., Jaipur)`} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDestination(idx)}
                            aria-label="Remove destination"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => addDestination("")}>
                        <Plus className="mr-2 h-4 w-4" /> Add destination
                      </Button>
                    </div>
                  </div>

                  <FormField control={form.control} name="itinerary" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itinerary Details (optional)</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Activities, notes, references" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="travelMode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode of Travel</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flight">Flight</SelectItem>
                              <SelectItem value="train">Train</SelectItem>
                              <SelectItem value="road">Road</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="accommodationName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Hotel/Hostel name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="accommodationAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street, City, PIN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bookingRef" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Reference (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="#ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Step 3: Emergency & Safety Info</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField control={form.control} name="emergencyPrimaryName" render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Primary Contact Name</FormLabel>
                        <FormControl><Input placeholder="Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="emergencyPrimaryRelation" render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Relation</FormLabel>
                        <FormControl><Input placeholder="e.g., Parent" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="emergencyPrimaryPhone" render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input placeholder="+91 ..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField control={form.control} name="emergencySecondaryName" render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Secondary Contact (optional)</FormLabel>
                        <FormControl><Input placeholder="Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="emergencySecondaryRelation" render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Relation</FormLabel>
                        <FormControl><Input placeholder="Relation" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="emergencySecondaryPhone" render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input placeholder="+91 ..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group (optional)</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {(["A+","A-","B+","B-","AB+","AB-","O+","O-"] as const).map(bg => (
                                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="allergies" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies (optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Penicillin" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="locationConsent" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location sharing consent</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="family" id="consent-family" />
                            <label htmlFor="consent-family">Family</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="authorities" id="consent-authorities" />
                            <label htmlFor="consent-authorities">Authorities</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="consent-none" />
                            <label htmlFor="consent-none">None</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Step 4: Review & Generate</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">Preview your details below.</p>
                    <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">
{JSON.stringify(form.getValues(), (key, val) => (val instanceof File ? { name: val.name, size: val.size } : val), 2)}
                    </pre>
                  </div>
                  <FormField control={form.control} name="consent" render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <Checkbox id="consent" checked={!!field.value} onCheckedChange={(v)=> field.onChange(Boolean(v))} />
                      <div className="grid gap-1.5 leading-none">
                        <FormLabel htmlFor="consent" className="font-normal">
                          I agree to secure storage on blockchain for trip duration.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />

                  {generated && null}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Use Back and Next to navigate. Your data stays on this device until you generate.</div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onPrev} disabled={step === 1}>Back</Button>
                {step < 4 ? (
                  <Button type="submit">Next</Button>
                ) : (
                  <Button type="submit" onClick={onGenerate}>Generate ID</Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
