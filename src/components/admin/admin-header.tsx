
"use client";

import Link from "next/link";
import {
  Building2,
  Home,
  LineChart,
  Package,
  PanelLeft,
  Users2,
  ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "../theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AdminHeader() {
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
              href="/admin"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Building2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">CivicConnect Admin</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/manage-issues"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-5 w-5" />
              Manage Issues
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-5 w-5" />
              Users
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LineChart className="h-5 w-5" />
              Reports
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="hidden md:block">
        <h1 className="font-semibold text-lg">Ranchi District</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                 <Avatar className="h-6 w-6">
                    <AvatarImage src="https://picsum.photos/id/1027/48/48" />
                    <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">Anjali Singh</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  );
}
