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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const issues = [
  {
    id: "IS-001",
    title: "Large Pothole on Main St",
    reporter: "Ravi Kumar",
    category: "Roads",
    status: "Confirmation",
    date: "2024-07-28",
  },
  {
    id: "IS-002",
    title: "Streetlight not working",
    reporter: "Priya Sharma",
    category: "Electricity",
    status: "Pending",
    date: "2024-07-28",
  },
  {
    id: "IS-003",
    title: "Garbage overflow",
    reporter: "Anonymous",
    category: "Sanitation",
    status: "Resolution",
    date: "2024-07-27",
  },
  {
    id: "IS-004",
    title: "Broken Water Pipe",
    reporter: "Anjali Singh",
    category: "Water Supply",
    status: "Acknowledgment",
    date: "2024-07-26",
  },
   {
    id: "IS-005",
    title: "Fallen Tree Blocking Road",
    reporter: "Amit Patel",
    category: "Public Safety",
    status: "Pending",
    date: "2024-07-25",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    Pending: "destructive",
    Confirmation: "secondary",
    Acknowledgment: "outline",
    Resolution: "default"
}


export default function ManageIssuesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Issues</CardTitle>
        <CardDescription>
          Review, update, and resolve reported civic issues.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">{issue.id}</TableCell>
                <TableCell>{issue.title}</TableCell>
                <TableCell>{issue.reporter}</TableCell>
                <TableCell>{issue.category}</TableCell>
                <TableCell>
                    <Badge variant={statusVariant[issue.status]}>{issue.status}</Badge>
                </TableCell>
                <TableCell>{issue.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
