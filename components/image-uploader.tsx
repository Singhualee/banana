"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Sparkles, AlertCircle, LogIn, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useUserCredits } from "@/hooks/use-user-credits"

interface ImageUploaderProps {
  onClose: () => void
  onImageGenerated?: (result: string, originalImage: string, prompt: string) => void
}

interface GenerationResult {
  success: boolean
  result?: string
  imageResult?: string
  isImageGeneration?: boolean
  error?: string
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

export function ImageUploader({ onClose, onImageGenerated }: ImageUploaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const { credits, isLoading: creditsLoading, creditsRemaining, canGenerate } = useUserCredits()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return

    if (!canGenerate) {
      setGenerationResult({
        success: false,
        error: creditsRemaining === 0 
          ? 'You have used all your free image generation credits. Please purchase more credits to continue.'
          : 'Please wait while we check your credits...',
      })
      return
    }

    setIsProcessing(true)
    setGenerationResult(null)

    try {
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt: prompt,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        setGenerationResult({
          success: false,
          error: `Server error (${response.status}): ${errorText.substring(0, 200)}...`,
        })
        return
      }

      const result = await response.json()

      if (response.ok) {
        setGenerationResult({
          success: true,
          result: result.result,
          imageResult: result.imageResult,
          isImageGeneration: result.isImageGeneration,
          usage: result.usage,
        })

        const displayResult = result.isImageGeneration ? result.imageResult : result.result
        if (onImageGenerated && displayResult) {
          onImageGenerated(displayResult, selectedImage, prompt)
        }
      } else {
        setGenerationResult({
          success: false,
          error: result.error || 'Failed to generate image',
        })
      }
    } catch (error) {
      console.error('Generation error:', error)
      setGenerationResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (authLoading) {
    return (
      <Card className="relative max-h-[90vh] overflow-y-auto p-6">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="size-4" />
        </Button>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 rounded-full bg-primary/10 p-6">
            <LogIn className="size-12 text-primary animate-pulse" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Checking login status...</h2>
          <p className="max-w-md text-muted-foreground">
            Please wait
          </p>
        </div>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="relative max-h-[90vh] overflow-y-auto p-6">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="size-4" />
        </Button>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 rounded-full bg-primary/10 p-6">
            <LogIn className="size-12 text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Login Required</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Please log in with your Google account to use the AI image editing feature
          </p>
          <Button 
            className="gap-2"
            onClick={() => window.location.href = '/login'}
          >
            <LogIn className="size-4" />
            Go to Login
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative max-h-[90vh] overflow-y-auto p-6">
      <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
        <X className="size-4" />
      </Button>

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">
          AI Image Editor <span className="text-3xl">🍌</span>
        </h2>
        <p className="text-muted-foreground">Upload an image and get detailed AI-powered editing guidance and creative suggestions</p>
      </div>

      {/* Upload Area */}
      <div
        className="mb-6 cursor-pointer rounded-lg border-2 border-dashed border-border bg-secondary/50 p-8 text-center transition-colors hover:border-primary hover:bg-secondary"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {selectedImage ? (
          <div className="relative">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Uploaded"
              className="mx-auto max-h-64 rounded-lg object-contain"
            />
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="mb-2 font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">Max 10MB • PNG, JPG, WebP</p>
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Describe Your Desired Edit</label>
        <Textarea
          placeholder="e.g., 'Make the background a sunny beach', 'Change the season to winter', 'Add vintage film effects', 'Remove the person in the background'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-24 resize-none"
        />
      </div>

      {/* Credits Display */}
      <div className="mb-6 rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            <span className="font-medium">Remaining Credits</span>
          </div>
          <div className="text-right">
            {creditsLoading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              <span className="text-2xl font-bold text-primary">{creditsRemaining}</span>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {creditsRemaining === 0 ? (
            <>
              You've used all your free credits. 
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="ml-1 font-medium text-primary hover:underline"
              >
                Purchase more credits
              </button>
            </>
          ) : (
            `Each image generation uses 1 credit. ${creditsRemaining} generation${creditsRemaining !== 1 ? 's' : ''} remaining.`
          )}
        </p>
      </div>

      {/* Generate Button */}
      <Button
        className="w-full gap-2"
        size="lg"
        onClick={handleGenerate}
        disabled={!selectedImage || !prompt || isProcessing || !canGenerate}
      >
        {isProcessing ? (
          <>
            <span className="animate-spin">🍌</span>
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="size-5" />
            {canGenerate ? 'Get Edit Suggestions' : 'No Credits Available'}
          </>
        )}
      </Button>

      {/* Result Display */}
      {generationResult && (
        <div className="mt-6">
          {generationResult.success ? (
            <div>
              <h3 className="mb-3 text-lg font-semibold">AI Editing Guidance</h3>

              {/* Display generated image */}
              {generationResult.isImageGeneration && generationResult.imageResult && (
                <div className="mb-4">
                  <img
                    src={generationResult.imageResult}
                    alt="Generated result"
                    className="w-full rounded-lg border object-contain max-h-64"
                  />
                </div>
              )}

              {/* Display text description */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm leading-relaxed">{generationResult.result}</p>
                {generationResult.usage && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>Tokens used: {generationResult.usage.total_tokens}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {generationResult.error}
                {generationResult.error?.includes('credits') && (
                  <Button 
                    className="mt-3 w-full"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    <CreditCard className="mr-2 size-4" />
                    Purchase Credits
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </Card>
  )
}
