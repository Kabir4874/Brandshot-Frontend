"use client";

import {
  archiveProject,
  listProjectsByOwner,
  renameProject,
} from "@/api/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useDashboardFilters } from "@/shared/dashboardFilters";
import { Project } from "@/types/project";
import Link from "next/link";
import * as React from "react";

const asStringArray = (v: unknown, fallback: string[] = ["All"]): string[] =>
  Array.isArray(v) && v.length ? v.map(String) : fallback;

export default function ProjectsTable() {
  const { user } = useAuth();
  const [rows, setRows] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // rename dialog state
  const [renOpen, setRenOpen] = React.useState(false);
  const [renId, setRenId] = React.useState<string | null>(null);
  const [renName, setRenName] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const { query, tags: storeTags, dateSort } = useDashboardFilters();
  const filterTags = React.useMemo(() => asStringArray(storeTags), [storeTags]);

  const { setAvailableTags } = useDashboardFilters();

  React.useEffect(() => {
    if (rows.length) {
      const tags = rows.flatMap((r) => r.tags ?? []);
      setAvailableTags(tags);
    }
  }, [rows, setAvailableTags]);

  const refresh = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const list = await listProjectsByOwner(user.uid, false);
      setRows(list);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  // filtering (search + tags + date range/sort)
  const filtered = React.useMemo(() => {
    let arr = rows.slice();

    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((r) => {
        const name = r.name?.toLowerCase() ?? "";
        const client = r.client?.toLowerCase() ?? "";
        const tagsJoined = (r.tags ?? []).join(" ").toLowerCase();
        return name.includes(q) || client.includes(q) || tagsJoined.includes(q);
      });
    }

    if (!(filterTags.length === 1 && filterTags[0] === "All")) {
      const set = new Set(filterTags.map((t) => t.toLowerCase()));
      arr = arr.filter((r) =>
        (r.tags ?? []).some((t) => set.has(String(t).toLowerCase()))
      );
    }

    const now = Date.now();
    if (dateSort === "newest") {
      arr.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } else if (dateSort === "oldest") {
      arr.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
    } else if (dateSort === "7d") {
      const cutoff = now - 7 * 24 * 60 * 60 * 1000;
      arr = arr.filter((r) => (r.createdAt ?? 0) >= cutoff);
      arr.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } else if (dateSort === "30d") {
      const cutoff = now - 30 * 24 * 60 * 60 * 1000;
      arr = arr.filter((r) => (r.createdAt ?? 0) >= cutoff);
      arr.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }

    return arr;
  }, [rows, query, filterTags, dateSort]);

  // rename flow
  function openRename(r: Project) {
    setRenId(r.id);
    setRenName(r.name);
    setRenOpen(true);
  }

  async function saveRename() {
    if (!renId || !renName.trim()) return;
    setSaving(true);
    try {
      await renameProject(renId, renName.trim());
      setRenOpen(false);
      setRenId(null);
      setRenName("");
      refresh();
    } finally {
      setSaving(false);
    }
  }

  async function onArchive(id: string) {
    await archiveProject(id, true);
    refresh();
  }

  return (
    <section className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Projects</h2>

        {error && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg ring-1 ring-nano-deep-900/80">
          <Table className="[&_th]:text-left">
            <TableHeader className="bg-transparent">
              <TableRow className="border-0 border-b border-nano-deep-900/80">
                <TableHead className="h-12 px-6 text-[13px] font-semibold text-nano-gray-100">
                  Project
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Client/Site
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Service Tags
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Created
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Generations
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-8 text-[13px] text-nano-gray-100/85"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-8 text-[13px] text-nano-gray-100/85"
                  >
                    No matching projects.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row, idx) => (
                  <ProjectsRow
                    key={row.id}
                    row={row}
                    isLast={idx === filtered.length - 1}
                    onRename={() => openRename(row)}
                    onArchive={() => onArchive(row.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Rename dialog */}
      <Dialog open={renOpen} onOpenChange={setRenOpen}>
        <DialogContent className="border-nano-forest-800 bg-nano-olive-700/20 text-nano-white">
          <DialogHeader>
            <DialogTitle className="text-white">Rename Project</DialogTitle>
          </DialogHeader>
          <Input
            value={renName}
            onChange={(e) => setRenName(e.target.value)}
            className="h-11 rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-nano-gray-100/60 focus-visible:ring-0"
          />
          <DialogFooter>
            <Button
              variant="ghost"
              className="h-9 rounded-md bg-transparent px-3 text-[13px] text-nano-mint hover:bg-nano-deep-900"
              onClick={() => setRenOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="h-9 rounded-md bg-emerald-500 px-4 text-[13px] font-semibold text-black hover:bg-emerald-500/90 disabled:opacity-70"
              onClick={saveRename}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ProjectsRow({
  row,
  isLast,
  onRename,
  onArchive,
}: {
  row: Project;
  isLast?: boolean;
  onRename: () => void;
  onArchive: () => void;
}) {
  return (
    <TableRow
      className={cn("border-0", !isLast && "border-b border-nano-deep-900/80")}
    >
      <TableCell
        className="h-[76px] px-6 align-middle text-[14px] text-white"
        onDoubleClick={onRename}
        title="Double-click to rename"
      >
        {row.name}
      </TableCell>

      <TableCell className="px-6 align-middle text-[14px] text-nano-mint/85">
        {row.client || "—"}
      </TableCell>

      <TableCell className="px-6 align-middle">
        {row.tags?.length ? (
          <span className="inline-flex items-center rounded-full bg-nano-forest-800 px-3 py-1 text-[13px] font-semibold text-nano-gray-100">
            {row.tags.join(", ")}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-nano-forest-800 px-3 py-1 text-[13px] font-semibold text-nano-gray-100">
            General
          </span>
        )}
      </TableCell>

      <TableCell className="px-6 align-middle text-[14px] text-nano-gray-100/90">
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
      </TableCell>

      <TableCell className="px-6 align-middle text-[14px] text-nano-gray-100/90">
        {row.totalGenerations ?? 0}
      </TableCell>

      <TableCell className="px-6 align-middle">
        <div className="text-right md:text-left">
          <Link
            href={`/project/${row.id}`}
            className="block text-[13px] font-semibold text-nano-gray-100 hover:underline"
          >
            View Project
          </Link>
          <span className="block text-[13px] font-semibold text-nano-gray-100">
            |{" "}
            <button
              onClick={onArchive}
              className="hover:underline cursor-pointer"
            >
              Archive Project
            </button>
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}
