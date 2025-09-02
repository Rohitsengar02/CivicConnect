"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DistrictSelect } from "@/components/district-select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "../theme-toggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-20 items-center transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold">CivicConnect</span>
        </Link>
        
        <nav className="hidden items-center gap-6 md:flex">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Explore</Link>
            <DistrictSelect />
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Report Issue</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>

        <div className="md:hidden">
           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <DistrictSelect />
                <nav className="flex flex-col gap-4">
                    <Link href="/explore" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
                    <Link href="#" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Report Issue</Link>
                    <Link href="#" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button variant="ghost">Log In</Button>
                  <Button>Sign Up</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
