// src/api/generation.ts
"use client";

import { db } from "@/lib/firebase";
import { Generation } from "@/types/generation";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

/**
 * Firestore subcollection under /projects/{projectId}/generations
 * Each generation doc should look like:
 * {
 *   prompt: string,
 *   mode: "t2i" | "i2i",
 *   thumbUrl?: string,   // a small remote url or dataURL
 *   createdAt: number
 * }
 */

export async function listGenerationsByProject(
  projectId: string,
  opts?: { cap?: number }
): Promise<Generation[]> {
  const cap = opts?.cap ?? 200;

  const q = query(
    collection(db, "projects", projectId, "generations"),
    orderBy("createdAt", "desc"),
    limit(cap)
  );

  const snap = await getDocs(q);
  const rows: Generation[] = [];
  snap.forEach((d) => {
    const data = d.data() as Omit<Generation, "id" | "projectId">;
    rows.push({
      id: d.id,
      projectId,
      prompt: data.prompt ?? "",
      mode: (data.mode as Generation["mode"]) ?? "t2i",
      thumbUrl: data.thumbUrl ?? "",
      createdAt: data.createdAt ?? Date.now(),
    });
  });

  return rows;
}
