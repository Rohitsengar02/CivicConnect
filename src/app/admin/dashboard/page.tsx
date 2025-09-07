
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ListChecks, UserCheck, Users } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from '@/components/ui/button';
import Link from 'next/link';


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


export default function AdminDashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [district] = useState("Ranchi"); // This would come from user session for district admin

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    setUserRole(role);
  }, []);
  
  return (
     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {userRole === 'superadmin' && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5</div>
                     <Link href="/admin/dashboard/approve-admins">
                        <Button variant="link" className="p-0 h-auto text-xs">View applications</Button>
                    </Link>
                </CardContent>
            </Card>
        )}
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
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Issues Reported Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <RechartsBarChart accessibilityLayer data={chartData}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="issues" fill="var(--color-issues)" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
