import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <AdminPanel />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
