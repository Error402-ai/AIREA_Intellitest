import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Brain } from "lucide-react"
import { Loading, LoadingState } from "@/components/ui/loading"
import { cn } from "@/lib/utils"
import { FileProcessor } from "@/lib/file-processor"
import type { UploadedMaterial } from "@/lib/types"

interface FileUploadSectionProps {
  uploadedMaterials: UploadedMaterial[]
  setUploadedMaterials: (materials: UploadedMaterial[]) => void
  isUploading: boolean
  setIsUploading: (uploading: boolean) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  generateQuestionsFromMaterial: (material: UploadedMaterial) => Promise<void>
}

export function FileUploadSection({
  uploadedMaterials,
  setUploadedMaterials,
  isUploading,
  setIsUploading,
  isGenerating,
  setIsGenerating,
  generateQuestionsFromMaterial
}: FileUploadSectionProps) {
  const fileProcessor = new FileProcessor()

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newMaterials: UploadedMaterial[] = []

    for (const file of files) {
      const validation = fileProcessor.validateFile(file)
      if (!validation.isValid) {
        console.error(`Invalid file: ${file.name} - ${validation.error}`)
        continue
      }

      const material: UploadedMaterial = {
        id: `material-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        content: "",
        concepts: [],
        uploadedAt: new Date().toISOString(),
        questionCount: 0,
        status: "processing"
      }

      newMaterials.push(material)
      setUploadedMaterials([...uploadedMaterials, material])

      try {
        const result = await fileProcessor.processFiles([file])
        if (result.success && result.materials.length > 0) {
          const processedMaterial = result.materials[0]
          setUploadedMaterials(prev => 
            prev.map(m => 
              m.id === material.id 
                ? { 
                    ...m, 
                    content: processedMaterial.content,
                    concepts: processedMaterial.concepts || [],
                    status: "completed"
                  }
                : m
            )
          )
        } else {
          setUploadedMaterials(prev => 
            prev.map(m => 
              m.id === material.id 
                ? { ...m, status: "failed" }
                : m
            )
          )
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        setUploadedMaterials(prev => 
          prev.map(m => 
            m.id === material.id 
              ? { ...m, status: "failed" }
              : m
          )
        )
      }
    }

    setIsUploading(false)
  }, [fileProcessor, uploadedMaterials, setUploadedMaterials, setIsUploading])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF Materials</CardTitle>
          <CardDescription>
            Upload PDF files to generate AI-powered questions for your students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="file-upload-zone">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Upload PDF Files</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop PDF files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label htmlFor="file-upload">
              <Button asChild disabled={isUploading}>
                <span>
                  {isUploading ? (
                    <Loading type="spinner" size="sm" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {isUploading ? "Uploading..." : "Choose Files"}
                </span>
              </Button>
            </label>
            {isUploading && (
              <div className="mt-4">
                <LoadingState state="loading" text="Processing files..." />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Materials */}
      {uploadedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedMaterials.map((material) => (
                <div key={material.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{material.name}</h4>
                        <p className="text-sm text-gray-600">
                          {material.status === "completed" 
                            ? `${material.concepts.length} concepts extracted`
                            : material.status === "processing"
                            ? "Processing..."
                            : "Processing failed"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {material.status === "completed" && (
                        <Button 
                          onClick={() => generateQuestionsFromMaterial(material)}
                          disabled={isGenerating}
                          className="btn-success"
                        >
                          {isGenerating ? (
                            <Loading type="spinner" size="sm" />
                          ) : (
                            <Brain className="mr-2 h-4 w-4" />
                          )}
                          {isGenerating ? "Generating..." : "Generate Questions"}
                        </Button>
                      )}
                      <Badge 
                        className={cn(
                          "status-indicator",
                          material.status === "completed" && "status-success",
                          material.status === "processing" && "status-warning",
                          material.status === "failed" && "status-error"
                        )}
                      >
                        {material.status === "completed" && "✓ Ready"}
                        {material.status === "processing" && "⏳ Processing"}
                        {material.status === "failed" && "✗ Failed"}
                      </Badge>
                    </div>
                  </div>
                  
                  {material.concepts.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Key Concepts:</p>
                      <div className="flex flex-wrap gap-1">
                        {material.concepts.slice(0, 5).map((concept, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {concept}
                          </Badge>
                        ))}
                        {material.concepts.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{material.concepts.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

