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
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const USERS = "users";

function presetsCol(uid: string) {
  return collection(db, USERS, uid, "presets");
}

export async function getUserDoc(uid: string): Promise<AppUserDoc | null> {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid: snap.id, ...(snap.data() as Omit<AppUserDoc, "uid">) };
}

export async function upsertUserProfile(
  uid: string,
  data: Partial<AppUserDoc>
) {
  const now = Date.now();

  const safe = cleanForFirestore({
    ...data,
    updatedAt: now,
  });

  const ref = doc(db, USERS, uid);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    const base: AppUserDoc = {
      uid,
      email: data.email ?? "",
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

export async function setOpenRouterKey(uid: string, key: string | null) {
  const value =
    typeof key === "string" && key.trim().length > 0 ? key.trim() : null;
  await setDoc(
    doc(db, USERS, uid),
    { openrouterKey: value, openrouterKeyUpdatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function getOpenRouterKey(uid: string): Promise<string | null> {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as { openrouterKey?: string | null };
  const key = data?.openrouterKey ?? null;
  return typeof key === "string" && key.trim().length > 0 ? key : null;
}

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

export async function updatePreset(
  uid: string,
  id: string,
  patch: Partial<PromptPreset>
) {
  const ref = doc(db, USERS, uid, "presets", id);
  const safe = cleanForFirestore({ ...patch, updatedAt: Date.now() });
  return updateDoc(ref, safe);
}

/** Theme preference */
export async function setUserTheme(uid: string, theme: "light" | "dark") {
  const ref = doc(db, USERS, uid);
  await setDoc(ref, { theme }, { merge: true });
}
