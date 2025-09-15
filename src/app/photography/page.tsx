"use client";

import { useEffect, useState } from "react";
import * as RdxSlider from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function ProductPhotography() {
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState(50);
  const [steps, setSteps] = useState(25);
  const [aiLabels, setAiLabels] = useState(true);
  const [progress, setProgress] = useState(42); // demo value

  // demo ticking progress while “generating”
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 42 : p + 1));
    }, 120);
    return () => clearInterval(t);
  }, []);

  const IMAGES = [
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1619158401201-c5a3a089b8f1?q=80&w=1200&auto=format&fit=crop",
  ];

  return (
    <main className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-16">
        {/* Title + subtitle */}
        <header className="mb-5">
          <h1 className="text-3xl font-extrabold leading-none tracking-tight">
            Product Photography
          </h1>
          <p className="mt-1 text-[13px] text-nano-gray-100/85">
            Generate high-quality product images for your marketing campaigns.
          </p>
        </header>

        {/* Prompt areas */}
        <section className="mb-6">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder=" "
            className="mb-3 h-36 w-[620px] max-w-full resize-none rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-transparent focus-visible:ring-0"
          />
          <Input
            placeholder=" "
            className="h-9 w-[420px] max-w-full rounded-md border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-transparent focus-visible:ring-0"
          />
        </section>

        {/* Controls grid */}
        <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Seed slider + value */}
          <div className="flex items-center gap-6">
            <div className="min-w-[80px] text-[13px] text-nano-gray-100/85">
              Seed
            </div>
            <div className="flex w-full items-center gap-4">
              <ThinSlider value={seed} onChange={(v) => setSeed(v)} />
              <span className="w-8 text-right text-[13px] text-nano-gray-100/85">
                {seed}
              </span>
            </div>
          </div>

          {/* Steps slider + value */}
          <div className="flex items-center gap-6">
            <div className="min-w-[80px] text-[13px] text-nano-gray-100/85">
              Steps
            </div>
            <div className="flex w-full items-center gap-4">
              <ThinSlider value={steps} onChange={(v) => setSteps(v)} />
              <span className="w-8 text-right text-[13px] text-nano-gray-100/85">
                {steps}
              </span>
            </div>
          </div>

          {/* AI labels toggle */}
          <div className="md:col-span-2 flex items-center justify-between">
            <div className="text-[13px] text-nano-gray-100/85">
              AI-edited labels on generated images
            </div>
            <Switch
              checked={aiLabels}
              onCheckedChange={setAiLabels}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </section>

        {/* Action buttons */}
        <section className="mb-6 flex items-center gap-3">
          <Button className="h-8 rounded-full bg-nano-olive-700 px-3 text-[13px] font-medium text-nano-mint hover:bg-nano-deep-900">
            Auto-Scenario
          </Button>
          <Button className="h-8 rounded-full bg-emerald-500 px-3 text-[13px] font-semibold text-black hover:bg-emerald-500/90">
            Generate
          </Button>
        </section>

        {/* Progress */}
        <section className="mb-7">
          <div className="mb-2 text-[13px] text-nano-gray-100/85">
            Generating Images
          </div>
          <ThinProgress value={progress} />
        </section>

        {/* Gallery */}
        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-nano-gray-100">
            Generated Images
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {IMAGES.slice(0, 5).map((src) => (
              <figure
                key={src}
                className="aspect-[4/3] overflow-hidden rounded-lg bg-nano-olive-700 ring-1 ring-nano-forest-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Generated product"
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>

          {/* second row left image */}
          <div className="mt-4 grid max-w-[220px] grid-cols-1">
            <figure className="aspect-[4/3] overflow-hidden rounded-lg bg-nano-olive-700 ring-1 ring-nano-forest-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGES[5]}
                alt="Generated product"
                className="h-full w-full object-cover"
              />
            </figure>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- Custom thin slider & progress (match mock exactly) ---------- */

function ThinSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <RdxSlider.Root
      value={[value]}
      onValueChange={(v) => onChange(v[0])}
      min={0}
      max={100}
      step={1}
      className="relative flex w-full touch-none select-none items-center"
    >
      {/* Track (deep green) */}
      <RdxSlider.Track className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-nano-forest-800">
        {/* Filled range (white) */}
        <RdxSlider.Range className="absolute h-full bg-white" />
      </RdxSlider.Track>

      {/* Hide thumb (keeps keyboard accessibility) */}
      <RdxSlider.Thumb
        aria-label="Slider handle"
        className="block h-0 w-0 rounded-full bg-transparent outline-none ring-0"
      />
    </RdxSlider.Root>
  );
}

function ThinProgress({ value }: { value: number }) {
  return (
    <div className="relative h-[8px] w-full overflow-hidden rounded-full bg-nano-forest-800">
      <div
        className="absolute left-0 top-0 h-full bg-white"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
