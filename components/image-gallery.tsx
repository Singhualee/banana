"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Download, ArrowLeft, Image as ImageIcon, Loader2, AlertCircle, Home } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { UserImage } from "@/types/image"
import { useRouter } from "next/navigation"

interface ImageGalleryProps {
  onClose?: () => void
}

export function ImageGallery({ onClose }: ImageGalleryProps) {
  const router = useRouter()
  const [images, setImages] = useState<UserImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<Record<string, 'original' | 'generated'>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    fetchImages()
  }, [currentPage, pageSize])

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/images?page=${currentPage}&pageSize=${pageSize}`, {
        cache: 'no-store',
      })
      
      if (!response.ok) {
        throw new Error(`API error (${response.status})`)
      }
      
      const data = await response.json()
      setImages(data.images || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalItems(data.pagination?.totalItems || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images')
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(imageId)
      
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete image')
      }

      setImages(images.filter(img => img.id !== imageId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image')
      console.error('Error deleting image:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `ai-edit-${filename}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImageSelect = (imageId: string, type: 'original' | 'generated') => {
    setSelectedImages(prev => ({
      ...prev,
      [imageId]: type
    }))
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <Card className="relative max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="relative max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToHome}>
            <Home className="mr-2 size-4" />
            Back to Home
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="size-4" />
            </Button>
          )}
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <Button onClick={fetchImages}>Retry</Button>
        </div>
      </Card>
    )
  }

  if (images.length === 0) {
    return (
      <Card className="relative max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToHome}>
            <Home className="mr-2 size-4" />
            Back to Home
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 rounded-full bg-primary/10 p-6">
            <ImageIcon className="size-12 text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">No Images Yet</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            You haven't generated any images yet. Start using the AI image editing feature to create your first image!
          </p>
          <Button onClick={handleBackToHome}>
            <Home className="mr-2 size-4" />
            Go to Generate Images
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative max-h-[90vh] overflow-y-auto p-6">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold">My Images</h2>
            <p className="text-muted-foreground">{totalItems} images total</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToHome}>
              <Home className="mr-2 size-4" />
              Back to Home
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="size-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {images.map((image) => {
          const selectedType = selectedImages[image.id] || 'generated'
          const currentImage = selectedType === 'original' ? image.original_image : image.generated_image
          
          return (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <img
                  src={currentImage}
                  alt={image.prompt}
                  className="size-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {image.prompt}
                </p>
                
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={() => handleImageSelect(image.id, 'original')}
                    className={`relative aspect-square w-16 overflow-hidden rounded border-2 transition-all ${
                      selectedType === 'original' ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image.original_image}
                      alt="Original image"
                      className="size-full object-cover"
                    />
                  </button>
                  <button
                    onClick={() => handleImageSelect(image.id, 'generated')}
                    className={`relative aspect-square w-16 overflow-hidden rounded border-2 transition-all ${
                      selectedType === 'generated' ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image.generated_image}
                      alt="Generated image"
                      className="size-full object-cover"
                    />
                  </button>
                </div>

                <div className="mb-3 text-xs text-muted-foreground">
                  {new Date(image.created_at).toLocaleString('zh-CN')}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(currentImage, image.id)}
                  >
                    <Download className="mr-2 size-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(image.id)}
                    disabled={deletingId === image.id}
                  >
                    {deletingId === image.id ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 size-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
