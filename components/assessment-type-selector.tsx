"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Calculator, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssessmentTypeSelectorProps {
  value: "mcq" | "subjective" | "numerical" | "mixed"
  onChange: (type: "mcq" | "subjective" | "numerical" | "mixed") => void
}

const assessmentTypes = [
  {
    id: "mcq" as const,
    name: "Multiple Choice",
    description: "Quick assessment with predefined options",
    icon: CheckCircle,
    badge: "Popular",
  },
  {
    id: "subjective" as const,
    name: "Subjective",
    description: "Open-ended questions for detailed responses",
    icon: FileText,
    badge: "Comprehensive",
  },
  {
    id: "numerical" as const,
    name: "Numerical",
    description: "Math and calculation-based problems",
    icon: Calculator,
    badge: "Precise",
  },
  {
    id: "mixed" as const,
    name: "Mixed Format",
    description: "Combination of different question types",
    icon: Layers,
    badge: "Balanced",
  },
]

export function AssessmentTypeSelector({ value, onChange }: AssessmentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assessmentTypes.map((type) => {
        const Icon = type.icon
        const isSelected = value === type.id

        return (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
            )}
            onClick={() => onChange(type.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground">{type.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {type.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
