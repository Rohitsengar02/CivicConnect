
"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, query, getDocs, doc, updateDoc, where } from "firebase/firestore";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface AdminApplication {
  id: string;
  name: string;
  email: string;
  state: string;
  district: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};


export default function ApproveAdminsPage() {
  const [pendingApps, setPendingApps] = useState<AdminApplication[]>([]);
  const [approvedApps, setApprovedApps] = useState<AdminApplication[]>([]);
  const [rejectedApps, setRejectedApps] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'superadmin') {
      router.push('/admin/dashboard');
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "admins"));
        const querySnapshot = await getDocs(q);
        const allApps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminApplication));
        
        setPendingApps(allApps.filter(app => app.status === 'pending'));
        setApprovedApps(allApps.filter(app => app.status === 'approved'));
        setRejectedApps(allApps.filter(app => app.status === 'rejected'));

      } catch (error) {
        console.error("Error fetching applications: ", error);
        toast({
          title: "Error",
          description: "Failed to fetch applications.",
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

        const appToMove = pendingApps.find(app => app.id === appId)!;
        appToMove.status = newStatus;

        setPendingApps(prev => prev.filter(app => app.id !== appId));
        if (shouldApprove) {
            setApprovedApps(prev => [appToMove, ...prev]);
        } else {
            setRejectedApps(prev => [appToMove, ...prev]);
        }
        
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
  
  const renderTable = (apps: AdminApplication[], type: 'pending' | 'approved' | 'rejected') => (
     <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>District</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Date</TableHead>
              {type === 'pending' ? <TableHead>Actions</TableHead> : <TableHead>Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length > 0 ? apps.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-medium">{app.name}</div>
                  <div className="text-sm text-muted-foreground">{app.email}</div>
                </TableCell>
                <TableCell>{app.district}</TableCell>
                <TableCell>{app.state}</TableCell>
                <TableCell>{new Date(app.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell>
                  {type === 'pending' ? (
                     <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApproval(app.id, true)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleApproval(app.id, false)}>Reject</Button>
                    </div>
                  ) : <Badge variant={statusVariant[app.status]}>{app.status}</Badge>}
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No {type} applications found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Applications</CardTitle>
        <CardDescription>
          Review and manage all district admin applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {isLoading ? <p>Loading...</p> : renderTable(pendingApps, 'pending')}
          </TabsContent>
          <TabsContent value="approved">
            {isLoading ? <p>Loading...</p> : renderTable(approvedApps, 'approved')}
          </TabsContent>
          <TabsContent value="rejected">
            {isLoading ? <p>Loading...</p> : renderTable(rejectedApps, 'rejected')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
