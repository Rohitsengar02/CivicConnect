"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from "lucide-react"

export function DistrictSelect() {
  return (
    <Select>
      <SelectTrigger className="w-full md:w-[180px]">
        <div className="flex items-center gap-2">
            <SelectValue placeholder="Select District" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ranchi">Ranchi</SelectItem>
          <SelectItem value="dhanbad">Dhanbad</SelectItem>
          <SelectItem value="patna">Patna</SelectItem>
          <SelectItem value="lucknow">Lucknow</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
