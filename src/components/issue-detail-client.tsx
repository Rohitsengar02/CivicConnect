
"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, ArrowDown, MapPin, Share2, Bookmark, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface Issue {
  id: string;
  reporterName?: string;
  avatarUrl?: string | null;
  createdAt: string; // Changed to string
  imageUrls: string[];
  title: string;
  district: string;
  category: string;
  status: "Pending" | "Confirmation" | "Acknowledgment" | "Resolution";
  description: string;
  address: string;
  votes?: number;
}


type IssueStatus = "Pending" | "Confirmation" | "Acknowledgment" | "Resolution";
const statuses: IssueStatus[] = ["Pending", "Confirmation", "Acknowledgment", "Resolution"];
const statusGradients: Record<IssueStatus, string> = {
  Pending: "from-gray-400 to-gray-500",
  Confirmation: "from-yellow-400 to-orange-500",
  Acknowledgment: "from-blue-400 to-indigo-500",
  Resolution: "from-teal-400 to-green-500",
};
const statusIndex = (status: IssueStatus) => statuses.indexOf(status);


export function IssueDetailClient({ issue }: { issue: Issue }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-3">
            <Carousel className="w-full">
                <CarouselContent>
                    {issue.imageUrls.map((src, index) => (
                    <CarouselItem key={index}>
                        <Card className="overflow-hidden border-0 shadow-none">
                            <CardContent className="p-0">
                                <div className="aspect-video relative">
                                <Image
                                    src={src}
                                    alt={`${issue.title} - image ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>

        {/* Issue Details */}
        <div className="lg:col-span-2">
            <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-lg flex flex-col h-full">
                <div className="flex justify-between items-start">
                     <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm shrink-0 mb-2">
                        <MapPin className="mr-1.5 h-3 w-3" />
                        {issue.district}
                    </Badge>
                     <Badge variant="outline">{issue.category}</Badge>
                </div>
                <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">{issue.title}</h1>
                
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            {issue.avatarUrl && <AvatarImage src={issue.avatarUrl} alt={issue.reporterName} />}
                            <AvatarFallback>
                            {issue.reporterName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{issue.reporterName || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground">{new Date(issue.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <ArrowUp className="text-green-500" />
                        </Button>
                        <span className="text-lg font-bold text-foreground">{issue.votes || 0}</span>
                         <Button size="icon" variant="ghost" className="rounded-full">
                            <ArrowDown className="text-red-500"/>
                        </Button>
                    </div>
                </div>

                <Separator className="my-6" />

                <div>
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{issue.description}</p>
                </div>
                
                <Separator className="my-6" />

                 <div>
                    <h2 className="text-lg font-semibold mb-2">Location</h2>
                    <p className="text-muted-foreground">{issue.address}</p>
                </div>

                <Separator className="my-6" />

                <div>
                     <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">Status</h2>
                        <span className="text-sm font-bold text-foreground">
                            {issue.status}
                        </span>
                    </div>
                    <div className="relative h-1 w-full bg-secondary rounded-full">
                        <motion.div
                            className={cn(
                                "h-1 rounded-full bg-gradient-to-r",
                                statusGradients[issue.status]
                            )}
                            initial={{ width: '0%' }}
                            animate={{ width: `${(statusIndex(issue.status) / (statuses.length - 1)) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <div className="mt-auto pt-6 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Button variant="outline" className="w-full"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                        <Button variant="outline" className="w-full"><Bookmark className="mr-2 h-4 w-4" /> Save</Button>
                    </div>
                     <Button className="w-full"><MessageSquare className="mr-2 h-4 w-4" /> Add Comment</Button>
                </div>

            </div>
        </div>
    </div>
  );
}
