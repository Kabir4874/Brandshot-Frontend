"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Download from "../assets/icons/download.png";
import Logo from "../assets/icons/logo.png";

export default function NanoBananaNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/generations", label: "Generations" },
    { href: "/templates", label: "Templates" },
    { href: "/assets", label: "Assets" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const handleAvatarClick = () => {
    if (!user) router.push("/signin");
    else router.push("/settings");
    setOpen(false);
  };

  const fallback = (user?.displayName || "NB")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Fixed top nav */}
      <div className="fixed inset-x-0 top-0 z-50 w-full border-b border-nano-gray-100 bg-white py-2 text-nano-deep-900 dark:border-nano-deep-900 dark:bg-nano-deep-950 dark:text-nano-white">
        <nav
          role="navigation"
          aria-label="Main Navigation"
          className="mx-auto max-w-[1400px] px-4 md:px-6"
        >
          <div className="flex h-12 items-center gap-3 md:gap-6">
            {/* Brand: show text only on desktop; logo only on tablet */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-nano-deep-900/5 dark:bg-white/10">
                <Image src={Logo} width={14} height={14} alt="logo" />
              </div>
              <span className="hidden select-none text-sm font-semibold tracking-tight text-nano-deep-900/95 dark:text-white/95 lg:inline">
                Nano Banana Studio
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-5 text-[13px] text-nano-deep-900/70 dark:text-white/70 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? "font-semibold text-nano-deep-900 dark:text-white"
                      : "hover:text-nano-deep-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3 md:gap-4">
              {/* Desktop search */}
              <div className="relative hidden sm:block">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-nano-deep-900/40 dark:text-white/40"
                />
                <Input
                  aria-label="Search"
                  placeholder="Search"
                  className="h-9 w-[220px] rounded-md border border-nano-gray-100 bg-white pl-8 text-[13px] text-nano-deep-900 placeholder:text-nano-deep-900/45 focus-visible:border-nano-deep-900/20 focus-visible:ring-0 md:w-[260px] dark:border-nano-deep-900 dark:bg-nano-deep-900/80 dark:text-white dark:placeholder:text-nano-mint/45 dark:focus-visible:border-white/20"
                />
              </div>

              {/* Desktop avatar (click -> signin/settings) */}
              <button
                type="button"
                onClick={handleAvatarClick}
                className="hidden md:inline-flex"
                aria-label={user ? "Open settings" : "Sign in"}
              >
                <Avatar className="h-8 w-8 ring-1 ring-nano-gray-100 dark:ring-nano-deep-900">
                  <AvatarImage src={user?.photoURL || ""} alt="Profile" />
                  <AvatarFallback className="bg-nano-gray-100 text-[11px] text-nano-deep-900 dark:bg-white/10 dark:text-white">
                    {user?.photoURL
                      ? null
                      : fallback || (
                          <Image
                            src={Download}
                            width={16}
                            height={16}
                            alt="download icon"
                          />
                        )}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                className="inline-flex items-center justify-center rounded-md p-2 text-nano-deep-900 dark:text-white md:hidden"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer under fixed nav */}
      <div className="h-[56px]" />

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-[56px] z-40 origin-top transform bg-white/98 backdrop-blur-sm transition-all duration-200 dark:bg-nano-deep-950/98 md:hidden ${
          open
            ? "scale-y-100 opacity-100"
            : "pointer-events-none scale-y-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 pb-4 pt-3">
          {/* Search (mobile) */}
          <div className="relative my-3">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-nano-deep-900/40 dark:text-white/40"
            />
            <Input
              aria-label="Search"
              placeholder="Search"
              className="h-10 w-full rounded-md border border-nano-gray-100 bg-white pl-8 text-[13px] text-nano-deep-900 placeholder:text-nano-deep-900/45 focus-visible:border-nano-deep-900/20 focus-visible:ring-0 dark:border-nano-deep-900 dark:bg-nano-deep-900/80 dark:text-white dark:placeholder:text-nano-mint/45 dark:focus-visible:border-white/20"
            />
          </div>

          {/* Links (no Settings here) */}
          <nav className="space-y-2 text-[14px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-md px-2 py-2 ${
                  isActive(link.href)
                    ? "bg-nano-gray-100 text-nano-deep-900 font-semibold dark:bg-white/10 dark:text-white"
                    : "text-nano-deep-900/80 hover:bg-nano-gray-100/70 hover:text-nano-deep-900 dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + avatar (mobile) */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleAvatarClick}
              aria-label={user ? "Open settings" : "Sign in"}
            >
              <Avatar className="h-8 w-8 ring-1 ring-nano-gray-100 dark:ring-nano-deep-900">
                <AvatarImage src={user?.photoURL || ""} alt="Profile" />
                <AvatarFallback className="bg-nano-gray-100 text-[11px] text-nano-deep-900 dark:bg-white/10 dark:text-white">
                  {user?.photoURL
                    ? null
                    : fallback || (
                        <Image
                          src={Download}
                          width={16}
                          height={16}
                          alt="download icon"
                        />
                      )}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay close */}
      {open && (
        <button
          aria-label="Close menu overlay"
          className="fixed inset-0 z-30 block bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
