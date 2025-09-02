import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeroSection } from "@/components/hero-section";
import { IssueGrid } from "@/components/issue-grid";
import { SearchFilters } from "@/components/search-filters";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto px-4 py-8 -mt-16">
            <SearchFilters />
            <IssueGrid />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
