import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Logo from "../assets/icons/logo.png";
import Download from "../assets/icons/download.png";

import Image from "next/image";

export default function NanoBananaNavbar() {
  return (
    <div className="w-full bg-nano-deep-950 text-white">
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className="mx-auto max-w-[1400px] px-4 md:px-6"
      >
        {/* bar */}
        <div className="flex h-12 items-center gap-3 md:gap-6">
          {/* brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
              <Image src={Logo} width={14} height={14} alt="logo" />
            </div>
            <span className="select-none text-sm font-semibold tracking-tight text-white/95">
              Nano Banana Studio
            </span>
          </div>

          {/* links */}
          <div className="hidden md:flex items-center gap-5 text-[13px] text-white/70">
            <a href="#" className="transition-colors hover:text-white">
              Dashboard
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Generations
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Templates
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Assets
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Settings
            </a>
          </div>

          <div className="ml-auto flex items-center gap-3 md:gap-4">
            {/* search */}
            <div className="relative hidden sm:block">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              />
              <Input
                aria-label="Search"
                placeholder="Search"
                className="h-9 w-[220px] md:w-[260px] rounded-md border border-nano-deep-900 bg-nano-deep-900/80 pl-8 text-[13px] text-white placeholder:text-nano-mint/45 focus-visible:ring-0 focus-visible:border-white/20"
              />
            </div>

            {/* CTA */}
            <Button
              size="sm"
              className="h-9 rounded-md bg-emerald-500 px-4 text-[13px] font-semibold text-black shadow-none hover:bg-emerald-500/90"
            >
              New Project
            </Button>

            {/* avatar */}
            <Avatar className="h-8 w-8 ring-1 ring-nano-deep-900">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-white/10 text-white">
                <Image
                  src={Download}
                  width={16}
                  height={16}
                  alt="download button"
                />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>
    </div>
  );
}
