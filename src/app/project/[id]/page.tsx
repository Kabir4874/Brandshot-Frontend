"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";

type Mode = "all" | "t2i" | "i2i";

const IMAGES = [
  "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604882737207-8f21c4b0afdf?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975940205-cf9f4f8a1f2a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616628188466-8c2a6fb5d9df?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228724-4af21a8179af?q=80&w=1200&auto=format&fit=crop",
];

export default function ProjectGalleryPage() {
  const [query, setQuery] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("all");

  return (
    <main className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-14">
        {/* Title + meta */}
        <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight">
            Project: Marketing Campaign
          </h1>
          <p className="mt-1 text-[13px] text-nano-gray-100/85">
            Last updated 2 days ago
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-3 w-full">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nano-mint/60"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search images"
            className="h-10 w-full rounded-md border-0 bg-nano-olive-700 pl-9 text-[14px] text-nano-mint placeholder:text-nano-mint/55 focus-visible:ring-1 focus-visible:ring-nano-mint/30"
          />
        </div>

        {/* Filters + actions */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
            <div className="flex w-max items-center gap-2 md:gap-3">
              <FilterPill
                active={mode === "all"}
                onClick={() => setMode("all")}
              >
                All
              </FilterPill>
              <FilterPill
                active={mode === "t2i"}
                onClick={() => setMode("t2i")}
              >
                Text to Image
              </FilterPill>
              <FilterPill
                active={mode === "i2i"}
                onClick={() => setMode("i2i")}
              >
                Image to Image
              </FilterPill>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-2 md:justify-end">
            <Button className="h-8 rounded-md bg-nano-olive-700 px-3 text-[13px] font-medium text-nano-mint hover:bg-nano-deep-900 w-full md:w-auto">
              Quick Compare
            </Button>
            <Button className="h-8 rounded-md bg-emerald-500 px-3 text-[13px] font-semibold text-black hover:bg-emerald-500/90 w-full md:w-auto">
              Download All
            </Button>
          </div>
        </div>

        {/* Image grid */}
        <section className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {IMAGES.slice(0, 12).map((src, i) => (
              <figure
                key={i}
                className="aspect-square overflow-hidden rounded-md bg-nano-olive-700 ring-1 ring-nano-forest-800"
              >
                <Image
                  src={src}
                  alt={`preview ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </section>

        {/* Prompts list */}
        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-nano-gray-100">
            Image Prompts
          </h2>

          <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-8">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="border-b border-nano-deep-900 pb-4">
                <div className="mb-1 text-[11px] uppercase tracking-wide text-nano-gray-100/70">
                  Image {idx + 1}
                </div>
                <div className="text-[13px] text-nano-gray-100/90">
                  Prompt for image {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 rounded-md px-3 text-[13px] font-medium transition-colors",
        active
          ? "bg-nano-forest-800 text-nano-gray-100"
          : "bg-nano-olive-700 text-nano-mint hover:bg-nano-deep-900"
      )}
    >
      {children}
    </button>
  );
}
