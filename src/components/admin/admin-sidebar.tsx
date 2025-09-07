
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Home,
  LineChart,
  Package,
  LogOut,
  Users2,
  Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/manage-issues", icon: Package, label: "Manage Issues", badge: 2 },
    { href: "/admin/users", icon: Users2, label: "Users" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications", badge: 5 },
    { href: "/admin/reports", icon: LineChart, label: "Reports" },
]

export function AdminSidebar() {
    const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex lg:w-56">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 lg:items-start lg:px-4">
        <Link
          href="/admin"
          className="group mb-2 flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base lg:h-10 lg:w-full lg:justify-start lg:px-3"
        >
          <Building2 className="h-4 w-4 transition-all group-hover:scale-110 lg:h-5 lg:w-5" />
          <span className="hidden lg:inline">CivicConnect</span>
          <span className="sr-only">CivicConnect Admin</span>
        </Link>
        {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/admin" || pathname === "/admin");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 lg:h-10 lg:w-full lg:justify-start lg:px-3 lg:py-2",
                    isActive && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden lg:ml-4 lg:inline">{item.label}</span>
                {item.badge && <Badge className="ml-auto hidden lg:flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{item.badge}</Badge>}
                <span className="sr-only">{item.label}</span>
              </Link>
            )
        })}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5 lg:items-start lg:px-4">
        <Link
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 lg:h-10 lg:w-full lg:justify-start lg:px-3 lg:py-2"
        >
            <LogOut className="h-5 w-5" />
            <span className="hidden lg:ml-4 lg:inline">Logout</span>
            <span className="sr-only">Logout</span>
        </Link>
      </nav>
    </aside>
  );
}
