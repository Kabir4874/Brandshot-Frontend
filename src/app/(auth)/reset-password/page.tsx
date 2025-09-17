"use client";

import { doResetPassword } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    setLoading(true);
    const { ok, error } = await doResetPassword(email.trim());
    setLoading(false);
    if (error) return setError(error);
    if (ok) setMsg("Password reset email sent. Check your inbox.");
  }

  return (
    <main className="min-h-screen bg-nano-deep-950 text-nano-white">
      <div className="mx-auto flex min-h-screen max-w-[1100px] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px] rounded-2xl border border-nano-forest-800/70 bg-nano-olive-700/20 p-6 backdrop-blur-sm">
          <h1 className="mb-1 text-2xl font-extrabold leading-none">
            Reset password
          </h1>
          <p className="mb-6 text-[13px] text-nano-gray-100/85">
            Enter your email and we’ll send you a reset link.
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
              {error}
            </div>
          )}
          {msg && (
            <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-200">
              {msg}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] text-nano-gray-100">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-nano-gray-100/60 focus-visible:ring-0"
              />
            </div>

            <Button
              disabled={loading}
              className="h-11 w-full rounded-lg bg-emerald-500 text-[14px] font-semibold text-black hover:bg-emerald-500/90 disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-nano-gray-100/85">
            Back to{" "}
            <Link href="/signin" className="text-nano-mint hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
