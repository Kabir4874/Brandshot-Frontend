"use client";

import {
  createPreset,
  getUserDoc,
  listPresets,
  upsertUserProfile,
} from "@/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/providers/AuthProvider";
import { AppUserDoc, PromptPreset } from "@/types/user";
import { signOut } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

/* ---------------- Dynamic options per category ---------------- */

type Category = PromptPreset["category"];
type Opt = { value: string; label: string };

const OPTIONS: Record<Category, { platforms: Opt[]; contentTypes: Opt[] }> = {
  social: {
    platforms: [
      { value: "instagram", label: "Instagram" },
      { value: "twitter", label: "Twitter/X" },
      { value: "tiktok", label: "TikTok" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "youtube", label: "YouTube" },
      { value: "facebook", label: "Facebook" },
    ],
    contentTypes: [
      { value: "caption", label: "Caption" },
      { value: "post", label: "Post" },
      { value: "story", label: "Story" },
      { value: "reel_script", label: "Reel/Shorts Script" },
      { value: "carousel", label: "Carousel Copy" },
    ],
  },
  marketing: {
    platforms: [
      { value: "blog", label: "Blog" },
      { value: "landing_page", label: "Landing Page" },
      { value: "email", label: "Email" },
      { value: "ad_network", label: "Ad Network" },
      { value: "press", label: "Press/PR" },
    ],
    contentTypes: [
      { value: "ad_copy", label: "Ad Copy" },
      { value: "headline", label: "Headline" },
      { value: "subheadline", label: "Sub-headline" },
      { value: "cta", label: "CTA" },
      { value: "press_release", label: "Press Release" },
      { value: "tagline", label: "Tagline" },
    ],
  },
  ecom: {
    platforms: [
      { value: "amazon", label: "Amazon" },
      { value: "shopify", label: "Shopify" },
      { value: "etsy", label: "Etsy" },
      { value: "ebay", label: "eBay" },
      { value: "product_page", label: "Generic Product Page" },
    ],
    contentTypes: [
      { value: "title", label: "Product Title" },
      { value: "bullets", label: "Bullet Points" },
      { value: "description", label: "Description" },
      { value: "seo_keywords", label: "SEO Keywords" },
      { value: "faq", label: "FAQ" },
    ],
  },
};

export default function SettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<AppUserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Presets state (category-scoped list)
  const [activeTab, setActiveTab] =
    useState<PromptPreset["category"]>("social");
  const [presets, setPresets] = useState<PromptPreset[]>([]);
  const [savingPreset, setSavingPreset] = useState(false);

  // Preset form controls
  const [platform, setPlatform] = useState("");
  const [ctype, setCtype] = useState("");
  const [prompt, setPrompt] = useState("");

  // Reset selects when tab changes to avoid mismatched values
  useEffect(() => {
    setPlatform("");
    setCtype("");
  }, [activeTab]);

  const currentOptions = OPTIONS[activeTab];

  // Load user profile + presets
  useEffect(() => {
    let dead = false;

    async function run() {
      if (!user) {
        setProfile(null);
        setPresets([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      try {
        // Upsert minimal profile from Auth, strip undefined safely (handled in API)
        await upsertUserProfile(user.uid, {
          uid: user.uid,
          email: user.email ?? "",
          displayName: user.displayName ?? "",
          photoURL: user.photoURL ?? null, // NOT undefined
        });

        const doc = await getUserDoc(user.uid);
        if (!dead) setProfile(doc);

        const list = await listPresets(user.uid, activeTab);
        if (!dead) setPresets(list);
      } catch (e: any) {
        if (!dead) setErr(e?.message || "Failed to load settings.");
      } finally {
        if (!dead) setLoading(false);
      }
    }
    run();

    return () => {
      dead = true;
    };
  }, [user, activeTab]);

  // Avatar initials fallback
  const initials = useMemo(() => {
    const name = profile?.displayName || "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "U";
    const first = parts[0]?.[0] || "";
    const last = parts[1]?.[0] || "";
    return (first + last).toUpperCase() || "U";
  }, [profile?.displayName]);

  async function handleSavePreset() {
    if (!user) return;
    if (!platform || !ctype || !prompt.trim()) {
      setErr("Please complete Platform, Content Type, and Prompt.");
      return;
    }
    setSavingPreset(true);
    setErr(null);
    try {
      await createPreset(user.uid, {
        category: activeTab,
        platform,
        contentType: ctype,
        prompt: prompt.trim(),
      });
      // refresh list
      const list = await listPresets(user.uid, activeTab);
      setPresets(list);
      // reset inputs
      setPlatform("");
      setCtype("");
      setPrompt("");
    } catch (e: any) {
      setErr(e?.message || "Failed to save preset.");
    } finally {
      setSavingPreset(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <main className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-16">
        {/* Title */}
        <h1 className="mb-6 text-3xl font-extrabold leading-none tracking-tight">
          Settings
        </h1>

        {err && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-200">
            {err}
          </div>
        )}

        {/* Account */}
        <Section title="Account">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-1 ring-nano-deep-900">
                <AvatarImage
                  src={profile?.photoURL || undefined}
                  alt="Profile"
                />
                <AvatarFallback className="bg-nano-olive-700 text-nano-mint">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-[14px] font-semibold text-white">
                  {profile?.displayName || profile?.email || "User"}
                </div>
                <div className="text-[13px] text-nano-gray-100/85">
                  {profile?.email || "—"}
                </div>
              </div>
            </div>
            <Button
              className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95"
              onClick={() => {
                // Wire up a profile editor if needed, then call upsertUserProfile
                alert("Profile management coming soon.");
              }}
              disabled={loading}
            >
              Manage
            </Button>
          </div>
        </Section>

        {/* Subscription & Billing (static demo fields for MVP) */}
        <Section title="Subscription & Billing">
          <Row
            label="Current Plan"
            value={profile?.plan ? profile.plan.toUpperCase() : "FREE"}
          >
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Upgrade
            </Button>
          </Row>
          <Row label="Billing Information" value="—">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Update
            </Button>
          </Row>
        </Section>

        {/* API Keys (placeholder) */}
        <Section title="API Keys">
          <Row label="OpenRouter API" value="Integrated">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Manage
            </Button>
          </Row>
        </Section>

        {/* Prompt Presets */}
        <Section title="Prompt Presets">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as Category)}
            className="w-full"
          >
            <TabsList className="relative h-auto w-auto justify-start gap-8 border-b border-nano-deep-900 bg-transparent p-0">
              <TabsTrigger
                value="social"
                className="px-0 py-2 text-[13px] font-semibold"
              >
                Social Media
              </TabsTrigger>
              <TabsTrigger
                value="marketing"
                className="px-0 py-2 text-[13px] font-semibold"
              >
                Marketing
              </TabsTrigger>
              <TabsTrigger
                value="ecom"
                className="px-0 py-2 text-[13px] font-semibold"
              >
                E-commerce
              </TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="mt-6">
              <PresetForm
                platform={platform}
                setPlatform={setPlatform}
                ctype={ctype}
                setCtype={setCtype}
                prompt={prompt}
                setPrompt={setPrompt}
                onSave={handleSavePreset}
                saving={savingPreset}
                platformOptions={OPTIONS.social.platforms}
                typeOptions={OPTIONS.social.contentTypes}
              />
              <PresetList presets={presets} />
            </TabsContent>

            <TabsContent value="marketing" className="mt-6">
              <PresetForm
                platform={platform}
                setPlatform={setPlatform}
                ctype={ctype}
                setCtype={setCtype}
                prompt={prompt}
                setPrompt={setPrompt}
                onSave={handleSavePreset}
                saving={savingPreset}
                platformOptions={OPTIONS.marketing.platforms}
                typeOptions={OPTIONS.marketing.contentTypes}
              />
              <PresetList presets={presets} />
            </TabsContent>

            <TabsContent value="ecom" className="mt-6">
              <PresetForm
                platform={platform}
                setPlatform={setPlatform}
                ctype={ctype}
                setCtype={setCtype}
                prompt={prompt}
                setPrompt={setPrompt}
                onSave={handleSavePreset}
                saving={savingPreset}
                platformOptions={OPTIONS.ecom.platforms}
                typeOptions={OPTIONS.ecom.contentTypes}
              />
              <PresetList presets={presets} />
            </TabsContent>
          </Tabs>
        </Section>

        {/* General (demo toggles) */}
        <Section title="General">
          <Row label="Language" value="English">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Change
            </Button>
          </Row>

          <Row label="Theme" value="Dark">
            <Switch
              defaultChecked
              className="data-[state=checked]:bg-emerald-500"
            />
          </Row>

          <Row label="Notifications" value="Enabled">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Change
            </Button>
          </Row>

          <Row label="Privacy" value="Enabled">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Change
            </Button>
          </Row>
        </Section>

        {/* Logout */}
        <div className="mt-8">
          <Button
            className="h-8 rounded-md bg-nano-olive-700 px-4 text-[13px] font-medium text-nano-mint hover:bg-nano-deep-900"
            onClick={handleLogout}
            disabled={!user}
          >
            Log Out
          </Button>
        </div>
      </div>
    </main>
  );
}

/* ---------- UI Bits ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-[15px] font-semibold text-nano-gray-100">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="text-[13px] font-semibold text-nano-gray-100">
          {label}
        </div>
        <div className="text-[13px] text-nano-gray-100/80">{value}</div>
      </div>
      {children}
    </div>
  );
}

function PresetForm({
  platform,
  setPlatform,
  ctype,
  setCtype,
  prompt,
  setPrompt,
  onSave,
  saving,
  platformOptions,
  typeOptions,
}: {
  platform: string;
  setPlatform: (v: string) => void;
  ctype: string;
  setCtype: (v: string) => void;
  prompt: string;
  setPrompt: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  platformOptions: { value: string; label: string }[];
  typeOptions: { value: string; label: string }[];
}) {
  return (
    <>
      {/* Platform */}
      <div className="mb-4">
        <Label className="mb-2 block text-[13px] text-nano-gray-100">
          Platform
        </Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="h-11 w-full lg:w-[420px] justify-between rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 hover:bg-nano-olive-700 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select a platform" />
          </SelectTrigger>
          <SelectContent className="border-0 bg-nano-olive-700 text-nano-gray-100">
            {platformOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Type */}
      <div className="mb-4">
        <Label className="mb-2 block text-[13px] text-nano-gray-100">
          Content Type
        </Label>
        <Select value={ctype} onValueChange={setCtype}>
          <SelectTrigger className="h-11 w-full lg:w-[420px] justify-between rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 hover:bg-nano-olive-700 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent className="border-0 bg-nano-olive-700 text-nano-gray-100">
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prompt */}
      <div className="mb-3">
        <Label className="mb-2 block text-[13px] text-nano-gray-100">
          Prompt
        </Label>
        <Textarea
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-36 w-full lg:w-[620px] resize-none rounded-lg border border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 placeholder:text-nano-gray-100/60 focus-visible:ring-0"
        />
      </div>

      {/* Save button */}
      <div className="mt-6 flex justify-end lg:pr-10">
        <Button
          className="h-8 rounded-full bg-emerald-500 px-4 text-[13px] font-semibold text-black hover:bg-emerald-500/90 disabled:opacity-70"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Preset"}
        </Button>
      </div>
    </>
  );
}

function PresetList({ presets }: { presets: PromptPreset[] }) {
  if (!presets.length) {
    return (
      <div className="mt-6 text-[13px] text-nano-gray-100/80">
        No presets yet for this tab.
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-3">
      {presets.map((p) => (
        <div
          key={p.id}
          className="rounded-lg border border-nano-forest-800 bg-nano-olive-700/20 p-3"
        >
          <div className="mb-1 text-[12px] text-nano-gray-100/70">
            {p.platform} • {p.contentType} •{" "}
            {new Date(p.updatedAt).toLocaleString()}
          </div>
          <div className="text-[13px] text-nano-gray-100/90 whitespace-pre-wrap">
            {p.prompt}
          </div>
        </div>
      ))}
    </div>
  );
}
