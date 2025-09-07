
"use client";

import { useState, useEffect } from "react";
import { states } from "@/lib/india-states-districts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Filters } from "@/app/explore/page";


interface HomeFiltersProps {
    onFilterChange: (filters: Filters) => void;
}

export function HomeFilters({ onFilterChange }: HomeFiltersProps) {
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Filters>({ sortBy: 'newest' });

  useEffect(() => {
    onFilterChange(currentFilters);
  }, [currentFilters, onFilterChange]);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const selectedStateData = states.find(s => s.state === stateName);
    setDistricts(selectedStateData ? selectedStateData.districts : []);
    handleFilterChange('state', stateName);
    handleFilterChange('district', undefined); // Reset district when state changes
  };

  const handleFilterChange = (filterName: keyof Filters, value: string | undefined) => {
    setCurrentFilters(prev => {
        const newFilters = {...prev, [filterName]: value};
        // If a filter is cleared (undefined), remove it from the object
        if (value === undefined || value === 'all') {
            delete (newFilters as any)[filterName];
        }
        return newFilters;
    });
  };

  const filterOptions = [
    {
      label: "State",
      value: "state",
      options: states.map(s => ({ value: s.state, label: s.state })),
      onChange: handleStateChange
    },
    {
      label: "District",
      value: "district",
      options: districts.map(d => ({ value: d, label: d })),
      disabled: !selectedState,
      onChange: (value: string) => handleFilterChange('district', value)
    },
    {
      label: "Category",
      value: "category",
      options: [
        { value: "Roads", label: "Roads" },
        { value: "Sanitation", label: "Sanitation" },
        { value: "Electricity", label: "Electricity" },
      ],
      onChange: (value: string) => handleFilterChange('category', value)
    },
    {
      label: "Sort by",
      value: "sortBy",
      options: [
        { value: "newest", label: "Newest" },
        { value: "popular", label: "Most Popular" },
        { value: "trending", label: "Trending" },
      ],
      onChange: (value: string) => handleFilterChange('sortBy', value)
    },
  ];

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-card/50 p-4 shadow-lg backdrop-blur-lg md:flex-row md:items-center">
      <div className="flex-1 overflow-x-auto md:overflow-visible pb-2">
        <div className="flex gap-4 md:items-center">
          {filterOptions.map(filter => (
            <Select
                key={filter.value}
                onValueChange={filter.onChange}
                disabled={!!filter.disabled}
                value={currentFilters[filter.value as keyof Filters] || ''}
            >
              <SelectTrigger className="w-40 min-w-40 rounded-full border-0 bg-secondary/70 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>
    </div>
  );
}
