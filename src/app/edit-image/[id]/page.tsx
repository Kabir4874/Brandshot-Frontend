"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

/* -------------------------------- Page -------------------------------- */

export default function ImageEditingPage() {
  // object URLs for previews (null until uploaded)
  const [img1, setImg1] = useState<string | null>(null);
  const [img2, setImg2] = useState<string | null>(null);
  const [compare, setCompare] = useState<number>(50);

  // Inputs
  const fileA = useRef<HTMLInputElement | null>(null);
  const fileB = useRef<HTMLInputElement | null>(null);

  // Keep last objectURL to revoke
  const lastUrlA = useRef<string | null>(null);
  const lastUrlB = useRef<string | null>(null);

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) =>
    ref.current?.click();

  const setPreviewUrl = useCallback(
    (
      file: File,
      setUrl: (v: string | null) => void,
      lastRef: React.MutableRefObject<string | null>
    ) => {
      if (!file.type.startsWith("image/")) return; // guard
      const url = URL.createObjectURL(file);
      if (lastRef.current) URL.revokeObjectURL(lastRef.current);
      lastRef.current = url;
      setUrl(url);
    },
    []
  );

  const clearPreview = useCallback(
    (
      setUrl: (v: string | null) => void,
      lastRef: React.MutableRefObject<string | null>
    ) => {
      if (lastRef.current) URL.revokeObjectURL(lastRef.current);
      lastRef.current = null;
      setUrl(null);
    },
    []
  );

  const hasAnyPreview = Boolean(img1 || img2);

  return (
    <main className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-6 pt-6 pb-16">
        {/* Title */}
        <h1 className="text-[28px] font-extrabold leading-none tracking-tight">
          Image Editing
        </h1>

        {/* Uploads */}
        <section className="mt-8">
          <h2 className="mb-2 text-[13px] font-semibold text-nano-gray-100">
            Upload Images
          </h2>

          <div className="grid max-w-[520px] gap-4">
            {/* Image 1 */}
            <UploadField
              label="Image 1"
              inputRef={fileA}
              onPick={() => openPicker(fileA)}
              onDropFile={(file) => setPreviewUrl(file, setImg1, lastUrlA)}
              onClear={() => clearPreview(setImg1, lastUrlA)}
              hasImage={!!img1}
            />

            {/* Image 2 */}
            <UploadField
              label="Image 2"
              inputRef={fileB}
              onPick={() => openPicker(fileB)}
              onDropFile={(file) => setPreviewUrl(file, setImg2, lastUrlB)}
              onClear={() => clearPreview(setImg2, lastUrlB)}
              hasImage={!!img2}
            />
          </div>
        </section>

        {/* Preview (only when at least one image selected) */}
        {hasAnyPreview && (
          <section className="mt-6">
            <h2 className="mb-2 text-[13px] font-semibold text-nano-gray-100">
              Preview
            </h2>

            <div className="flex gap-4">
              {img1 && <FramedPreview src={img1} />}
              {img2 && <FramedPreview src={img2} />}
            </div>
          </section>
        )}

        {/* big vertical spacing like mock */}
        <div className="mt-16" />

        {/* Editing Actions */}
        <section>
          <h2 className="mb-2 text-[13px] font-semibold text-nano-gray-100">
            Editing Actions
          </h2>

          {/* left / center / right layout */}
          <div className="flex items-center gap-4">
            <ButtonPill label="Relight" />

            <ButtonPill label="Replace Background" />

            <ButtonPill label="Merge" />
          </div>
        </section>

        {/* Output */}
        <section className="mt-6">
          <h2 className="mb-2 text-[13px] font-semibold text-nano-gray-100">
            Output
          </h2>

          <div className="rounded-[12px] border border-nano-forest-800 bg-nano-olive-700/20 p-2">
            <figure className="overflow-hidden rounded-[12px]">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1583104853872-1a972d4e1f27?q=80&w=1600&auto=format&fit=crop"
                  alt="Edited output"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  priority
                />
              </div>
            </figure>
          </div>

          {/* Comparison slider (left label, thin white bar, % right) */}
          <div className="mt-2 flex items-center gap-6">
            <div className="min-w-[130px] text-[12px] text-nano-gray-100/85">
              Comparison Slider
            </div>

            <ThinBar value={compare} onChange={setCompare} />

            <div className="w-10 text-right text-[12px] text-nano-gray-100/85">
              {compare}%
            </div>
          </div>
        </section>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileA}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setPreviewUrl(f, setImg1, lastUrlA);
          e.currentTarget.value = ""; // allow re-select same file
        }}
      />
      <input
        ref={fileB}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setPreviewUrl(f, setImg2, lastUrlB);
          e.currentTarget.value = "";
        }}
      />
    </main>
  );
}

/* ----------------------------- Subcomponents ---------------------------- */

function UploadField({
  label,
  inputRef,
  onPick,
  onDropFile,
  onClear,
  hasImage,
}: {
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: () => void;
  onDropFile: (file: File) => void;
  onClear: () => void;
  hasImage: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div>
      <Label className="mb-1 block text-[13px] text-nano-gray-100">
        {label}
      </Label>

      <div
        role="button"
        tabIndex={0}
        onClick={onPick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onDropFile(file);
        }}
        className={[
          "flex h-10 w-[420px] max-w-full cursor-pointer items-center justify-between rounded-md border px-3",
          "bg-nano-olive-700 border-nano-forest-800 text-nano-gray-100",
          "hover:bg-nano-olive-700/95",
          dragOver ? "ring-2 ring-emerald-500/60" : "ring-0",
        ].join(" ")}
        aria-label={`${label} picker`}
      >
        {/* two-line helper (stacked) */}
        <div className="leading-tight">
          <div className="text-[13px]">Click</div>
          <div className="-mt-0.5 text-[12px] text-nano-gray-100/70">
            Drop/Upload
          </div>
        </div>

        {hasImage && (
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              inputRef.current?.focus();
            }}
            className="rounded-md px-2 py-[2px] text-[12px] font-medium text-nano-mint hover:bg-nano-deep-900"
            variant="ghost"
            aria-label={`Clear ${label}`}
            title="Clear"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

/** Framed photo preview to match the screenshot (mat + light frame + slight shadow) */
function FramedPreview({ src }: { src: string }) {
  return (
    <div className="h-[210px] w-[250px] rounded-md bg-[#DADFD8] p-[10px] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
      <div className="h-full w-full rounded-[6px] bg-white p-[10px] shadow-sm">
        <div className="relative h-full w-full rounded-[4px] overflow-hidden">
          <Image
            src={src}
            alt="preview"
            fill
            className="object-cover"
            sizes="250px"
          />
        </div>
      </div>
    </div>
  );
}

function ButtonPill({ label }: { label: string }) {
  return (
    <Button
      className="h-[26px] rounded-[6px] bg-nano-olive-700 px-3 text-[12px] font-medium text-nano-mint hover:bg-nano-deep-900"
      variant="default"
    >
      {label}
    </Button>
  );
}

/* --------------------------- Thin Compare Bar --------------------------- */
/** Thin, left→right bar with white fill and NO visible thumb (flat look like the mock) */
function ThinBar({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative w-full">
      {/* Visual track (custom) */}
      <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-nano-forest-800">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-white"
          style={{ width: `${value}%` }}
        />
      </div>

      {/* Invisible interactive layer to keep keyboard/mouse control */}
      <Slider
        aria-label="Comparison"
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={0}
        max={100}
        step={1}
        className="absolute inset-0 opacity-0 [appearance:none]"
      />
    </div>
  );
}
