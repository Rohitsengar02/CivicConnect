
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "@/lib/firebase";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, ListChecks, Users, AlertCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";

const districtSelectionSchema = z.object({
  district: z.string().min(1, "Please select a district."),
});

const registrationSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type DistrictSelectionValues = z.infer<typeof districtSelectionSchema>;
type RegistrationValues = z.infer<typeof registrationSchema>;

const chartData = [
    { month: "January", issues: 186 },
    { month: "February", issues: 305 },
    { month: "March", issues: 237 },
    { month: "April", issues: 273 },
    { month: "May", issues: 209 },
    { month: "June", issues: 214 },
];
const chartConfig = {
    issues: {
      label: "Issues",
      color: "hsl(var(--primary))",
    },
};

export function AdminPanel() {
  const [step, setStep] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "districts"));
        const districtsList = querySnapshot.docs.map(doc => ({
          value: doc.id,
          label: doc.data().name,
        }));
        setDistricts(districtsList);
      } catch (err) {
        setError("Failed to load districts. Please try again later.");
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not connect to the database to fetch districts.",
        })
      } finally {
        setIsLoading(false);
      }
    };
    fetchDistricts();
  }, [db, toast]);


  const districtForm = useForm<DistrictSelectionValues>({
    resolver: zodResolver(districtSelectionSchema),
  });

  const registrationForm = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
  });

  const onDistrictSubmit = async (data: DistrictSelectionValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if an admin for this district already exists
      const adminsRef = collection(db, "admins");
      const q = query(adminsRef, where("district", "==", data.district));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError(`An admin for ${districts.find(d=>d.value === data.district)?.label} already exists. This district is not available.`);
        toast({
            variant: "destructive",
            title: "District Unavailable",
            description: `An admin account for this district has already been registered.`,
        });
      } else {
        setSelectedDistrict(data.district);
        setStep(2);
      }
    } catch (err) {
      setError("An error occurred while verifying the district. Please try again.");
       toast({
            variant: "destructive",
            title: "Verification Error",
            description: "Could not verify the selected district. Please check your connection.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const onRegistrationSubmit = async (data: RegistrationValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Add admin document to Firestore
      await setDoc(doc(db, "admins", user.uid), {
        name: data.name,
        email: data.email,
        district: selectedDistrict,
        role: "admin",
        createdAt: new Date(),
      });
      
      toast({
        title: "Registration Successful!",
        description: "Your admin account has been created.",
      });
      
      setStep(3); // Proceed to dashboard
    } catch (error: any) {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            setError('This email is already registered. Please use a different email.');
        } else {
            setError('An unexpected error occurred during registration. Please try again.');
        }
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl tracking-tight">Admin Panel</CardTitle>
              <CardDescription>Select your designated district to proceed.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={districtForm.handleSubmit(onDistrictSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label>District</Label>
                   <Select onValueChange={(value) => districtForm.setValue('district', value)} defaultValue={districtForm.getValues('district')} disabled={isLoading || districts.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Loading districts..." : "Select a district"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {districts.map((d) => (
                          <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {districtForm.formState.errors.district && <p className="text-sm font-medium text-destructive">{districtForm.formState.errors.district.message}</p>}
                   {error && <p className="text-sm font-medium text-destructive flex items-center gap-2 mt-2"><AlertCircle className="h-4 w-4"/> {error}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full font-bold" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Continue"}
                </Button>
              </form>
            </CardContent>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl tracking-tight">Admin Registration for {districts.find(d=>d.value === selectedDistrict)?.label}</CardTitle>
              <CardDescription>Create your secure admin account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...registrationForm.register("name")} placeholder="John Doe" />
                  {registrationForm.formState.errors.name && <p className="text-sm font-medium text-destructive">{registrationForm.formState.errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...registrationForm.register("email")} placeholder="admin@example.com" />
                  {registrationForm.formState.errors.email && <p className="text-sm font-medium text-destructive">{registrationForm.formState.errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...registrationForm.register("password")} placeholder="********" />
                  {registrationForm.formState.errors.password && <p className="text-sm font-medium text-destructive">{registrationForm.formState.errors.password.message}</p>}
                </div>
                 {error && <p className="text-sm font-medium text-destructive flex items-center gap-2"><AlertCircle className="h-4 w-4"/> {error}</p>}
                <Button type="submit" size="lg" className="w-full font-bold" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account & Proceed"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep(1); setError(null); }}>Back to District Selection</Button>
              </form>
            </CardContent>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            <div className="flex justify-between items-center mb-6">
                 <h1 className="font-headline text-3xl font-bold">Dashboard for {districts.find(d=>d.value === selectedDistrict)?.label}</h1>
                 <Button variant="outline" onClick={() => { setStep(1); setSelectedDistrict(""); setError(null); }}>Log Out</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">987</div>
                        <p className="text-xs text-muted-foreground">80% resolution rate</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">247</div>
                        <p className="text-xs text-muted-foreground">Needs attention</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Issues Reported Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <RechartsBarChart accessibilityLayer data={chartData}>
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="issues" fill="var(--color-issues)" radius={4} />
                        </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border-white/20 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
    </Card>
  );
}
