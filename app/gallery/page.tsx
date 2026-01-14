import { ImageGallery } from "@/components/image-gallery"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ImageGallery />
      </div>
    </div>
  )
}
