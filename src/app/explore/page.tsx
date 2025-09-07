import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ExploreFilters } from "@/components/explore-filters";
import { IssueGrid } from "@/components/issue-grid";

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-24 md:pb-0">
        <div className="container mx-auto px-4 py-8">
            <ExploreFilters />
            <IssueGrid />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
