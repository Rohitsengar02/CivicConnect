
import { AdminPanel } from "@/components/admin/admin-panel";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.28))] p-4 pb-24 md:pb-4">
        <AdminPanel />
    </div>
  );
}
