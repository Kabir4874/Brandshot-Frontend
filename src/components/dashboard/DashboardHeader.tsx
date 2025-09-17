"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import React from "react";

export type DateSort = "newest" | "oldest" | "7d" | "30d";

const TAG_OPTIONS = [
  "All",
  "Design",
  "Research",
  "Development",
  "Marketing",
] as const;

export default function DashboardHeader() {
  const [query, setQuery] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(["All"]);
  const [dateSort, setDateSort] = React.useState<DateSort>("newest");

  const toggleTag = (t: string) => {
    setTags((prev) => {
      if (t === "All") return ["All"];
      const next = prev.includes(t)
        ? prev.filter((x) => x !== t && x !== "All")
        : [...prev.filter((x) => x !== "All"), t];
      return next.length === 0 ? ["All"] : next;
    });
  };

  return (
    <div className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-4">
        {/* Top bar: title + small pill CTA */}
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold leading-none tracking-tight">
            Dashboard
          </h1>

          <Button
            size="sm"
            className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-semibold text-nano-gray-100 hover:bg-nano-forest-800/95"
          >
            Create New Project
          </Button>
        </div>

        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-nano-mint/55"
          />
          <Input
            aria-label="Search projects"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 md:h-12 w-full rounded-lg border-0 bg-nano-forest-800 pl-11 pr-4 text-[14px] text-nano-white placeholder:text-nano-mint/60 shadow-none focus-visible:ring-0"
          />
        </div>

        {/* Filter pills row */}
        <div className="mt-3 flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex h-9 items-center gap-2 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95 hover:text-nano-gray-100"
              >
                <span>Project Tags</span>
                <ChevronDown className="h-4 w-4 opacity-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 border-0 bg-nano-forest-800 p-1 text-nano-gray-100 shadow-md"
            >
              <DropdownMenuLabel className="text-[12px] opacity-70">
                Filter by tags
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-nano-deep-900" />
              {TAG_OPTIONS.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={tags.includes(t)}
                  onCheckedChange={() => toggleTag(t)}
                  className="cursor-pointer rounded-[6px] text-[13px] focus:bg-nano-deep-900 focus:text-nano-gray-100 data-[state=checked]:bg-nano-deep-900"
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex h-9 items-center gap-2 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95 hover:text-nano-gray-100"
              >
                <span>Creation Date</span>
                <ChevronDown className="h-4 w-4 opacity-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-52 border-0 bg-nano-forest-800 p-1 text-nano-gray-100 shadow-md"
            >
              <DropdownMenuLabel className="text-[12px] opacity-70">
                Sort / Range
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-nano-deep-900" />
              <DropdownMenuRadioGroup
                value={dateSort}
                onValueChange={(value) => setDateSort(value as DateSort)}
              >
                {[
                  { key: "newest", label: "Newest first" },
                  { key: "oldest", label: "Oldest first" },
                  { key: "7d", label: "Last 7 days" },
                  { key: "30d", label: "Last 30 days" },
                ].map((o) => (
                  <DropdownMenuRadioItem
                    key={o.key}
                    value={o.key}
                    className="cursor-pointer rounded-[6px] text-[13px] focus:bg-nano-deep-900 focus:text-nano-gray-100 data-[state=checked]:bg-nano-deep-900"
                  >
                    {o.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
