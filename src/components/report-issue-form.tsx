
"use client";

import * as React from "react";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Upload, X, ChevronsUpDown, Check, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IssueSubmittedDialog } from "./issue-submitted-dialog";
import { states } from "@/lib/india-states-districts";
import Map from "./map";
import { useToast } from "@/hooks/use-toast";

const reportIssueSchema = z.object({
  reportType: z.enum(["profiled", "anonymous"]),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  avatar: z.any().optional(),
  state: z.string({ required_error: "Please select a state." }),
  district: z.string({ required_error: "Please select a district." }),
  address: z.string().min(10, "A detailed address is required."),
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  images: z.array(z.any()).max(5, "You can upload a maximum of 5 images."),
});

type ReportIssueFormValues = z.infer<typeof reportIssueSchema>;

interface Location {
    lat: number;
    lng: number;
}

export function ReportIssueForm() {
    const [reportType, setReportType] = useState<"profiled" | "anonymous">("anonymous");
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionData, setSubmissionData] = useState<{ txHash: string; issueTitle: string } | null>(null);
    const [location, setLocation] = useState<Location | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(true); // Assume true initially
    const [districts, setDistricts] = useState<string[]>([]);
    
    const { toast } = useToast();

    const form = useForm<ReportIssueFormValues>({
        resolver: zodResolver(reportIssueSchema),
        defaultValues: {
            reportType: "anonymous",
            images: [],
        },
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setHasLocationPermission(true);
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setLocation(newLocation);

                    // Fetch address details
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}`);
                        const data = await response.json();
                        if (data && data.address) {
                            const { road, neighbourhood, suburb, city_district, city, state, postcode, country } = data.address;
                            const fullAddress = data.display_name || 'Address not found';
                            form.setValue('address', fullAddress);

                            const foundState = states.find(s => s.state === state);
                            if (foundState) {
                                form.setValue('state', foundState.state);
                                setDistricts(foundState.districts);
                                const foundDistrict = foundState.districts.find(d => d === (city_district || city || suburb));
                                if (foundDistrict) {
                                    form.setValue('district', foundDistrict);
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching address:", error);
                        toast({ variant: 'destructive', title: "Could not fetch address details."});
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setHasLocationPermission(false);
                }
            );
        } else {
            setHasLocationPermission(false);
        }
    }, [form, toast]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...previews].slice(0, 5));
            form.setValue("images", [...(form.getValues("images") || []), ...files].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        const currentImages = form.getValues("images");
        form.setValue("images", currentImages.filter((_, i) => i !== index));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarPreview(URL.createObjectURL(file));
            form.setValue("avatar", file);
        }
    }
    
    const onSubmit = (data: ReportIssueFormValues) => {
        if (!hasLocationPermission) {
            toast({
                variant: 'destructive',
                title: 'Location Access Required',
                description: 'Please enable location permissions to submit an issue.',
            });
            return;
        }
        setIsSubmitting(true);
        // Simulate API call and blockchain transaction
        setTimeout(() => {
            const mockTxHash = `5xJ3t2p${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 15)}`;
            setSubmissionData({ txHash: mockTxHash, issueTitle: data.title });
            setIsSubmitting(false);
        }, 2000);
    };

    const resetForm = () => {
        form.reset();
        setImagePreviews([]);
        setAvatarPreview(null);
        setSubmissionData(null);
        setReportType("anonymous");
    }

    const selectedState = form.watch('state');
    useEffect(() => {
        if (selectedState) {
            const stateData = states.find(s => s.state === selectedState);
            setDistricts(stateData ? stateData.districts : []);
        } else {
            setDistricts([]);
        }
    }, [selectedState]);

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border-white/20 shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl tracking-tight">Report a Civic Issue</CardTitle>
                    <CardDescription>Help improve your community by reporting issues.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!hasLocationPermission && (
                         <Alert variant="destructive" className="mb-6">
                            <MapPin className="h-4 w-4" />
                            <AlertTitle>Location Access Denied</AlertTitle>
                            <AlertDescription>
                                Location access is required to report an issue. Please enable it in your browser settings and refresh the page.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden border">
                         {location ? (
                            <Map location={location} path={[]} />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                {hasLocationPermission ? 'Getting your location...' : 'Location access denied.'}
                            </div>
                        )}
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <Label>How would you like to report?</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div whileTap={{ scale: 0.98 }}>
                                    <Button type="button" variant={reportType === 'profiled' ? 'default' : 'outline'} className="w-full h-16 flex flex-col gap-1" onClick={() => { setReportType('profiled'); form.setValue('reportType', 'profiled'); }}>
                                        <User />
                                        <span>With Profile</span>
                                    </Button>
                                </motion.div>
                                <motion.div whileTap={{ scale: 0.98 }}>
                                    <Button type="button" variant={reportType === 'anonymous' ? 'default' : 'outline'} className="w-full h-16 flex flex-col gap-1" onClick={() => { setReportType('anonymous'); form.setValue('reportType', 'anonymous'); }}>
                                        <Shield />
                                        <span>Anonymously</span>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {reportType === 'profiled' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6 p-6 border rounded-lg bg-secondary/30"
                                >
                                    <h3 className="text-lg font-semibold text-center">Create Your Profile</h3>
                                    <div className="flex flex-col items-center gap-4">
                                        <Controller
                                            name="avatar"
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Avatar className="w-24 h-24">
                                                        <AvatarImage src={avatarPreview || undefined} alt="User Avatar" />
                                                        <AvatarFallback><User className="w-10 h-10" /></AvatarFallback>
                                                    </Avatar>
                                                    <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                                        <Upload className="mr-2" /> Upload Avatar
                                                    </Button>
                                                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" {...form.register("name")} placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" {...form.register("email")} placeholder="john.doe@example.com" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input id="password" type="password" {...form.register("password")} placeholder="********" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <Label>State</Label>
                                    <Controller
                                        name="state"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                                        {field.value ? states.find(s => s.state === field.value)?.state : "Select state..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search state..." />
                                                        <CommandList>
                                                            <CommandEmpty>No state found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {states.map((state) => (
                                                                    <CommandItem key={state.state} value={state.state} onSelect={() => { form.setValue('state', state.state); form.setValue('district', ''); }}>
                                                                        <Check className={cn("mr-2 h-4 w-4", field.value === state.state ? "opacity-100" : "opacity-0")} />
                                                                        {state.state}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {form.formState.errors.state && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.state.message}</p>}
                                </div>
                                 <div>
                                    <Label>District</Label>
                                    <Controller
                                        name="district"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild disabled={!selectedState}>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                                        {field.value ? districts.find(d => d === field.value) : "Select district..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search district..." />
                                                        <CommandList>
                                                            <CommandEmpty>No district found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {districts.map((district) => (
                                                                    <CommandItem key={district} value={district} onSelect={() => { form.setValue('district', district)}}>
                                                                        <Check className={cn("mr-2 h-4 w-4", field.value === district ? "opacity-100" : "opacity-0")} />
                                                                        {district}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {form.formState.errors.district && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.district.message}</p>}
                                </div>
                            </div>

                             <div>
                                <Label htmlFor="address">Full Address / Landmark</Label>
                                <Textarea id="address" {...form.register("address")} placeholder="e.g., Near City Hall, Main Street" />
                                {form.formState.errors.address && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.address.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="title">Issue Title</Label>
                                <Input id="title" {...form.register("title")} placeholder="e.g., Large Pothole on Main Street" />
                                {form.formState.errors.title && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.title.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" {...form.register("description")} placeholder="Describe the issue in detail..." rows={5} />
                                {form.formState.errors.description && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.description.message}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="images">Upload Images (Max 5)</Label>
                                <div className="mt-2 flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/70">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                        <input id="dropzone-file" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} disabled={imagePreviews.length >= 5}/>
                                    </label>
                                </div>
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((src, index) => (
                                            <motion.div key={src} className="relative group" layout>
                                                <NextImage src={src} alt={`Preview ${index}`} width={150} height={150} className="rounded-md object-cover w-full aspect-square" />
                                                <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                {form.formState.errors.images && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.images.message}</p>}
                            </div>
                        </div>
                        <motion.div whileTap={{ scale: 0.99 }}>
                            <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isSubmitting || !hasLocationPermission}>
                                {isSubmitting ? "Submitting..." : "Submit Report"}
                            </Button>
                        </motion.div>
                    </form>
                </CardContent>
            </Card>

            <IssueSubmittedDialog
                isOpen={!!submissionData}
                onClose={resetForm}
                txHash={submissionData?.txHash}
                issueTitle={submissionData?.issueTitle}
            />
        </>
    );
}

    