"use client";

import { friendlyAuthError } from "@/lib/authErrors";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

export async function doSignUp(name: string, email: string, password: string) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(res.user, { displayName: name });
    return { user: res.user };
  } catch (e: any) {
    return { error: friendlyAuthError(e?.code) };
  }
}

export async function doSignIn(email: string, password: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return { user: res.user };
  } catch (e: any) {
    return { error: friendlyAuthError(e?.code) };
  }
}

export async function doResetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (e: any) {
    return { error: friendlyAuthError(e?.code) };
  }
}

export async function doSignOut() {
  try {
    await signOut(auth);
    return { ok: true };
  } catch {
    return { error: "Could not sign out. Please try again." };
  }
}
