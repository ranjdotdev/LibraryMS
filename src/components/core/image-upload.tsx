import { useState, useRef, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  Loading03Icon,
  Upload04Icon,
  CropIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/core/button"
import { Label } from "@/components/core/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/core/dialog"
import { Slider } from "@/components/core/slider"
import { api } from "@/api/client"
import { useLanguage } from "@/providers/language-provider"

type ImageUploadProps = {
  label: string
  description?: string
  currentUrl?: string | null
  onUpload: (url: string) => void
  onClear?: () => void
  size?: number
  quality?: number
}

export function ImageUpload({
  label,
  description,
  currentUrl,
  onUpload,
  onClear,
  size = 256,
  quality = 0.85,
}: ImageUploadProps) {
  const { t } = useLanguage()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError(t.upload.selectImageFile)
      return
    }

    setError(null)
    const img = new Image()
    img.onload = () => {
      setOriginalImage(img)
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setCropDialogOpen(true)
    }
    img.src = URL.createObjectURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCropAndUpload = async () => {
    if (!originalImage) return

    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = size
    outputCanvas.height = size
    const ctx = outputCanvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    const previewSize = 256
    const scaleFactor = size / previewSize

    const imgAspect = originalImage.width / originalImage.height
    let drawWidth: number
    let drawHeight: number

    if (imgAspect > 1) {
      drawHeight = previewSize * scale
      drawWidth = drawHeight * imgAspect
    } else {
      drawWidth = previewSize * scale
      drawHeight = drawWidth / imgAspect
    }

    const x = ((previewSize - drawWidth) / 2 + position.x) * scaleFactor
    const y = ((previewSize - drawHeight) / 2 + position.y) * scaleFactor

    ctx.drawImage(
      originalImage,
      x,
      y,
      drawWidth * scaleFactor,
      drawHeight * scaleFactor
    )

    setCropDialogOpen(false)
    setUploading(true)

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
          "image/jpeg",
          quality
        )
      })

      const file = new File([blob], "image.jpg", { type: "image/jpeg" })

      const response = await api.upload<{
        id: string
        stored_file_id: string
        name: string
        size_bytes: number
        mime_type: string
      }>("/me/storage/files", file)

      const fileUrl = `/api/v1/me/storage/files/${response.id}`
      setPreviewUrl(outputCanvas.toDataURL("image/jpeg", quality))
      onUpload(fileUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.upload.failed)
    } finally {
      setUploading(false)
      if (originalImage.src.startsWith("blob:")) {
        URL.revokeObjectURL(originalImage.src)
      }
      setOriginalImage(null)
    }
  }

  const handleClear = () => {
    setPreviewUrl(null)
    setError(null)
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="flex items-start gap-4">
        <div
          className="relative size-24 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={t.upload.preview}
              className="size-full object-cover"
            />
          ) : (
            <HugeiconsIcon
              icon={Upload04Icon}
              className="size-8 text-muted-foreground/50"
            />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="size-6 animate-spin text-primary"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <HugeiconsIcon icon={Upload04Icon} className="size-4 me-2" />
            {previewUrl ? t.upload.change : t.upload.upload}
          </Button>
          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={uploading}
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-4 me-2" />
              {t.upload.remove}
            </Button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={CropIcon} className="size-5" />
              {t.upload.cropImage}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t.upload.cropHint}
            </p>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={256}
                height={256}
                className="border rounded-lg cursor-move bg-muted"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">{t.upload.zoom}</Label>
              <Slider
                value={[scale]}
                onValueChange={([v]) => setScale(v)}
                min={0.5}
                max={3}
                step={0.1}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCropDialogOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="button" onClick={handleCropAndUpload}>
              {t.upload.cropAndUpload}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CropPreviewEffect
        canvasRef={canvasRef}
        originalImage={originalImage}
        scale={scale}
        position={position}
        active={cropDialogOpen}
      />
    </div>
  )
}

function CropPreviewEffect({
  canvasRef,
  originalImage,
  scale,
  position,
  active,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  originalImage: HTMLImageElement | null
  scale: number
  position: { x: number; y: number }
  active: boolean
}) {
  useEffect(() => {
    if (!active || !canvasRef.current || !originalImage) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const previewSize = 256
    canvas.width = previewSize
    canvas.height = previewSize

    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, previewSize, previewSize)

    const imgAspect = originalImage.width / originalImage.height
    let drawWidth: number
    let drawHeight: number

    if (imgAspect > 1) {
      drawHeight = previewSize * scale
      drawWidth = drawHeight * imgAspect
    } else {
      drawWidth = previewSize * scale
      drawHeight = drawWidth / imgAspect
    }

    const x = (previewSize - drawWidth) / 2 + position.x
    const y = (previewSize - drawHeight) / 2 + position.y

    ctx.drawImage(originalImage, x, y, drawWidth, drawHeight)
  }, [canvasRef, originalImage, scale, position, active])

  return null
}
