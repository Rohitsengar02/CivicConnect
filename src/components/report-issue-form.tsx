
"use client";

import * as React from "react";
import NextImage from "next/image";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Upload, X, ChevronsUpDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IssueSubmittedDialog } from "./issue-submitted-dialog";

const reportIssueSchema = z.object({
  reportType: z.enum(["profiled", "anonymous"]),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  avatar: z.any().optional(),
  district: z.string({ required_error: "Please select a district." }),
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  images: z.array(z.any()).max(5, "You can upload a maximum of 5 images."),
});

type ReportIssueFormValues = z.infer<typeof reportIssueSchema>;

const districts = [
    { value: "ranchi", label: "Ranchi" },
    { value: "dhanbad", label: "Dhanbad" },
    { value: "patna", label: "Patna" },
    { value: "lucknow", label: "Lucknow" },
    { value: "mumbai", label: "Mumbai" },
    { value: "delhi", label: "Delhi" },
];

export function ReportIssueForm() {
    const [reportType, setReportType] = useState<"profiled" | "anonymous">("anonymous");
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionData, setSubmissionData] = useState<{ txHash: string; issueTitle: string } | null>(null);


    const form = useForm<ReportIssueFormValues>({
        resolver: zodResolver(reportIssueSchema),
        defaultValues: {
            reportType: "anonymous",
            images: [],
        },
    });

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

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto bg-card/50 backdrop-blur-lg border-white/20 shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl tracking-tight">Report a Civic Issue</CardTitle>
                    <CardDescription>Help improve your community by reporting issues.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            <div>
                                <Label>District</Label>
                                <Controller
                                    name="district"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                                    {field.value ? districts.find(d => d.value === field.value)?.label : "Select district..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search district..." />
                                                    <CommandList>
                                                        <CommandEmpty>No district found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {districts.map((district) => (
                                                                <CommandItem
                                                                    key={district.value}
                                                                    value={district.value}
                                                                    onSelect={(currentValue) => {
                                                                        field.onChange(currentValue === field.value ? "" : currentValue);
                                                                    }}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", field.value === district.value ? "opacity-100" : "opacity-0")} />
                                                                    {district.label}
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
                            <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isSubmitting}>
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

    