
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Building2,
  Home,
  LineChart,
  Package,
  LogOut,
  Users2,
  Bell,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

export function AdminSidebar({ userRole }: { userRole: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem('userRole');
        router.push('/admin');
    };

    const adminNavItems = [
        { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
        { href: "/admin/dashboard/manage-issues", icon: Package, label: "Manage Issues", badge: 2 },
        { href: "/admin/dashboard/users", icon: Users2, label: "Users" },
        { href: "/admin/dashboard/notifications", icon: Bell, label: "Notifications", badge: 5 },
        { href: "/admin/dashboard/reports", icon: LineChart, label: "Reports" },
    ];

    const superAdminNavItems = [
        ...adminNavItems,
        { href: "/admin/dashboard/approve-admins", icon: UserCheck, label: "Approve Admins" },
    ];

    const navItems = userRole === 'superadmin' ? superAdminNavItems : adminNavItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-sidebar text-sidebar-foreground sm:flex lg:w-56">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 lg:items-start lg:px-4">
        <Link
          href="/admin/dashboard"
          className="group mb-2 flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-sidebar-primary text-lg font-semibold text-sidebar-primary-foreground md:h-8 md:w-8 md:text-base lg:h-10 lg:w-full lg:justify-start lg:px-3"
        >
          <Building2 className="h-4 w-4 transition-all group-hover:scale-110 lg:h-5 lg:w-5" />
          <span className="hidden lg:inline">CivicConnect</span>
          <span className="sr-only">CivicConnect Admin</span>
        </Link>
        {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:h-8 md:w-8 lg:h-10 lg:w-full lg:justify-start lg:px-3 lg:py-2",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden lg:ml-4 lg:inline">{item.label}</span>
                {item.badge && <Badge className="ml-auto hidden lg:flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">{item.badge}</Badge>}
                <span className="sr-only">{item.label}</span>
              </Link>
            )
        })}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5 lg:items-start lg:px-4">
        <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:h-8 md:w-8 lg:h-10 lg:w-full lg:justify-start lg:px-3 lg:py-2"
        >
            <LogOut className="h-5 w-5" />
            <span className="hidden lg:ml-4 lg:inline">Logout</span>
            <span className="sr-only">Logout</span>
        </button>
      </nav>
    </aside>
  );
}
