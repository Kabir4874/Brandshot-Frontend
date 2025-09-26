"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";

export default function Generations() {
  const [activeTab, setActiveTab] = useState("ad-creative");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const adCreativeForm = useForm({
    defaultValues: {
      industry: "",
      adPlatform: "",
      campaignObjective: "",
      targetAudience: "",
      keyMessages: "",
      brandGuidelines: "",
      upscaleImage: "no"
    }
  });

  const productPhotographyForm = useForm({
    defaultValues: {
      photo: null as File | null,
      upscaleImage: "no"
    }
  });

  const productPhotographyModelForm = useForm({
    defaultValues: {
      photo: null as File | null,
      upscaleImage: "no"
    }
  });

  const generatingLogoForm = useForm({
    defaultValues: {
      brandName: "",
      industry: "",
      adPlatform: "",
      campaignObjective: "",
      targetAudience: "",
      keyMessages: "",
      brandGuidelines: "",
      upscaleImage: "no"
    }
  });

  const recreatingLogoForm = useForm({
    defaultValues: {
      photo: null as File | null,
      keyMessages: "",
      upscaleImage: "no"
    }
  });

  const handleSubmit = async (formData: any, hasImage: boolean = false) => {
    setIsLoading(true);
    setOutput(null);

    try {
      let dataToSend: any;
      
      if (hasImage) {
        dataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'photo' && formData[key]) {
            dataToSend.append(key, formData[key][0]);
          } else {
            dataToSend.append(key, formData[key]);
          }
        });
      } else {
        dataToSend = JSON.stringify(formData);
      }

      const response = await fetch('https://developer.shourav.com/start', {
        method: 'POST',
        headers: hasImage ? {} : { 'Content-Type': 'application/json' },
        body: hasImage ? dataToSend : dataToSend
      });

      const result = await response.json();
      setOutput(result.data || result);
    } catch {
      setOutput('Error generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full bg-nano-deep-950 text-nano-white min-h-full">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-16">
        {/* --------------Title + subtitle-------------- */}
        <header className="mb-5">
          <h1 className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight">
            AI Content Generations
          </h1>
          <p className="mt-1 text-[13px] text-nano-gray-100/85">
            Generate high-quality content for your business.
          </p>
        </header>

        {/* ----------------Tabs Section------------- */}
        <div className="w-full">
          {/* Desktop Tabs */}
          <div className="hidden md:flex w-full gap-x-8 lg:gap-x-10 mb-8 border-b border-nano-forest-800">
            <button onClick={() => setActiveTab("ad-creative")} className={`text-xs md:text-sm pb-2 ${activeTab === "ad-creative" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-nano-gray-100/85"}`}>Ad Creative</button>
            <button onClick={() => setActiveTab("product-photography")} className={`text-xs md:text-sm pb-2 ${activeTab === "product-photography" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-nano-gray-100/85"}`}>Product Photography</button>
            <button onClick={() => setActiveTab("product-photography-model")} className={`text-xs md:text-sm pb-2 ${activeTab === "product-photography-model" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-nano-gray-100/85"}`}>Product Photography with Model</button>
            <button onClick={() => setActiveTab("generating-logo")} className={`text-xs md:text-sm pb-2 ${activeTab === "generating-logo" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-nano-gray-100/85"}`}>Generating Logo</button>
            <button onClick={() => setActiveTab("recreating-logo")} className={`text-xs md:text-sm pb-2 ${activeTab === "recreating-logo" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-nano-gray-100/85"}`}>Recreating Logo</button>
          </div>

          {/* Mobile Select */}
          <div className="md:hidden mb-8">
            <Label htmlFor="generation-select" className="mb-3 block">Select Generation</Label>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ad-creative">Ad Creative</SelectItem>
                <SelectItem value="product-photography">Product Photography</SelectItem>
                <SelectItem value="product-photography-model">Product Photography with Model</SelectItem>
                <SelectItem value="generating-logo">Generating Logo</SelectItem>
                <SelectItem value="recreating-logo">Recreating Logo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ---------Ad Creative Tab ---------*/}
          {activeTab === "ad-creative" && (
            <div className="space-y-6">
              <form onSubmit={adCreativeForm.handleSubmit(data => handleSubmit(data, false))}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ad Creative Generation</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="industry" className="mb-3 block">Your Industry</Label>
                        <Controller
                          name="industry"
                          control={adCreativeForm.control}
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
                                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                                <SelectItem value="travel-tourism">Travel & Tourism</SelectItem>
                                <SelectItem value="automotive">Automotive</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="adPlatform" className="mb-3 block">Ad Platform</Label>
                        <Controller
                          name="adPlatform"
                          control={adCreativeForm.control}
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
                        <Label htmlFor="campaignObjective" className="mb-3 block">Campaign Objective</Label>
                        <Controller
                          name="campaignObjective"
                          control={adCreativeForm.control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100">
                                <SelectValue placeholder="Select campaign objective" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                                <SelectItem value="consideration">Consideration</SelectItem>
                                <SelectItem value="conversion">Conversion</SelectItem>
                                <SelectItem value="engagement">Engagement</SelectItem>
                                <SelectItem value="traffic">Traffic</SelectItem>
                                <SelectItem value="app-installs">App Installs</SelectItem>
                                <SelectItem value="lead-generation">Lead Generation</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="targetAudience" className="mb-3 block">Target Audience</Label>
                        <Textarea
                          {...adCreativeForm.register("targetAudience", { required: true })}
                          placeholder="Describe your target audience demographics, interests, and behaviors..."
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px] placeholder-red-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="keyMessages" className="mb-3 block">Key Messages</Label>
                        <Textarea
                          {...adCreativeForm.register("keyMessages", { required: true })}
                          placeholder="List the main points you want to communicate in your ad..."
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brandGuidelines" className="mb-3 block">Brand Guidelines</Label>
                        <Textarea
                          {...adCreativeForm.register("brandGuidelines", { required: true })}
                          placeholder="Include any brand colors, tone of voice, restrictions, or specific requirements..."
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">Upscale Image</Label>
                        <Controller
                          name="upscaleImage"
                          control={adCreativeForm.control}
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
                        {isLoading ? "Generating..." : "Generate Ad Creative"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Side - Output */}
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
                          {typeof output === 'string' && output.startsWith('http') ? (
                            <Image src={output} alt="Generated content" width={500} height={500} className="w-full h-auto rounded" />
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                          )}
                        </div>
                      ) : (
                        <p className="text-nano-gray-100 text-center">Your generated content will appear here</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ---------Product Photography Tab ---------*/}
          {activeTab === "product-photography" && (
            <div className="space-y-6">
              <form onSubmit={productPhotographyForm.handleSubmit(data => handleSubmit(data, true))}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Photography</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="photo" className="mb-3 block">Product Photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          {...productPhotographyForm.register("photo", { required: true })}
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100"
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">Upscale Image</Label>
                        <Controller
                          name="upscaleImage"
                          control={productPhotographyForm.control}
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
                        {isLoading ? "Generating..." : "Generate Product Photography"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Side - Output */}
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
                          {typeof output === 'string' && output.startsWith('http') ? (
                            <Image src={output} alt="Generated content" width={500} height={500} className="w-full h-auto rounded" />
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                          )}
                        </div>
                      ) : (
                        <p className="text-nano-gray-100 text-center">Your generated content will appear here</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ---------Product Photography with Model Tab--------- */}
          {activeTab === "product-photography-model" && (
            <div className="space-y-6">
              <form onSubmit={productPhotographyModelForm.handleSubmit(data => handleSubmit(data, true))}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Photography with Model</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="photo" className="mb-3 block">Product Photo with Model</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          {...productPhotographyModelForm.register("photo", { required: true })}
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100"
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">Upscale Image</Label>
                        <Controller
                          name="upscaleImage"
                          control={productPhotographyModelForm.control}
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
                        {isLoading ? "Generating..." : "Generate with Model"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Side - Output */}
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
                          {typeof output === 'string' && output.startsWith('http') ? (
                            <Image src={output} alt="Generated content" width={500} height={500} className="w-full h-auto rounded" />
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                          )}
                        </div>
                      ) : (
                        <p className="text-nano-gray-100 text-center">Your generated content will appear here</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ---------Generating Logo Tab--------- */}
          {activeTab === "generating-logo" && (
            <div className="space-y-6">
              <form onSubmit={generatingLogoForm.handleSubmit(data => handleSubmit(data, false))}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Generating Logo</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="brandName" className="mb-3 block">Brand Name</Label>
                        <Input
                          {...generatingLogoForm.register("brandName", { required: true })}
                          placeholder="Enter your Brand Name"
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100"
                        />
                      </div>

                      <div>
                        <Label htmlFor="industry" className="mb-3 block">Your Industry</Label>
                        <Controller
                          name="industry"
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
                                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                                <SelectItem value="travel-tourism">Travel & Tourism</SelectItem>
                                <SelectItem value="automotive">Automotive</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="adPlatform" className="mb-3 block">Ad Platform</Label>
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
                        <Label htmlFor="campaignObjective" className="mb-3 block">Campaign Objective</Label>
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
                                <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                                <SelectItem value="consideration">Consideration</SelectItem>
                                <SelectItem value="conversion">Conversion</SelectItem>
                                <SelectItem value="engagement">Engagement</SelectItem>
                                <SelectItem value="traffic">Traffic</SelectItem>
                                <SelectItem value="app-installs">App Installs</SelectItem>
                                <SelectItem value="lead-generation">Lead Generation</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="targetAudience" className="mb-3 block">Target Audience</Label>
                        <Textarea
                          {...generatingLogoForm.register("targetAudience", { required: true })}
                          placeholder="Describe your target audience demographics, interests, and behaviors..."
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="keyMessages" className="mb-3 block">Key Messages</Label>
                        <Textarea
                          {...generatingLogoForm.register("keyMessages", { required: true })}
                          placeholder="List the main points you want to communicate in your ad..."
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brandGuidelines" className="mb-3 block">Brand Guidelines</Label>
                        <Textarea
                          {...generatingLogoForm.register("brandGuidelines", { required: true })}
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
                  </div>

                  {/* Right Side - Output */}
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
                          {typeof output === 'string' && output.startsWith('http') ? (
                            <Image src={output} alt="Generated content" width={500} height={500} className="w-full h-auto rounded" />
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                          )}
                        </div>
                      ) : (
                        <p className="text-nano-gray-100 text-center">Your generated content will appear here</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ---------Recreating Logo Tab ---------*/}
          {activeTab === "recreating-logo" && (
            <div className="space-y-6">
              <form onSubmit={recreatingLogoForm.handleSubmit(data => handleSubmit(data, true))}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recreating Logo</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="photo" className="mb-3 block">Logo Photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          {...recreatingLogoForm.register("photo", { required: true })}
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100"
                        />
                      </div>

                      <div>
                        <Label htmlFor="keyMessages" className="mb-3 block">Key Messages</Label>
                        <Textarea
                          {...recreatingLogoForm.register("keyMessages", { required: true })}
                          placeholder="List the main points you want to communicate in your ad..."
                          className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">Upscale Image</Label>
                        <Controller
                          name="upscaleImage"
                          control={recreatingLogoForm.control}
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
                        {isLoading ? "Generating..." : "Recreate Logo"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Side - Output */}
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
                          {typeof output === 'string' && output.startsWith('http') ? (
                            <Image src={output} alt="Generated content" width={500} height={500} className="w-full h-auto rounded" />
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                          )}
                        </div>
                      ) : (
                        <p className="text-nano-gray-100 text-center">Your generated content will appear here</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}