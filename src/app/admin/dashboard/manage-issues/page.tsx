
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFirestore, collection, getDocs, Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface Issue {
  id: string;
  title: string;
  reporterName?: string;
  category: string;
  status: string;
  createdAt: Timestamp;
  imageUrls: string[];
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Pending: "destructive",
  Confirmation: "secondary",
  Acknowledgment: "outline",
  Resolution: "default",
};

export default function ManageIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const db = getFirestore(app);

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "issues"));
        const issuesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Issue));
        setIssues(issuesData);
      } catch (error) {
        console.error("Error fetching issues: ", error);
        toast({
          title: "Error",
          description: "Failed to fetch issues.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [db, toast]);

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Issues</CardTitle>
          <CardDescription>
            Review, update, and resolve reported civic issues.
          </CardDescription>
        </CardHeader>
      </Card>
      {isLoading ? (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : issues.length === 0 ? (
        <p className="text-center text-muted-foreground">No issues have been reported yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
            <Card key={issue.id} className="flex flex-col overflow-hidden">
                <Link href={`/admin/dashboard/manage-issues/${issue.id}`} className="block hover:opacity-90 transition-opacity">
                <div className="relative aspect-video">
                    <Image 
                    src={issue.imageUrls?.[0] || "https://picsum.photos/800/600"}
                    alt={issue.title}
                    fill
                    className="object-cover"
                    />
                </div>
                </Link>
                <CardHeader>
                <div className="flex justify-between items-start">
                    <Link href={`/admin/dashboard/manage-issues/${issue.id}`} className="block">
                        <CardTitle className="text-lg hover:underline">{issue.title}</CardTitle>
                    </Link>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/dashboard/manage-issues/${issue.id}`} className="w-full h-full">
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription>ID: {issue.id}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Reporter</p>
                    <p className="text-sm">{issue.reporterName || 'Anonymous'}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="text-sm">{issue.category || 'General'}</p>
                </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Badge variant={statusVariant[issue.status] || 'secondary'}>{issue.status}</Badge>
                    <p className="text-sm text-muted-foreground">{issue.createdAt.toDate().toLocaleDateString()}</p>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}
