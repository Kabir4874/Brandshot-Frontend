"use client";

import { db } from "@/lib/firebase";
import type { PresetCategory, PromptPreset } from "@/types/user";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const USERS = "users";
const PRESETS = "presets";

export async function getPreset(
  uid: string,
  category: PresetCategory
): Promise<PromptPreset | null> {
  const ref = doc(collection(db, USERS, uid, PRESETS), category);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as PromptPreset;
}

export async function savePreset(
  uid: string,
  category: PresetCategory,
  data: Omit<PromptPreset, "updatedAt">
) {
  const ref = doc(collection(db, USERS, uid, PRESETS), category);
  await setDoc(ref, { ...data, updatedAt: Date.now() }, { merge: true });
}
