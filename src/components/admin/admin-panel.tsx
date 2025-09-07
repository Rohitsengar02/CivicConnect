
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  getFirestore,
  doc,
  getDoc,
  writeBatch,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "@/lib/firebase";
import { states } from "@/lib/india-states-districts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

const districtSelectionSchema = z.object({
  state: z.string().min(1, "Please select a state."),
  district: z.string().min(1, "Please select a district."),
});

const registrationSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;
type DistrictSelectionValues = z.infer<typeof districtSelectionSchema>;
type RegistrationValues = z.infer<typeof registrationSchema>;


export function AdminPanel() {
  const [step, setStep] = useState(1); // 1: Login/Register Choice, 2: District Select, 3: Register Form, 4: Login Form
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const db = getFirestore(app);
  const auth = getAuth(app);

  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const districtForm = useForm<DistrictSelectionValues>({ resolver: zodResolver(districtSelectionSchema) });
  const registrationForm = useForm<RegistrationValues>({ resolver: zodResolver(registrationSchema) });

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict("");
    districtForm.setValue('state', stateName);
    districtForm.resetField('district'); 
    const selectedStateData = states.find(s => s.state === stateName);
    setDistricts(selectedStateData ? selectedStateData.districts : []);
    setError(null);
  }

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    districtForm.setValue('district', districtName);
    setError(null);
  }

  const onDistrictSubmit = async (data: DistrictSelectionValues) => {
    setIsLoading(true);
    setError(null);
    try {
        const q = query(
            collection(db, "districtAdmins"), 
            where("district", "==", data.district), 
            where("state", "==", data.state)
        );
        const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError(`An admin for ${data.district}, ${data.state} already exists or an application is pending.`);
      } else {
        setStep(3); // Go to registration form
      }
    } catch (err) {
      setError("An error occurred while verifying the district.");
    } finally {
        setIsLoading(false);
    }
  };

  const onRegistrationSubmit = async (data: RegistrationValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create user first
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const batch = writeBatch(db);
      
      // Create a document in 'admins' collection
      const adminRef = doc(db, "admins", user.uid);
      batch.set(adminRef, {
        name: data.name,
        email: data.email,
        state: selectedState,
        district: selectedDistrict,
        role: "admin",
        status: "pending",
        createdAt: new Date(),
      });

      // Create a document in 'districtAdmins' to enforce uniqueness
      const districtAdminRef = doc(collection(db, "districtAdmins"));
      batch.set(districtAdminRef, {
          adminId: user.uid,
          state: selectedState,
          district: selectedDistrict,
      });

      await batch.commit();
      
      toast({
        title: "Registration Successful!",
        description: "Your application has been submitted and is pending approval.",
      });
      
      await auth.signOut();
      setStep(1); // Go back to main choice

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            setError('This email is already registered.');
        } else {
            console.error("Registration error:", error);
            setError('An unexpected error occurred during registration.');
        }
    } finally {
        setIsLoading(false);
    }
  };


 const onLoginSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setError(null);
    try {
        // Super Admin Login
        if (data.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
            if (data.password === process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD) {
                 await signInWithEmailAndPassword(auth, data.email, data.password);
                 sessionStorage.setItem('userRole', 'superadmin');
                 sessionStorage.setItem('adminInfo', JSON.stringify({ name: 'Super Admin', district: 'Global', email: data.email }));
                 router.push('/admin/dashboard');
                 return;
            } else {
                 setError("Invalid credentials for super admin.");
                 setIsLoading(false);
                 return;
            }
        }

        // District Admin Login
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const adminDocRef = doc(db, "admins", user.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            if (adminData.role === 'admin' && adminData.status === 'approved') {
                sessionStorage.setItem('userRole', 'admin');
                sessionStorage.setItem('adminInfo', JSON.stringify({
                    name: adminData.name,
                    district: adminData.district,
                    email: adminData.email
                }));
                router.push('/admin/dashboard');
            } else if (adminData.status === 'pending') {
                setError("Your application is still pending approval.");
            } else if (adminData.status === 'rejected') {
                setError("Your application has been rejected.");
            } else {
                setError("You do not have the required permissions to log in.");
            }
        } else {
            setError("No admin account found for this user.");
        }
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            setError("Invalid email or password.");
        } else {
            setError("An unexpected error occurred during login.");
            console.error(error);
        }
    } finally {
        setIsLoading(false);
    }
};



  const renderStep = () => {
    switch (step) {
      case 1: // Main choice
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl tracking-tight">Admin Panel</CardTitle>
              <CardDescription>Log in or register a new district admin.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button size="lg" className="w-full font-bold" onClick={() => setStep(4)}>
                <LogIn className="mr-2 h-5 w-5"/> Admin Login
              </Button>
              <Button size="lg" variant="outline" className="w-full font-bold" onClick={() => setStep(2)}>
                Register New District
              </Button>
            </CardContent>
          </motion.div>
        );

      case 2: // District selection
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader>
              <CardTitle>Select District</CardTitle>
              <CardDescription>Choose the district you want to register.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={districtForm.handleSubmit(onDistrictSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label>State</Label>
                    <Select onValueChange={handleStateChange} value={selectedState}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map((s) => ( <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem> ))}
                        </SelectContent>
                    </Select>
                    {districtForm.formState.errors.state && <p className="text-sm font-medium text-destructive">{districtForm.formState.errors.state.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label>District</Label>
                    <Select onValueChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedState}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a district" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((d) => ( <SelectItem key={d} value={d}>{d}</SelectItem> ))}
                        </SelectContent>
                    </Select>
                    {districtForm.formState.errors.district && <p className="text-sm font-medium text-destructive">{districtForm.formState.errors.district.message}</p>}
                </div>

                {error && <p className="text-sm font-medium text-destructive flex items-center gap-2 mt-2"><AlertCircle className="h-4 w-4"/> {error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>Continue</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep(1); setError(null); }}>Back</Button>
              </form>
            </CardContent>
          </motion.div>
        );
      
      case 3: // Registration form
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader>
              <CardTitle>Admin Registration for {selectedDistrict}, {selectedState}</CardTitle>
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
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>Submit for Approval</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep(2); setError(null); }}>Back to District Selection</Button>
              </form>
            </CardContent>
          </motion.div>
        );

      case 4: // Login form
        return (
            <motion.div key="step4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="login-email">Email</Label>
                            <Input id="login-email" type="email" {...loginForm.register("email")} placeholder="admin@example.com" />
                            {loginForm.formState.errors.email && <p className="text-sm font-medium text-destructive">{loginForm.formState.errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="login-password">Password</Label>
                            <Input id="login-password" type="password" {...loginForm.register("password")} placeholder="********" />
                            {loginForm.formState.errors.password && <p className="text-sm font-medium text-destructive">{loginForm.formState.errors.password.message}</p>}
                        </div>
                        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>Login</Button>
                        <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep(1); setError(null); }}>Back</Button>
                    </form>
                </CardContent>
            </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-card/50 backdrop-blur-lg border-white/20 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
    </Card>
  );
}

    