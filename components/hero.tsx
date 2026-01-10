"use client"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImageUploader } from "./image-uploader"
import { OutputGallery } from "./output-gallery"
import { useState } from "react"

interface GalleryItem {
  id: string
  originalImage: string
  prompt: string
  result: string
  generatedImage?: string // 存储生成的图片数据
  timestamp: Date
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export function Hero() {
  const [showUploader, setShowUploader] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])

  const handleImageGenerated = (result: string, originalImage: string, prompt: string, usage?: any) => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      originalImage,
      prompt,
      result: "Image generated successfully!",
      generatedImage: result, // 存储生成的图片URL或base64数据
      timestamp: new Date(),
      usage,
    }
    setGalleryItems(prev => [newItem, ...prev])
  }

  const clearGallery = () => {
    setGalleryItems([])
  }

  return (
    <>
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        {/* Decorative bananas */}
        <div className="pointer-events-none absolute -right-10 top-10 rotate-12 text-9xl opacity-20">🍌</div>
        <div className="pointer-events-none absolute -left-10 bottom-20 -rotate-12 text-7xl opacity-15">🍌</div>
        <div className="pointer-events-none absolute right-1/4 top-32 rotate-45 text-6xl opacity-10">🍌</div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium">
              <span className="text-2xl">🍌</span>
              <span>NEW! Banana Editor Pro is now live</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Banana Editor
            </h1>

            <p className="mb-8 text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl">
              Transform any image with simple text prompts. Experience advanced AI-powered editing with consistent
              character preservation and natural language understanding.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => setShowUploader(true)} className="group gap-2 text-lg">
                <Upload className="size-5 transition-transform group-hover:scale-110" />
                Start Editing
                <span className="text-xl">🍌</span>
              </Button>
              <Button size="lg" variant="outline" className="text-lg bg-transparent">
                View Examples
              </Button>
            </div>

            {/* Image Uploader Modal */}
            {showUploader && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="relative w-full max-w-2xl">
                  <ImageUploader
                    onClose={() => setShowUploader(false)}
                    onImageGenerated={handleImageGenerated}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Output Gallery Section */}
      {galleryItems.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <OutputGallery
              items={galleryItems}
              onClear={clearGallery}
            />
          </div>
        </section>
      )}
    </>
  )
}
