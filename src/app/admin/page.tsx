
"use client";

import {
  Activity,
  ArrowUpRight,
  ClipboardList,
  Clock,
  HelpCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const lineChartData = [
  { date: "2024-07-01", issues: 12 },
  { date: "2024-07-02", issues: 15 },
  { date: "2024-07-03", issues: 18 },
  { date: "2024-07-04", issues: 14 },
  { date: "2024-07-05", issues: 22 },
  { date: "2024-07-06", issues: 25 },
  { date: "2024-07-07", issues: 20 },
];

const pieChartData = [
  { name: "Roads", value: 45, fill: "var(--color-roads)" },
  { name: "Sanitation", value: 30, fill: "var(--color-sanitation)" },
  { name: "Electricity", value: 15, fill: "var(--color-electricity)" },
  { name: "Other", value: 10, fill: "var(--color-other)" },
];

const chartConfig = {
  issues: {
    label: "Issues",
  },
  roads: {
    label: "Roads",
    color: "hsl(var(--chart-1))",
  },
  sanitation: {
    label: "Sanitation",
    color: "hsl(var(--chart-2))",
  },
  electricity: {
    label: "Electricity",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
};

const recentActivities = [
    { user: "Ravi Kumar", action: "reported a new issue:", details: "Large Pothole on Main St", time: "5m ago", avatar: "https://picsum.photos/id/1005/48/48" },
    { user: "Admin", action: "updated status for IS-002 to", details: "Acknowledgment", time: "1h ago", avatar: "https://picsum.photos/id/1027/48/48" },
    { user: "Priya Sharma", action: "commented on issue:", details: "Streetlight not working", time: "2h ago", avatar: "https://picsum.photos/id/1011/48/48" },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
            Hello Anjali!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with civic issues today.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved This Week
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+54</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Resolution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 Days</div>
            <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Issues Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart
                accessibilityLayer
                data={lineChartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="issues"
                  type="natural"
                  fill="var(--color-issues)"
                  fillOpacity={0.4}
                  stroke="var(--color-issues)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
            <CardDescription>
              Breakdown of all reported issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[200px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                   <LabelList
                    dataKey="name"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof chartConfig) =>
                      chartConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>An overview of the latest actions and reports.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                      <div key={index}>
                          <div className="flex items-start gap-4">
                              <Avatar>
                                  <AvatarImage src={activity.avatar} />
                                  <AvatarFallback>{activity.user.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                  <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-primary">{activity.details}</span>
                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                          </div>
                          {index < recentActivities.length - 1 && <Separator className="mt-4" />}
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
