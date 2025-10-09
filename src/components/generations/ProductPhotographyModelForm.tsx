"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { GenerationResponse } from "@/types/generation";
import { Download, Plus, X } from "lucide-react";

export default function ProductPhotographyModelForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerationResponse | null>(null);
  const [postError, setPostError] = useState<null | string>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const productPhotographyModelForm = useForm({
    defaultValues: {
      operationType: "Product Photography with model",
      photo: null as File | null,
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
        toast.success("Product Photo generated successfully!");
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
    productPhotographyModelForm.reset();
    setOutput(null);
    setPostError(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={productPhotographyModelForm.handleSubmit((data) =>
          handleSubmit(data)
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Side - Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Product Photography with Model
            </h3>
            <div className="space-y-4">
              <div>
                <Controller
                  name="photo"
                  control={productPhotographyModelForm.control}
                  rules={{ required: "Product photo is required" }}
                  render={({ field }) => (
                    <div
                      className="relative flex min-h-[270px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-nano-gray-500 bg-nano-olive-700  hover:bg-nano-bg p-4"
                      onClick={() => imageInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0] || null;
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          field.onChange(file);
                          setImagePreview(imageUrl);
                        }
                      }}
                    >
                      <Input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            field.onChange(file);
                            setImagePreview(imageUrl);
                          }
                        }}
                        className="hidden"
                        disabled={isLoading}
                      />
                      {/* --------------------From Added Photo preview ----------------- */}
                      {imagePreview && field.value ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="Selected product"
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(null);
                              setImagePreview(null);
                              if (imageInputRef.current) {
                                imageInputRef.current.value = "";
                              }
                            }}
                            className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Plus className="mx-auto p-3 rounded-full h-12 w-12 text-nano-gray-400 bg-emerald-500 hover:bg-emerald-600 text-black hover:text-white" />
                          <p className="mt-2 text-sm text-nano-gray-100 ">
                            Drag & drop an image here, or click to select one
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                />
                {productPhotographyModelForm.formState.errors.photo && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      productPhotographyModelForm.formState.errors.photo
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-3 block">Upscale Image</Label>
                <Controller
                  name="upscaleImage"
                  control={productPhotographyModelForm.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
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
                {productPhotographyModelForm.formState.errors.upscaleImage && (
                  <p className="text-red-500 text-xs mt-1">
                    Please select Image Upscale needed or not
                  </p>
                )}
              </div>

              {/* ---------------Buttons Section-------------- */}
              {!output ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 text-black hover:bg-emerald-500/90 cursor-pointer"
                >
                  {isLoading ? "Generating..." : "Generate Product Photo"}
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-[79%] bg-emerald-500 text-black hover:bg-emerald-500/90 cursor-pointer"
                  >
                    {isLoading ? "Generating..." : "Generate Product Photo"}
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
              ) : postError ? (
                <p className="text-red-500 text-center">{postError}</p>
              ) : output ? (
                <div className="relative w-full">
                  <a
                    href={output?.imageDownloadLink}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 z-10 bg-emerald-500 hover:bg-emerald-600 text-black hover:text-white p-2 rounded-full"
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
