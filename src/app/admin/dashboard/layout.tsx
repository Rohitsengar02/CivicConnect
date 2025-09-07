
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    if (!userRole) {
      router.push('/admin');
    } else {
      setRole(userRole);
    }
  }, [router]);

  if (!role) {
    // You can return a loader here
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar userRole={role} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 lg:pl-56">
        <AdminHeader userRole={role} />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 pb-24 sm:pb-0">
          {children}
        </main>
      </div>
       <AdminMobileNav />
       <Toaster />
    </div>
  );
}
