"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [platform, setPlatform] = useState("");
  const [ctype, setCtype] = useState("");
  const [prompt, setPrompt] = useState("");

  return (
    <main className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-16">
        {/* Title */}
        <h1 className="mb-6 text-3xl font-extrabold leading-none tracking-tight">
          Settings
        </h1>

        {/* Account */}
        <Section title="Account">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-1 ring-nano-deep-900">
                <AvatarImage src="/avatar-sarah.jpg" alt="Sarah Miller" />
                <AvatarFallback className="bg-nano-olive-700 text-nano-mint">
                  SM
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-[14px] font-semibold text-white">
                  Sarah Miller
                </div>
                <div className="text-[13px] text-nano-gray-100/85">
                  sarah.miller@email.com
                </div>
              </div>
            </div>
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Manage
            </Button>
          </div>
        </Section>

        {/* Subscription & Billing */}
        <Section title="Subscription & Billing">
          <Row label="Current Plan" value="Free Plan">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Upgrade
            </Button>
          </Row>
          <Row label="Billing Information" value="Expires on 01/01/2025">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Update
            </Button>
          </Row>
        </Section>

        {/* API Keys */}
        <Section title="API Keys">
          <Row label="OpenRouter API" value="Integrated">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Manage
            </Button>
          </Row>
        </Section>

        {/* Prompt Presets */}
        <Section title="Prompt Presets">
          <Tabs defaultValue="social" className="w-full">
            <TabsList className="relative h-auto w-auto justify-start gap-8 border-b border-nano-deep-900 bg-transparent p-0">
              <TabsTrigger value="social" className="px-0 py-2 text-[13px] font-semibold">
                Social Media
              </TabsTrigger>
              <TabsTrigger value="marketing" className="px-0 py-2 text-[13px] font-semibold">
                Marketing
              </TabsTrigger>
              <TabsTrigger value="ecom" className="px-0 py-2 text-[13px] font-semibold">
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
              />
            </TabsContent>
            <TabsContent value="marketing" className="mt-6">
              <PresetForm
                platform={platform}
                setPlatform={setPlatform}
                ctype={ctype}
                setCtype={setCtype}
                prompt={prompt}
                setPrompt={setPrompt}
              />
            </TabsContent>
            <TabsContent value="ecom" className="mt-6">
              <PresetForm
                platform={platform}
                setPlatform={setPlatform}
                ctype={ctype}
                setCtype={setCtype}
                prompt={prompt}
                setPrompt={setPrompt}
              />
            </TabsContent>
          </Tabs>
        </Section>

        {/* General */}
        <Section title="General">
          <Row label="Language" value="English">
            <Button className="h-8 rounded-md bg-nano-forest-800 px-3 text-[13px] font-medium text-nano-gray-100 hover:bg-nano-forest-800/95">
              Change
            </Button>
          </Row>

          <Row label="Theme" value="Dark">
            <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
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
          <Button className="h-8 rounded-md bg-nano-olive-700 px-4 text-[13px] font-medium text-nano-mint hover:bg-nano-deep-900">
            Log Out
          </Button>
        </div>
      </div>
    </main>
  );
}

/* ---------- Helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
}: {
  platform: string;
  setPlatform: (v: string) => void;
  ctype: string;
  setCtype: (v: string) => void;
  prompt: string;
  setPrompt: (v: string) => void;
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
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
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
            <SelectItem value="caption">Caption</SelectItem>
            <SelectItem value="post">Post</SelectItem>
            <SelectItem value="ad">Ad Copy</SelectItem>
            <SelectItem value="script">Short Script</SelectItem>
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
        <Button className="h-8 rounded-full bg-emerald-500 px-4 text-[13px] font-semibold text-black hover:bg-emerald-500/90">
          Save Preset
        </Button>
      </div>
    </>
  );
}
