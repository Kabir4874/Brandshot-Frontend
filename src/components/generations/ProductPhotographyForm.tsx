"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";

export default function ProductPhotographyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const productPhotographyForm = useForm({
    defaultValues: {
      photo: null as File | null,
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
  );
}
