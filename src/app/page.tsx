import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeroSection } from "@/components/hero-section";
import { IssueGrid } from "@/components/issue-grid";
import { HomeFilters } from "@/components/home-filters";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <HeroSection />
        <div className="container mx-auto -mt-16 z-10 px-4">
            <HomeFilters />
        </div>
        <div className="container mx-auto px-4 py-8">
            <IssueGrid />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
