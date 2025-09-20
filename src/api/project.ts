"use client";

import { db } from "@/lib/firebase";
import { Project } from "@/types/project";
import {
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const PROJECTS = "projects";

export async function createProject(input: {
  ownerId: string;
  name: string;
  client?: string;
  tags?: string[];
}): Promise<Project> {
  const now = Date.now();
  const ref = await addDoc(collection(db, PROJECTS), {
    name: input.name,
    client: input.client ?? "",
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
    totalGenerations: 0,
    ownerId: input.ownerId,
    archived: false,
  });
  return {
    id: ref.id,
    name: input.name,
    client: input.client ?? "",
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
    totalGenerations: 0,
    ownerId: input.ownerId,
    archived: false,
  };
}

/**
 * Lists projects for an owner. Tries indexed query first:
 *   where(ownerId==), where(archived==), orderBy(updatedAt desc)
 * If Firestore complains "requires an index", we retry WITHOUT orderBy
 * and sort client-side. We also log the index creation link to console.
 */
export async function listProjectsByOwner(ownerId: string, archived = false) {
  const base = [
    where("ownerId", "==", ownerId),
    where("archived", "==", archived),
  ] as QueryConstraint[];

  try {
    // Preferred query (requires composite index)
    const q1 = query(
      collection(db, PROJECTS),
      ...base,
      orderBy("updatedAt", "desc")
    );
    const snap = await getDocs(q1);
    const rows: Project[] = [];
    snap.forEach((d) =>
      rows.push({ id: d.id, ...(d.data() as Omit<Project, "id">) })
    );
    return rows;
  } catch (err: any) {
    // If it’s the common missing-index error, log the link and fallback
    if (
      typeof err?.message === "string" &&
      (err.message.includes("requires an index") ||
        err.code === "failed-precondition")
    ) {
      // Firestore usually includes a direct link to create the index in err.message
      // Surfacing it helps you click once and fix permanently.

      console.warn(
        "[Firestore] Missing composite index for (ownerId, archived, updatedAt). " +
          "Open the console error for a 'Create index' link and enable it in Firebase Console.",
        err
      );

      // Fallback: same filters, no orderBy; then sort on the client
      const q2 = query(collection(db, PROJECTS), ...base);
      const snap = await getDocs(q2);
      const rows: Project[] = [];
      snap.forEach((d) =>
        rows.push({ id: d.id, ...(d.data() as Omit<Project, "id">) })
      );
      rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      return rows;
    }

    // Re-throw any other error so your UI can show the existing message
    throw err;
  }
}

export async function renameProject(projectId: string, newName: string) {
  await updateDoc(doc(db, PROJECTS, projectId), {
    name: newName,
    updatedAt: Date.now(),
  });
}

export async function archiveProject(projectId: string, archived: boolean) {
  await updateDoc(doc(db, PROJECTS, projectId), {
    archived,
    updatedAt: Date.now(),
  });
}

export async function getProject(projectId: string): Promise<Project | null> {
  const d = await getDoc(doc(db, PROJECTS, projectId));
  if (!d.exists()) return null;
  return { id: d.id, ...(d.data() as Omit<Project, "id">) };
}

export async function deleteProject(projectId: string) {
  await deleteDoc(doc(db, PROJECTS, projectId));
}
