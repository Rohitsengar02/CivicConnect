
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BarChart, ListChecks, Users, CheckCircle, Clock } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { motion } from "framer-motion";

const barChartData = [
    { month: "January", issues: 186 },
    { month: "February", issues: 305 },
    { month: "March", issues: 237 },
    { month: "April", issues: 273 },
    { month: "May", issues: 209 },
    { month: "June", issues: 214 },
];
const barChartConfig = {
    issues: {
      label: "Issues",
      color: "hsl(var(--primary))",
    },
};

const pieChartData = [
  { name: 'Pending', value: 247, color: 'hsl(var(--chart-5))' },
  { name: 'Confirmation', value: 312, color: 'hsl(var(--chart-4))' },
  { name: 'Acknowledgment', value: 150, color: 'hsl(var(--chart-2))' },
  { name: 'Resolved', value: 987, color: 'hsl(var(--chart-1))' },
];

const statCards = [
    { title: "Total Issues", value: "1,696", change: "+5.2% from last month", icon: ListChecks },
    { title: "Resolved Issues", value: "987", change: "80% resolution rate", icon: CheckCircle },
    { title: "Pending Issues", value: "247", change: "Needs attention", icon: Clock },
    { title: "Active Users", value: "5,432", change: "+12% from last month", icon: Users },
];

export default function AdminDashboardPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
       {/* Stat Cards - Carousel on Mobile, Grid on Desktop */}
       <div className="sm:hidden -ml-4">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                    {statCards.map((card, index) => (
                        <CarouselItem key={index} className="basis-[90%] pl-4 mr-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                    <card.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{card.value}</div>
                                    <p className="text-xs text-muted-foreground">{card.change}</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
       </div>
       <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, index) => (
                 <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground">{card.change}</p>
                        </CardContent>
                    </Card>
                 </motion.div>
            ))}
       </div>

       <div className="grid gap-8 lg:grid-cols-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Issues Reported Over Time</CardTitle>
                        <CardDescription>A summary of issues reported in the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                            <RechartsBarChart accessibilityLayer data={barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="issues" fill="var(--color-issues)" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Issues by Status</CardTitle>
                        <CardDescription>Current breakdown of all issues.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>
       </div>
    </div>
  );
}
