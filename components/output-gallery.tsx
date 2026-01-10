"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Trash2, Expand, Clock } from "lucide-react"

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

interface OutputGalleryProps {
  items: GalleryItem[]
  onClear?: () => void
}

export function OutputGallery({ items, onClear }: OutputGalleryProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const handleDownload = async (item: GalleryItem) => {
    // 如果有生成的图片，下载图片；否则下载原始图片
    const imageUrl = item.generatedImage || item.originalImage

    if (!imageUrl) {
      console.error('No image URL available for download')
      return
    }

    try {
      // 确定文件格式和扩展名
      let fileExtension = 'png' // 默认格式
      let mimeType = 'image/png'

      if (imageUrl.includes('.jpg') || imageUrl.includes('jpeg') || imageUrl.includes('data:image/jpeg')) {
        fileExtension = 'jpg'
        mimeType = 'image/jpeg'
      } else if (imageUrl.includes('.webp') || imageUrl.includes('data:image/webp')) {
        fileExtension = 'webp'
        mimeType = 'image/webp'
      }

      // 如果是base64数据，转换为blob并下载
      if (imageUrl.startsWith('data:')) {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `banana-edit-${item.id}.${fileExtension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(blobUrl)
      } else {
        // 对于外部URL，创建一个临时的图片元素来获取blob
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `banana-edit-${item.id}.${fileExtension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(blobUrl)
      }
    } catch (error) {
      console.error('Error downloading image:', error)
      // 如果下载失败，尝试在新标签页中打开
      const a = document.createElement('a')
      a.href = imageUrl
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleShare = async (item: GalleryItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Banana Editor Result',
          text: `Prompt: ${item.prompt}\n\nResult: ${item.result}`,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(`Prompt: ${item.prompt}\n\nResult: ${item.result}`)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <h3 className="mb-2 text-lg font-semibold">No edits yet</h3>
          <p>Your generated images will appear here</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Output Gallery</h2>
        {items.length > 0 && onClear && (
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="mr-2 size-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={item.generatedImage || item.originalImage}
                alt={item.generatedImage ? "Generated" : "Original"}
                className="h-48 w-full object-cover"
              />
              <Badge
                variant={item.generatedImage ? "default" : "secondary"}
                className="absolute left-2 top-2"
              >
                {item.generatedImage ? "Generated" : "Original"}
              </Badge>
            </div>

            <div className="p-4">
              <div className="mb-3">
                <p className="mb-2 text-sm font-medium">Prompt:</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.prompt}</p>
              </div>

              <div className="mb-3">
                <p className="mb-2 text-sm font-medium">Result:</p>
                <div className="max-h-32 overflow-hidden">
                  <p className={`text-sm text-muted-foreground ${
                    expandedItem === item.id ? '' : 'line-clamp-3'
                  }`}>
                    {item.result}
                  </p>
                </div>
                {item.result.length > 150 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-auto p-0 text-xs"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <Expand className="mr-1 size-3" />
                    {expandedItem === item.id ? 'Show Less' : 'Show More'}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {item.timestamp.toLocaleString()}
              </div>

              {item.usage && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Tokens: {item.usage.total_tokens}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(item)}
                >
                  <Download className="mr-1 size-3" />
                  {item.generatedImage ? 'Save Image' : 'Save Original'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleShare(item)}
                >
                  <Share2 className="mr-1 size-3" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}