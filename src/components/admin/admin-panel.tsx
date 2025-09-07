
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { BarChart, ListChecks, Users } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const stateSelectionSchema = z.object({
  state: z.string().min(1, "Please select a state."),
});

const registrationSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type StateSelectionValues = z.infer<typeof stateSelectionSchema>;
type RegistrationValues = z.infer<typeof registrationSchema>;

const states = ["Jharkhand", "Bihar", "Uttar Pradesh", "Maharashtra", "Delhi"];

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
  const [selectedState, setSelectedState] = useState("");

  const stateForm = useForm<StateSelectionValues>({
    resolver: zodResolver(stateSelectionSchema),
  });

  const registrationForm = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
  });

  const onStateSubmit = (data: StateSelectionValues) => {
    setSelectedState(data.state);
    // Simulate checking if state is available
    // In a real app, you'd make an API call here.
    // For this prototype, we'll assume it's always available.
    setStep(2);
  };

  const onRegistrationSubmit = (data: RegistrationValues) => {
    console.log("Admin Registered:", data);
    // Simulate successful registration
    setStep(3);
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
              <CardDescription>Select your designated state to proceed.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={stateForm.handleSubmit(onStateSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label>State</Label>
                   <Select onValueChange={(value) => stateForm.setValue('state', value)} defaultValue={stateForm.getValues('state')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {states.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {stateForm.formState.errors.state && <p className="text-sm font-medium text-destructive">{stateForm.formState.errors.state.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full font-bold">Continue</Button>
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
              <CardTitle className="font-headline text-3xl tracking-tight">Admin Registration for {selectedState}</CardTitle>
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
                <Button type="submit" size="lg" className="w-full font-bold">Create Account & Proceed to Dashboard</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>Back to State Selection</Button>
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
                 <h1 className="font-headline text-3xl font-bold">Dashboard for {selectedState}</h1>
                 <Button variant="outline" onClick={() => { setStep(1); setSelectedState(""); }}>Log Out</Button>
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
