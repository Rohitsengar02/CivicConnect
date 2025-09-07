
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ReportIssueForm } from "@/components/report-issue-form";
import { Footer } from "@/components/layout/footer";

export default function ReportIssuePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-24 md:pb-0">
        <div className="container mx-auto px-4 py-8">
            <ReportIssueForm />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
