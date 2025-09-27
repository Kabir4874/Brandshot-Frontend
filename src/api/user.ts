"use client";

import { db } from "@/lib/firebase";
import { cleanForFirestore } from "@/lib/firestoreClean";
import { AppUserDoc, PromptPreset } from "@/types/user";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

/** USERS collection */
const USERS = "users";

/** /users/{uid}/presets subcollection */
function presetsCol(uid: string) {
  return collection(db, USERS, uid, "presets");
}

export async function getUserDoc(uid: string): Promise<AppUserDoc | null> {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid: snap.id, ...(snap.data() as Omit<AppUserDoc, "uid">) };
}

/**
 * Upserts (creates or updates) a user profile safely.
 * Strips undefined/NaN and uses merge to avoid overwriting other fields.
 */
export async function upsertUserProfile(
  uid: string,
  data: Partial<AppUserDoc>
) {
  const now = Date.now();

  // Never pass undefined to Firestore
  const safe = cleanForFirestore({
    ...data,
    updatedAt: now,
  });

  const ref = doc(db, USERS, uid);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    const base: AppUserDoc = {
      uid,
      email: data.email ?? "", // ensure string, not undefined
      displayName: data.displayName ?? "",
      photoURL: data.photoURL ?? null,
      plan: data.plan ?? "free",
      createdAt: now,
      updatedAt: now,
    };
    return setDoc(ref, cleanForFirestore(base), { merge: true });
  }

  return setDoc(ref, safe, { merge: true });
}

/** Get all presets for a user (optionally by category) */
export async function listPresets(
  uid: string,
  category?: PromptPreset["category"]
) {
  let q = query(presetsCol(uid), orderBy("updatedAt", "desc"));
  if (category) {
    q = query(
      presetsCol(uid),
      where("category", "==", category),
      orderBy("updatedAt", "desc")
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PromptPreset, "id">),
  }));
}

/** Create a new preset */
export async function createPreset(
  uid: string,
  preset: Omit<PromptPreset, "id" | "createdAt" | "updatedAt">
) {
  const now = Date.now();
  const payload: PromptPreset = {
    ...preset,
    createdAt: now,
    updatedAt: now,
  };
  return addDoc(presetsCol(uid), cleanForFirestore(payload));
}

/** Update an existing preset */
export async function updatePreset(
  uid: string,
  id: string,
  patch: Partial<PromptPreset>
) {
  const ref = doc(db, USERS, uid, "presets", id);
  const safe = cleanForFirestore({ ...patch, updatedAt: Date.now() });
  return updateDoc(ref, safe);
}
