"use client";

import { createProject } from "@/api/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { DateSort, useDashboardFilters } from "@/shared/dashboardFilters";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const TAG_OPTIONS = ["Design", "Research", "Development", "Marketing"] as const;

function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(String);
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(String);
      if (parsed && typeof parsed === "string") return [parsed];
    } catch {
      if (input.trim()) return [input.trim()];
    }
  }
  return ["All"];
}

export default function DashboardHeader() {
  const { user } = useAuth();
  const {
    query,
    setQuery,
    tags: storeTags,
    setTags,
    dateSort,
    setDateSort,
    availableTags,
  } = useDashboardFilters();

  const activeTags = React.useMemo(() => normalizeTags(storeTags), [storeTags]);

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [client, setClient] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [selTags, setSelTags] = React.useState<string[]>([]);
  const [customTag, setCustomTag] = React.useState("");

  const toggleFilterTag = (t: string) => {
    setTags((prev) => {
      const cur = normalizeTags(prev);
      if (t === "All") return ["All"];
      const withoutAll = cur.filter((x) => x !== "All");
      const has = withoutAll.includes(t);
      const next = has ? withoutAll.filter((x) => x !== t) : [...withoutAll, t];
      return next.length ? next : ["All"];
    });
  };

  const toggleDialogTag = (t: string) =>
    setSelTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const addCustomTag = () => {
    const t = customTag.trim();
    if (!t) return;
    setSelTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setCustomTag("");
  };



  async function handleCreate() {
    if (!user) return;
    if (!name.trim()) {
      setErr("Project name is required.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await createProject({
        ownerId: user.uid,
        name: name.trim(),
        client: client.trim() || undefined,
        tags: selTags,
      });
      setOpen(false);
      setName("");
      setClient("");
      setSelTags([]);
      setCustomTag("");
    } catch {
      setErr("Could not create project. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-4">
        {/* Title + CTAs (added subtle 'Archived' link) */}
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold leading-none tracking-tight">
            Dashboard
          </h1>

          <div className="flex items-center gap-2">
            {/* Archived Page */}
            <Link
              href="/archived"
              className="h-8 inline-flex items-center rounded-md bg-nano-forest-800/60 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/80"
            >
              Archived
            </Link>

            {/* Create */}
            <Button
              size="sm"
              className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-semibold text-nano-gray-100 hover:bg-nano-forest-800/95"
              onClick={() => setOpen(true)}
            >
              Create New Project
            </Button>
          </div>
        </div>

        {/* Search */}
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

        {/* Filters */}
        <div className="mt-3 flex flex-wrap gap-3">
          {/* Tags */}
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
              <DropdownMenuCheckboxItem
                key="All"
                checked={activeTags.includes("All")}
                onCheckedChange={() => toggleFilterTag("All")}
                className="cursor-pointer rounded-[6px] text-[13px] focus:bg-nano-deep-900 focus:text-nano-gray-100 data-[state=checked]:bg-nano-deep-900"
              >
                All
              </DropdownMenuCheckboxItem>
              {availableTags.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={activeTags.includes(t)}
                  onCheckedChange={() => toggleFilterTag(t)}
                  className="cursor-pointer rounded-[6px] text-[13px] focus:bg-nano-deep-900 focus:text-nano-gray-100 data-[state=checked]:bg-nano-deep-900"
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date */}
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

      {/* Create Project dialog — unchanged except for the code above */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-nano-forest-800 bg-nano-olive-700 text-nano-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create Project</DialogTitle>
          </DialogHeader>

          {err && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
              {err}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] text-nano-gray-100">
                Project name
              </Label>
              <Input
                placeholder="e.g. Autumn Launch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-nano-gray-100/60 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] text-nano-gray-100">
                Client / Site
              </Label>
              <Input
                placeholder="e.g. nanobanana.com"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="h-11 rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-nano-gray-100/60 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] text-nano-gray-100">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((t) => {
                  const active = selTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleDialogTag(t)}
                      className={[
                        "h-8 rounded-md px-3 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-nano-forest-800 text-nano-gray-100"
                          : "bg-nano-olive-700 text-nano-mint hover:bg-nano-deep-900",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Input
                  placeholder="Add custom tag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTag();
                    }
                  }}
                  className="h-10 max-w-[260px] rounded-md border border-nano-forest-800 bg-nano-olive-700 text-[13px] text-nano-gray-100 placeholder:text-nano-gray-100/60 focus-visible:ring-0"
                />
                <Button
                  type="button"
                  onClick={addCustomTag}
                  className="h-9 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              className="h-9 rounded-md bg-transparent px-3 text-[13px] text-nano-mint hover:bg-nano-deep-900"
              onClick={() => setOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              className="h-9 rounded-md bg-emerald-500 px-4 text-[13px] font-semibold text-black hover:bg-emerald-500/90 disabled:opacity-70"
              onClick={handleCreate}
              disabled={busy}
            >
              {busy ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
