"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Presentation } from "lucide-react"

interface Material {
  id: string
  name: string
  concepts: string[]
}

interface MaterialSelectorProps {
  materials: Material[]
  selectedMaterials: string[]
  onChange: (selectedIds: string[]) => void
}

export function MaterialSelector({ materials, selectedMaterials, onChange }: MaterialSelectorProps) {
  const handleToggle = (materialId: string) => {
    const newSelection = selectedMaterials.includes(materialId)
      ? selectedMaterials.filter((id) => id !== materialId)
      : [...selectedMaterials, materialId]

    onChange(newSelection)
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return FileText
    if (fileName.endsWith(".ppt") || fileName.endsWith(".pptx")) return Presentation
    return FileText
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => {
        const isSelected = selectedMaterials.includes(material.id)
        const Icon = getFileIcon(material.name)

        return (
          <Card
            key={material.id}
            className={`cursor-pointer transition-all hover:shadow-sm ${
              isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
            onClick={() => handleToggle(material.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox checked={isSelected} onChange={() => handleToggle(material.id)} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-foreground truncate">{material.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {material.concepts.map((concept, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {materials.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No study materials uploaded yet.</p>
          <p className="text-sm">Upload materials first to generate assessments.</p>
        </div>
      )}
    </div>
  )
}
