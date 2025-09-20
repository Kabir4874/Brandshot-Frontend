"use client";

import {
  archiveProject,
  deleteProject,
  listProjectsByOwner,
} from "@/api/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/providers/AuthProvider";
import { Project } from "@/types/project";
import Link from "next/link";
import * as React from "react";

export default function ArchivedProjectsTable() {
  const { user } = useAuth();
  const [rows, setRows] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // delete dialog
  const [delOpen, setDelOpen] = React.useState(false);
  const [delId, setDelId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const refresh = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const list = await listProjectsByOwner(user.uid, true); // archived = true
      setRows(list);
    } catch {
      setError("Failed to load archived projects.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  async function onUnarchive(id: string) {
    await archiveProject(id, false);
    refresh();
  }

  function openDelete(id: string) {
    setDelId(id);
    setDelOpen(true);
  }

  async function confirmDelete() {
    if (!delId) return;
    setDeleting(true);
    try {
      await deleteProject(delId);
      setDelOpen(false);
      setDelId(null);
      refresh();
    } catch {
      // optional toast
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-10">
        {/* Header row with back link */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Archived Projects
          </h2>
          <Link
            href="/"
            className="h-8 inline-flex items-center rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95"
          >
            Back to Dashboard
          </Link>
        </div>

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
              ) : rows.length === 0 ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-8 text-[13px] text-nano-gray-100/85"
                  >
                    No archived projects.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-0 border-b border-nano-deep-900/80"
                  >
                    <TableCell className="h-[76px] px-6 align-middle text-[14px] text-white">
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
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-6 align-middle text-[14px] text-nano-gray-100/90">
                      {row.totalGenerations ?? 0}
                    </TableCell>

                    <TableCell className="px-6 align-middle">
                      <div className="flex items-center gap-3 text-[13px] font-semibold text-nano-gray-100">
                        <button
                          className="hover:underline cursor-pointer"
                          onClick={() => onUnarchive(row.id)}
                          title="Unarchive"
                        >
                          Unarchive
                        </button>
                        <span className="opacity-70">|</span>
                        <button
                          className="hover:underline text-red-300 cursor-pointer"
                          onClick={() => openDelete(row.id)}
                          title="Delete permanently"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirm Delete */}
      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent className="border-nano-forest-800 bg-nano-olive-700/20 text-nano-white">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-nano-gray-100/85">
            This will permanently delete the project document.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              className="h-9 rounded-md bg-transparent px-3 text-[13px] text-nano-mint"
              onClick={() => setDelOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              className="h-9 rounded-md bg-red-500 px-4 text-[13px] font-semibold text-white hover:bg-red-500/90 disabled:opacity-70"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
