"use client"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImageUploader } from "./image-uploader"
import { OutputGallery } from "./output-gallery"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

interface GalleryItem {
  id: string
  originalImage: string
  prompt: string
  result: string
  generatedImage?: string
  timestamp: Date
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

interface HeroClientProps {
  initialUser: User | null
}

export function HeroClient({ initialUser }: HeroClientProps) {
  const [showUploader, setShowUploader] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [user, setUser] = useState<User | null>(initialUser)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleImageGenerated = (result: string, originalImage: string, prompt: string, usage?: any) => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      originalImage,
      prompt,
      result: "Image generated successfully!",
      generatedImage: result,
      timestamp: new Date(),
      usage,
    }
    setGalleryItems(prev => [newItem, ...prev])
  }

  const clearGallery = () => {
    setGalleryItems([])
  }

  const handleStartEditing = () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setShowUploader(true)
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
              <Button 
                size="lg" 
                onClick={handleStartEditing} 
                className="group gap-2 text-lg"
              >
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
