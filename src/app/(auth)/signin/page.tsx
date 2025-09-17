"use client";

import { doSignIn } from "@/api/auth";
import Logo from "@/assets/icons/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { user, error } = await doSignIn(email.trim(), pass);
    setLoading(false);
    if (error) return setError(error);
    if (user) router.replace("/");
  }

  return (
    <main className="min-h-screen bg-nano-deep-950 text-nano-white">
      <div className="mx-auto flex min-h-screen max-w-[1100px] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px] rounded-2xl border border-nano-forest-800/70 bg-nano-olive-700/20 p-6 backdrop-blur-sm">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
              <Image src={Logo} width={14} height={14} alt="logo" />
            </div>
            <div className="text-sm font-semibold tracking-tight text-white/95">
              Nano Banana Studio
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold leading-none">Sign in</h1>
            <p className="mt-1 text-[13px] text-nano-gray-100/85">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
              {error}
            </div>
          )}

          {/* Form */}
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

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[13px] text-nano-gray-100"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="h-11 w-full rounded-lg border border-nano-forest-800 bg-nano-olive-700 pr-10 text-[14px] text-nano-gray-100 placeholder:text-nano-gray-100/60 focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nano-mint/70 hover:text-nano-mint"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/reset-password"
                className="text-[13px] text-nano-mint hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-1">
              <Button
                disabled={loading}
                className="h-11 w-full rounded-lg bg-emerald-500 text-[14px] font-semibold text-black hover:bg-emerald-500/90 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[13px] text-nano-gray-100/85">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-nano-mint hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
