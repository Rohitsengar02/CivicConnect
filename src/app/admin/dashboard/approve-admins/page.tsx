
"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";
import { app } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AdminApplication {
  id: string;
  name: string;
  email: string;
  state: string;
  district: string;
  status: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function ApproveAdminsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'superadmin') {
      router.push('/admin'); // Redirect if not superadmin
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "admins"), where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);
        const pendingApps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminApplication));
        setApplications(pendingApps);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch pending applications.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [db, router, toast]);

  const handleApproval = async (appId: string, shouldApprove: boolean) => {
    try {
        const adminRef = doc(db, "admins", appId);
        const newStatus = shouldApprove ? "approved" : "rejected";
        await updateDoc(adminRef, { status: newStatus });

        setApplications(prev => prev.filter(app => app.id !== appId));
        toast({
            title: "Success",
            description: `Application has been ${newStatus}.`
        });
    } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update application status.",
          variant: "destructive",
        });
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approve Admin Registrations</CardTitle>
        <CardDescription>
          Review and approve or reject new district admin applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>District</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-medium">{app.name}</div>
                  <div className="text-sm text-muted-foreground">{app.email}</div>
                </TableCell>
                <TableCell>{app.district}</TableCell>
                <TableCell>{app.state}</TableCell>
                <TableCell>{new Date(app.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => handleApproval(app.id, true)}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleApproval(app.id, false)}>Reject</Button>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">No pending applications found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
