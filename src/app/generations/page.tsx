"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import * as RdxSlider from "@radix-ui/react-slider";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Generations() {
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState(50);
  const [steps, setSteps] = useState(25);
  const [aiLabels, setAiLabels] = useState(true);
  const [progress, setProgress] = useState(42);

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
        {/* --------------Title + subtitle-------------- */}
        <header className="mb-5">
          <h1 className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight">
            Product Photography Generations
          </h1>
          <p className="mt-1 text-[13px] text-nano-gray-100/85">
            Generate high-quality product images for your marketing campaigns.
          </p>
        </header>

        {/* --------------Prompt areas-------------- */}
        <section className="mb-6">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder=" "
            aria-label="Main prompt"
            className="mb-3 h-36 w-full md:w-[620px] max-w-full resize-none rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-transparent focus-visible:ring-0"
          />
          <Input
            placeholder=" "
            aria-label="Short prompt"
            className="h-9 w-full md:w-[420px] max-w-full rounded-md border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-transparent focus-visible:ring-0"
          />
        </section>

        {/* --------------Controls grid-------------- */}
        <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* --------------Seed slider + value-------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
            <div className="sm:min-w-[80px] text-[13px] text-nano-gray-100/85">
              Seed
            </div>
            <div className="flex w-full items-center gap-3">
              <ThinSlider value={seed} onChange={(v) => setSeed(v)} />
              <span className="w-10 text-right text-[13px] text-nano-gray-100/85">
                {seed}
              </span>
            </div>
          </div>

          {/* --------------Steps slider + value-------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
            <div className="sm:min-w-[80px] text-[13px] text-nano-gray-100/85">
              Steps
            </div>
            <div className="flex w-full items-center gap-3">
              <ThinSlider value={steps} onChange={(v) => setSteps(v)} />
              <span className="w-10 text-right text-[13px] text-nano-gray-100/85">
                {steps}
              </span>
            </div>
          </div>

          {/* --------------AI labels toggle-------------- */}
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        {/* --------------Action buttons-------------- */}
        <section className="mb-6 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <Button className="h-8 rounded-full bg-nano-olive-700 px-3 text-[13px] font-medium text-nano-mint hover:bg-nano-deep-900 w-full sm:w-auto">
            Auto-Scenario
          </Button>
          <Button className="h-8 rounded-full bg-emerald-500 px-3 text-[13px] font-semibold text-black hover:bg-emerald-500/90 w-full sm:w-auto">
            Generate
          </Button>
        </section>

        {/*-------------- Progress-------------- */}
        <section className="mb-7">
          <div className="mb-2 text-[13px] text-nano-gray-100/85">
            Generating Images
          </div>
          <ThinProgress value={progress} />
        </section>

        {/* --------------Gallery-------------- */}
        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-nano-gray-100">
            Generated Images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {IMAGES.slice(0, 5).map((src) => (
              <figure
                key={src}
                className="aspect-[4/3] overflow-hidden rounded-lg bg-nano-olive-700 ring-1 ring-nano-forest-800"
              >
                <Image
                  src={src}
                  alt="Generated product"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>

          {/* --------------second row left image-------------- */}
          <div className="mt-4 grid grid-cols-1 max-w-full sm:max-w-[220px]">
            <figure className="aspect-[4/3] overflow-hidden rounded-lg bg-nano-olive-700 ring-1 ring-nano-forest-800">
              <Image
                src={IMAGES[5]}
                width={400}
                height={300}
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
      <RdxSlider.Track className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-nano-forest-800">
        <RdxSlider.Range className="absolute h-full bg-white" />
      </RdxSlider.Track>

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
