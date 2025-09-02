"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DistrictSelect } from "@/components/district-select";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

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
        "fixed top-0 left-0 right-0 z-50 flex h-16 items-center transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">CivicConnect</span>
        </Link>
        
        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="sm">
            <MapPin className="mr-2 h-4 w-4" />
            Location
          </Button>
          <DistrictSelect />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </Button>
          <ThemeToggle />
        </div>

        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
