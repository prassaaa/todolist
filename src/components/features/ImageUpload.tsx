import { useState, useRef, useCallback } from 'react'
import { Label } from '@/components/ui/label'
import { ImagePlus, X, Upload } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (value: string | undefined) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(
    value && value.length > 0 ? value : undefined
  )
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setPreview(base64)
      onChange(base64)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleRemove = () => {
    setPreview(undefined)
    onChange(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">Image *</Label>

      {preview ? (
        <div className="relative group rounded-2xl overflow-hidden ring-1 ring-border/50">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-44 object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full bg-black/50 text-white hover:bg-red-500 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`w-full rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isDragOver
              ? 'border-2 border-violet-400 bg-violet-50/50 dark:bg-violet-950/20'
              : 'border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-accent/30'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          disabled={disabled}
        >
          <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-colors ${
            isDragOver
              ? 'bg-violet-100 dark:bg-violet-900/30'
              : 'bg-muted/60'
          }`}>
            {isDragOver ? (
              <Upload className="w-5 h-5 text-violet-500" />
            ) : (
              <ImagePlus className="w-5 h-5 text-muted-foreground/60" />
            )}
          </div>
          <p className="text-sm font-medium text-foreground/70 mb-0.5">
            {isDragOver ? 'Drop image here' : 'Upload an image'}
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            Drag & drop or click to browse. PNG, JPG, WebP up to 5MB
          </p>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled}
      />
    </div>
  )
}
