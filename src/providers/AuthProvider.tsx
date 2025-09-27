"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useContext, useState } from "react";

type Ctx = { user: User | null; loading: boolean };
const AuthCtx = React.createContext<Ctx>({ user: null, loading: true });

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      console.log(u, "u");
      setUser(u ?? null);
      setLoading(false);
    });
  }, []);
  console.log(user, "auth user");
  return (
    <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
