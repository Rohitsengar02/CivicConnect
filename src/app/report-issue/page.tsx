import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ReportIssueForm } from "@/components/report-issue-form";

export default function ReportIssuePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
            <ReportIssueForm />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
