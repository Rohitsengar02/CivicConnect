
"use client";

import Link from "next/link";
import {
  Building2,
  Home,
  LineChart,
  Package,
  PanelLeft,
  Users2,
  Bell,
  UserCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "../theme-toggle";

export function AdminHeader({ userRole }: { userRole: string }) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    router.push('/admin');
  };

  const adminNavLinks = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/dashboard/manage-issues", icon: Package, label: "Manage Issues" },
    { href: "/admin/dashboard/users", icon: Users2, label: "Users" },
    { href: "/admin/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/dashboard/reports", icon: LineChart, label: "Reports" }
  ];

  const superAdminNavLinks = [
    ...adminNavLinks,
    { href: "/admin/dashboard/approve-admins", icon: UserCheck, label: "Approve Admins" },
  ];

  const navLinks = userRole === 'superadmin' ? superAdminNavLinks : adminNavLinks;


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/admin/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Building2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">CivicConnect Admin</span>
            </Link>
            {navLinks.map(link => (
                 <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="hidden md:block">
        <h1 className="font-semibold text-lg">{userRole === 'superadmin' ? 'Super Admin Dashboard' : 'Ranchi District Dashboard'}</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
      </div>
    </header>
  );
}
