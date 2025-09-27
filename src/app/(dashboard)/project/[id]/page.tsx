"use client";

import { getProject } from "@/api/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LocalGeneration,
  ProjectImageFlat,
  listGenerations,
  listImagesByProject,
} from "@/lib/localImages";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { Search } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import * as React from "react";

type Mode = "all" | "t2i" | "i2i";

export default function ProjectGalleryPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  const [project, setProject] = React.useState<Project | null>(null);
  const [gens, setGens] = React.useState<LocalGeneration[]>([]);
  const [images, setImages] = React.useState<ProjectImageFlat[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // UI filters
  const [query, setQuery] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("all");

  // initial load + a simple "storage change" refresh
  React.useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    try {
      getProject(projectId).then((p) => setProject(p));
      setGens(listGenerations(projectId));
      setImages(listImagesByProject(projectId));
      setErr(null);
    } catch {
      setErr("Failed to load project.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // if some other view saves to localStorage, allow manual refresh with a custom event
  React.useEffect(() => {
    function onRefresh(e: Event) {
      const id = (e as CustomEvent<{ projectId: string }>).detail?.projectId;
      if (!projectId || id !== projectId) return;
      setGens(listGenerations(projectId));
      setImages(listImagesByProject(projectId));
    }
    window.addEventListener("nb:project:refresh", onRefresh as EventListener);
    return () =>
      window.removeEventListener(
        "nb:project:refresh",
        onRefresh as EventListener
      );
  }, [projectId]);

  // filtering (images grid uses flat images)
  const filteredImages = React.useMemo(() => {
    let arr = images.slice();
    if (mode !== "all") arr = arr.filter((i) => i.mode === mode);
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (i) =>
          i.prompt.toLowerCase().includes(q) ||
          project?.name?.toLowerCase().includes(q) ||
          project?.client?.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [images, mode, query, project]);

  // prompts list (grouped by generation)
  const filteredGens = React.useMemo(() => {
    let arr = gens.slice();
    if (mode !== "all") arr = arr.filter((g) => g.mode === mode);
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((g) => g.prompt.toLowerCase().includes(q));
    }
    return arr;
  }, [gens, mode, query]);

  return (
    <main className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-14">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight">
            {project ? `Project: ${project.name}` : "Project"}
          </h1>
          <p className="mt-1 text-[13px] text-nano-gray-100/85">
            {project
              ? `Last updated ${timeAgo(project.updatedAt)}`
              : loading
              ? "Loading…"
              : "—"}
          </p>
        </header>

        {err && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
            {err}
          </div>
        )}

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
          {loading ? (
            <div className="text-[13px] text-nano-gray-100/85">Loading…</div>
          ) : filteredImages.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {filteredImages.slice(0, 12).map((it, i) => (
                <figure
                  key={`${it.genId}-${it.image.id}`}
                  className="aspect-square overflow-hidden rounded-md bg-nano-olive-700 ring-1 ring-nano-forest-800"
                  title={it.prompt}
                >
                  <Image
                    src={it.image.thumbUrl || it.image.dataUrl}
                    alt={`preview ${i + 1}`}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </figure>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-nano-gray-100/85">
              No images yet.
            </div>
          )}
        </section>

        {/* Prompts list (each generation with count of images) */}
        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-nano-gray-100">
            Image Prompts
          </h2>

          {loading ? (
            <div className="text-[13px] text-nano-gray-100/85">Loading…</div>
          ) : filteredGens.length ? (
            <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-8">
              {filteredGens.slice(0, 24).map((g) => (
                <div key={g.id} className="border-b border-nano-deep-900 pb-4">
                  <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wide text-nano-gray-100/70">
                    <span>{labelForMode(g.mode)}</span>
                    <span>•</span>
                    <span>{new Date(g.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>
                      {g.images.length} img{g.images.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-[13px] text-nano-gray-100/90">
                    {g.prompt}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-nano-gray-100/85">
              No prompts yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ---------------- helpers / tiny UI bits ---------------- */

function labelForMode(mode: "t2i" | "i2i") {
  return mode === "i2i" ? "Image to Image" : "Text to Image";
}

function timeAgo(ts: number) {
  const delta = Date.now() - ts;
  const mins = Math.floor(delta / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
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
