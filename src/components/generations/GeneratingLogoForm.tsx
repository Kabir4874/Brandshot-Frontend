"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { GenerationResponse } from "@/types/generation";
import { Download } from "lucide-react";

export default function GeneratingLogoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerationResponse | null>(null);
  const [postError, setPostError] = useState<null | string>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const generatingLogoForm = useForm({
    defaultValues: {
      brandName: "Cash Sol",
      yourIndustry: "",
      operationType: "Brand Logo",
      adPlatform: "",
      campaignObjective: "",
      targetAudience: "Small business owners, 25-45 years old",
      keyMessages:
        "Simplify your finance workflow with our AI-powered tools. Save time and boost productivity.",
      brandGuidelines:
        "Use primary blue (#1E90FF), secondary dark gray (#222222), modern sans-serif fonts, and a professional, ambitious tone.",
      upscaleImage: "no",
    },
  });

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setOutput(null);

    try {
      const response = await fetch(backendUrl as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result?.operationStatus === "successful") {
        setOutput(result);
        toast.success("Image generated successfully!");
      } else {
        setPostError("Error generating content. Please try again.");
        toast.error("Error generating content. Please try again.");
      }
    } catch {
      setPostError("Error generating content. Please try again.");
      toast.error("Error generating content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={generatingLogoForm.handleSubmit((data) => handleSubmit(data))}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Form (Unchanged) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generating Logo</h3>
            {/* ... rest of the form fields ... */}
            <div>
              <Label htmlFor="brandName" className="mb-3 block">
                Brand Name
              </Label>
              <Input
                {...generatingLogoForm.register("brandName", {
                  required: true,
                })}
                placeholder="Enter your Brand Name"
                className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="mb-3 block">
                Your Industry
              </Label>
              <Controller
                name="yourIndustry"
                control={generatingLogoForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="food-beverage">
                        Food & Beverage
                      </SelectItem>
                      <SelectItem value="travel-tourism">
                        Travel & Tourism
                      </SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="adPlatform" className="mb-3 block">
                Ad Platform
              </Label>
              <Controller
                name="adPlatform"
                control={generatingLogoForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100">
                      <SelectValue placeholder="Select ad platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="google-ads">Google Ads</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="campaignObjective" className="mb-3 block">
                Campaign Objective
              </Label>
              <Controller
                name="campaignObjective"
                control={generatingLogoForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100">
                      <SelectValue placeholder="Select campaign objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand-awareness">
                        Brand Awareness
                      </SelectItem>
                      <SelectItem value="consideration">
                        Consideration
                      </SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="traffic">Traffic</SelectItem>
                      <SelectItem value="app-installs">App Installs</SelectItem>
                      <SelectItem value="lead-generation">
                        Lead Generation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="targetAudience" className="mb-3 block">
                Target Audience
              </Label>
              <Textarea
                {...generatingLogoForm.register("targetAudience", {
                  required: true,
                })}
                placeholder="Describe your target audience demographics, interests, and behaviors..."
                className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="keyMessages" className="mb-3 block">
                Key Messages
              </Label>
              <Textarea
                {...generatingLogoForm.register("keyMessages", {
                  required: true,
                })}
                placeholder="List the main points you want to communicate in your ad..."
                className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="brandGuidelines" className="mb-3 block">
                Brand Guidelines
              </Label>
              <Textarea
                {...generatingLogoForm.register("brandGuidelines", {
                  required: true,
                })}
                placeholder="Include any brand colors, tone of voice, restrictions, or specific requirements..."
                className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
              />
            </div>

            <div>
              <Label className="mb-3 block">Upscale Image</Label>
              <Controller
                name="upscaleImage"
                control={generatingLogoForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-black hover:bg-emerald-500/90"
            >
              {isLoading ? "Generating..." : "Generate Logo"}
            </Button>
          </div>
          {/* Right Side - Output (Modified) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Output</h3>
            <div className="border-2 border-dashed text-nano-gray-400 rounded-lg p-4 min-h-[400px] bg-nano-olive-700 flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-nano-forest-800 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-nano-gray-100">Generating content...</p>
                </div>
              ) : output ? (
                <div className="w-full">
                  {postError?.includes("Error") ? (
                    <p className="text-red-500 text-center">{postError}</p>
                  ) : (
                    <div className="relative w-full ">
                      <a
                        href={output?.imageDownloadLink}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 z-10 bg-emerald-500 hover:bg-emerald-600 text-black hover:text-white p-2 rounded-full "
                        title="Download Image"
                      >
                        <Download className="w-5 h-5" />
                      </a>

                      <Image
                        src={`https://drive.google.com/uc?id=${output?.fileId}`}
                        alt="Generated content"
                        width={400}
                        height={400}
                        className="w-full h-auto rounded"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-nano-gray-100 text-center">
                  Your generated content will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
