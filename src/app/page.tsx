import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeroSection } from "@/components/hero-section";
import { IssueGrid } from "@/components/issue-grid";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <IssueGrid />
      </main>
      <MobileNav />
    </div>
  );
}
