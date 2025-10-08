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

export default function RecreatingLogoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerationResponse | null>(null);
  const [postError, setPostError] = useState<null | string>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const recreatingLogoForm = useForm({
    defaultValues: {
      operationType: "Brand Logo Recreate",
      photo: null as File | null,
      keyMessages: "",
      upscaleImage: "no",
    },
  });

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setOutput(null);
    setPostError(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append("operationType", formData.operationType);
      dataToSend.append("keyMessages", formData.keyMessages);
      dataToSend.append("upscaleImage", formData.upscaleImage);
      if (formData.photo) {
        dataToSend.append("photo", formData.photo);
      }
      const response = await fetch(backendUrl as string, {
        method: "POST",
        body: dataToSend,
      });

      const result = await response?.json();

      if (result?.operationStatus === "successful") {
        setOutput(result);
        toast.success("Logo Recreate successfully!");
      } else {
        setPostError("Error generating content. Please try again.");
        toast.error("Error generating content. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setPostError("Error generating content. Please try again.");
      toast.error("Error generating content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    recreatingLogoForm.reset();
    setOutput(null);
    setPostError(null);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={recreatingLogoForm.handleSubmit((data) => handleSubmit(data))}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recreating Logo</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="photo" className="mb-3 block">
                  Logo Image
                </Label>
                {/*------------------------------ */}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      recreatingLogoForm.setValue("photo", file, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100"
                  disabled={isLoading}
                />

                {recreatingLogoForm.formState.errors.photo && (
                  <p className="text-red-500 text-xs mt-1">
                    Logo image is required
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="keyMessages" className="mb-3 block">
                  Key Messages
                </Label>
                <Textarea
                  {...recreatingLogoForm.register("keyMessages", {
                    required: true,
                  })}
                  placeholder="List the main points you want to communicate in your ad..."
                  className="w-full border-nano-forest-800 bg-nano-olive-700 text-[14px] text-nano-gray-100 min-h-[100px]"
                  disabled={isLoading}
                />
                {recreatingLogoForm.formState.errors.keyMessages && (
                  <p className="text-red-500 text-xs mt-1">
                    Key Messages is required
                  </p>
                )}
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

              {/* ---------------Buttons Section-------------- */}
              {!output ? (
                // Show single Generate button before first generation (including while loading)
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 text-black hover:bg-emerald-500/90 cursor-pointer"
                >
                  {isLoading ? "Generating..." : "Recreate Logo"}
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-[79%] bg-emerald-500 text-black hover:bg-emerald-500/90 cursor-pointer"
                  >
                    {isLoading
                      ? "Generating..."
                      : "Recreate Logo"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="w-[18%] bg-red-500 text-black hover:bg-red-500/90 hover:text-white cursor-pointer"
                  >
                    Reset
                  </Button>
                </div>
              )}
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
