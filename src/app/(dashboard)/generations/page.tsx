'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import AdCreativeForm from '@/components/generations/AdCreativeForm';
import GeneratingLogoForm from '@/components/generations/GeneratingLogoForm';
import ProductPhotographyForm from '@/components/generations/ProductPhotographyForm';
import ProductPhotographyModelForm from '@/components/generations/ProductPhotographyModelForm';
import RecreatingLogoForm from '@/components/generations/RecreatingLogoForm';
import VideoGenerationForm from '@/components/generations/VideoGenerationForm';

export default function Generations() {
  const [activeTab, setActiveTab] = useState('ad-creative');

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
            <button onClick={() => setActiveTab('ad-creative')} className={`text-xs md:text-sm pb-2 ${activeTab === 'ad-creative' ? 'border-b-2 border-emerald-500 text-emerald-500' : 'text-nano-gray-100/85'}`}>Ad Creative</button>
            <button onClick={() => setActiveTab('product-photography')} className={`text-xs md:text-sm pb-2 ${activeTab === 'product-photography' ? 'border-b-2 border-emerald-500 text-emerald-500' : 'text-nano-gray-100/85'}`}>Product Photography</button>
            <button onClick={() => setActiveTab('product-photography-model')} className={`text-xs md:text-sm pb-2 ${activeTab === 'product-photography-model' ? 'border-b-2 border-emerald-500 text-emerald-500' : 'text-nano-gray-100/85'}`}>Product Photography with Model</button>
            <button onClick={() => setActiveTab('generating-logo')} className={`text-xs md:text-sm pb-2 ${activeTab === 'generating-logo' ? 'border-b-2 border-emerald-500 text-emerald-500' : 'text-nano-gray-100/85'}`}>Generating Logo</button>
            <button onClick={() => setActiveTab('recreating-logo')} className={`text-xs md:text-sm pb-2 ${activeTab === 'recreating-logo' ? 'border-b-2 border-emerald-500 text-emerald-500' : 'text-nano-gray-100/85'}`}>Recreating Logo</button>
            <button onClick={() => setActiveTab('video-generation')} className={`text-xs md:text-sm pb-2 ${activeTab === 'video-generation' ? 'border-b-2 border-emerald-500 text-emerald-500' : 'text-nano-gray-100/85'}`}>Generate Video Ad</button>
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
                <SelectItem value="video-generation">Generate Video Ad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ---------Ad Creative Tab ---------*/}
          {activeTab === 'ad-creative' && <AdCreativeForm />}

          {/* ---------Product Photography Tab ---------*/}
          {activeTab === 'product-photography' && <ProductPhotographyForm />}

          {/* ---------Product Photography with Model Tab--------- */}
          {activeTab === 'product-photography-model' && <ProductPhotographyModelForm />}

          {/* ---------Generating Logo Tab--------- */}
          {activeTab === 'generating-logo' && <GeneratingLogoForm />}

          {/* ---------Recreating Logo Tab ---------*/}
          {activeTab === 'recreating-logo' && <RecreatingLogoForm />}

          {/* ---------Video Generation Tab ---------*/}
          {activeTab === 'video-generation' && <VideoGenerationForm />}
        </div>
      </div>
    </main>
  );
}
