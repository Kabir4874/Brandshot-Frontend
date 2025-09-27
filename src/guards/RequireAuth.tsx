"use client";

import { useAuth } from "@/providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/signin?next=${next}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-nano-gray-100/85">
        Checking session…
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
