"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function FileUploadZone({ onFilesSelected, disabled }: FileUploadZoneProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        setError("Some files were rejected. Please upload PDF or PowerPoint files only.")
        return
      }

      if (acceptedFiles.length === 0) {
        setError("No valid files selected.")
        return
      }

      onFilesSelected(acceptedFiles)
    },
    [onFilesSelected],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-1">
              {isDragActive ? "Drop files here" : "Upload your study materials"}
            </h3>
            <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
          </div>

          <Button variant="outline" disabled={disabled}>
            <FileText className="mr-2 h-4 w-4" />
            Choose Files
          </Button>

          <p className="text-xs text-muted-foreground">Supports PDF, PPT, PPTX files up to 50MB each</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
