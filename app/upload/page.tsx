"use client"

import { useState, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUploadZone } from "@/components/file-upload-zone"
import { FilePreview } from "@/components/file-preview"
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, Brain } from "lucide-react"
import { FileProcessor } from "@/lib/file-processor"
import { getDatabaseService, AnalyticsService } from "@/lib/database"
import type { StudyMaterial } from "@/lib/types"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedText?: string
  concepts?: string[]
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedMaterials, setProcessedMaterials] = useState<StudyMaterial[]>([])

  const fileProcessor = new FileProcessor()
  const db = getDatabaseService()
  const analytics = new AnalyticsService(db)

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    // Validate files first
    const validFiles: File[] = []
    const invalidFiles: { file: File; error: string }[] = []

    for (const file of selectedFiles) {
      const validation = fileProcessor.validateFile(file)
      if (validation.isValid) {
        validFiles.push(file)
      } else {
        invalidFiles.push({ file, error: validation.error || "Invalid file" })
      }
    }

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      console.error("Invalid files:", invalidFiles)
      // In a real app, you'd show these errors to the user
    }

    if (validFiles.length === 0) return

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setIsProcessing(true)

    // Process files using the file processor
    try {
      const result = await fileProcessor.processFiles(validFiles)
      
      if (result.success) {
        // Update files with processed content
        setFiles((prev) => 
          prev.map((file) => {
            const processedMaterial = result.materials.find(m => m.name === file.name)
            if (processedMaterial) {
              return {
                ...file,
                status: "completed" as const,
                extractedText: processedMaterial.content,
                concepts: processedMaterial.concepts,
                progress: 100,
              }
            }
            return file
          })
        )

        // Save materials to database
        for (const material of result.materials) {
          await db.saveStudyMaterial(material)
        }
        setProcessedMaterials(result.materials)

        // Track analytics
        await analytics.trackFileUpload(result.materials)

        console.log(`Successfully processed ${result.materials.length} files`)
      } else {
        console.error("File processing failed:", result.error)
        setFiles((prev) => 
          prev.map((file) => ({
            ...file,
            status: "error" as const,
            error: result.error || "Processing failed",
          }))
        )
      }
    } catch (error) {
      console.error("Error processing files:", error)
      setFiles((prev) => 
        prev.map((file) => ({
          ...file,
          status: "error" as const,
          error: "Failed to process file",
        }))
      )
    } finally {
      setIsProcessing(false)
    }
  }, [fileProcessor, db, analytics])

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "processing":
        return <Brain className="h-4 w-4 text-blue-500 animate-pulse" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const completedFiles = files.filter((f) => f.status === "completed")
  const totalExtractedText = completedFiles.reduce((acc, file) => acc + (file.extractedText?.length || 0), 0)
  const totalConcepts = completedFiles.reduce((acc, file) => acc + (file.concepts?.length || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Upload Study Materials</h1>
            <p className="text-muted-foreground">
              Upload your PDFs, PowerPoint presentations, and other study materials to generate personalized
              assessments.
            </p>
          </div>

          {/* Upload stats */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Files Uploaded</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-1">{files.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Processed</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-1">{completedFiles.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Text Extracted</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {(totalExtractedText / 1000).toFixed(1)}k chars
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Concepts Found</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalConcepts}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* File upload zone */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Drag and drop your study materials or click to browse. Supported formats: {fileProcessor.getSupportedFormats().join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadZone onFilesSelected={handleFilesSelected} disabled={isProcessing} />
            </CardContent>
          </Card>

          {/* Processing indicator */}
          {isProcessing && (
            <Alert className="mb-6">
              <Brain className="h-4 w-4" />
              <AlertDescription>
                Processing files... This may take a few moments while we extract text content and identify key concepts.
              </AlertDescription>
            </Alert>
          )}

          {/* Uploaded files list */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Materials</CardTitle>
                <CardDescription>Review your uploaded files and their processing status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(file.status)}
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={file.status === "completed" ? "default" : "secondary"}>{file.status}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {file.status === "uploading" && <Progress value={file.progress} className="mb-2" />}

                    {file.status === "error" && file.error && (
                      <Alert variant="destructive">
                        <AlertDescription>{file.error}</AlertDescription>
                      </Alert>
                    )}

                    {file.status === "completed" && file.extractedText && (
                      <div className="space-y-3">
                        {file.concepts && file.concepts.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Key Concepts Identified:</p>
                            <div className="flex flex-wrap gap-2">
                              {file.concepts.slice(0, 8).map((concept, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {concept}
                                </Badge>
                              ))}
                              {file.concepts.length > 8 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.concepts.length - 8} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        <FilePreview content={file.extractedText} fileName={file.name} />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Next steps */}
          {completedFiles.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">Materials Ready!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your study materials have been processed and are ready for assessment generation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" onClick={() => window.location.href = "/generate"}>
                      Generate Assessment
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => window.location.href = "/study-plans"}>
                      View Study Plans
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
