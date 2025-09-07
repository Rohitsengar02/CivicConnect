import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    title: "Status Update: Large Pothole on Main St",
    description: "The status of your reported issue has been updated to 'Acknowledgment' by the Public Works Dept.",
    time: "1h ago",
    read: false,
  },
  {
    title: "New Comment on 'Streetlight not working'",
    description: "A community member commented: 'I've noticed this too, it's very dark.'",
    time: "3h ago",
    read: false,
  },
  {
    title: "Issue Resolved: Garbage overflow",
    description: "The issue you voted on has been marked as 'Resolved'. Thank you for your contribution!",
    time: "1d ago",
    read: true,
  },
  {
    title: "Welcome to CivicConnect!",
    description: "Thank you for joining our community. Start by exploring issues or reporting one yourself.",
    time: "2d ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-24 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>My Notifications</CardTitle>
              <CardDescription>
                Updates on your reported issues and community activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      !notification.read ? "bg-secondary/50" : "bg-transparent"
                    }`}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground pt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
