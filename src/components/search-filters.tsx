"use client";

import { DistrictSelect } from "@/components/district-select";
import { Button } from "@/components/ui/button";

const categories = ["All", "Roads", "Sanitation", "Electricity", "Water Supply", "Public Safety"];

const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
        case "Roads":
            return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M10.63 5.33c.12-.14.12-.36 0-.5-.12-.14-.33-.14-.46 0l-1.5 1.83c-.12.14-.12.36 0 .5s.33.14.46 0l1.5-1.83Z"/><path d="m14.37 5.33-.46 0c-.2 0-.32.22-.24.41.05.11.16.18.28.18h.3c.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42Z"/><path d="M12.25 5.53c-.14.12-.14.33 0 .46.14.12.36.12.5 0l1.83-1.5c.14-.12.14-.33 0-.46-.14-.12-.36-.12-.5 0l-1.83 1.5Z"/><path d="M9 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/><path d="M18 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/><path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"/><path d="M15.5 18c-1.25-1-3-1-5 0-1-.5-1.5-1.5-1.5-2.5 0-2 2-4 4-4s4 2 4 4c0 1-.5 2-1.5 2.5Z"/></svg>;
        case "Sanitation":
            return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M14.5 9.5c.3-.3.8-.3 1 0 .2.2.2.5 0 .7l-3.5 3.5c-.2.2-.5.2-.7 0l-2-2c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0l1.6 1.6z"/><path d="M12 22a4 4 0 0 0 4-4v-3h-2v3a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-3H8v3a4 4 0 0 0 4 4z"/><path d="M12 2a4 4 0 0 0-4 4v3h2V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2v3h2V6a4 4 0 0 0-4-4z"/></svg>;
        case "Electricity":
            return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M12 22v-2"/><path d="M8.5 15a4.5 4.5 0 0 0 7 0"/><path d="M12 11V2"/><path d="m15 5-3-3-3 3"/></svg>;
        default:
            return null;
    }
}

export function SearchFilters() {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
            <DistrictSelect />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((category) => (
                <Button key={category} variant={category === 'All' ? 'default' : 'outline'} className="rounded-full shrink-0">
                    {category !== "All" && <CategoryIcon category={category} />}
                    {category}
                </Button>
            ))}
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
