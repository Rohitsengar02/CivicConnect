"use client";

import { DistrictSelect } from "./district-select";
import { Button } from "./ui/button";
import { ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function HomeFilters() {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-card/50 p-4 shadow-lg backdrop-blur-lg md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
            <DistrictSelect />
            <Select>
                <SelectTrigger className="w-full md:w-[180px] rounded-full border-0 bg-secondary/70 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors">
                    <SelectValue placeholder="Sort by: Newest" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Roads</DropdownMenuItem>
                    <DropdownMenuItem>Sanitation</DropdownMenuItem>
                    <DropdownMenuItem>Electricity</DropdownMenuItem>
                    <DropdownMenuItem>Water Supply</DropdownMenuItem>
                    <DropdownMenuItem>Public Safety</DropdownMenuItem>
                    <DropdownMenuItem>Parks</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
    );
}
