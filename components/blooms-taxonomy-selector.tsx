"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BloomsTaxonomySelectorProps {
  value: string
  onChange: (level: string) => void
}

const bloomsLevels = [
  {
    id: "remember",
    name: "Remember",
    description: "Recall facts and basic concepts",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    level: 1,
  },
  {
    id: "understand",
    name: "Understand",
    description: "Explain ideas or concepts",
    color: "bg-green-100 text-green-800 border-green-200",
    level: 2,
  },
  {
    id: "apply",
    name: "Apply",
    description: "Use information in new situations",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    level: 3,
  },
  {
    id: "analyze",
    name: "Analyze",
    description: "Draw connections among ideas",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    level: 4,
  },
  {
    id: "evaluate",
    name: "Evaluate",
    description: "Justify a stand or decision",
    color: "bg-red-100 text-red-800 border-red-200",
    level: 5,
  },
  {
    id: "create",
    name: "Create",
    description: "Produce new or original work",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    level: 6,
  },
]

export function BloomsTaxonomySelector({ value, onChange }: BloomsTaxonomySelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {bloomsLevels.map((level) => {
          const isSelected = value === level.id

          return (
            <Button
              key={level.id}
              variant={isSelected ? "default" : "outline"}
              className={cn("h-auto p-3 flex flex-col items-start text-left", !isSelected && "hover:bg-muted/50")}
              onClick={() => onChange(level.id)}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  L{level.level}
                </Badge>
                <span className="font-medium">{level.name}</span>
              </div>
              <span className="text-xs opacity-80">{level.description}</span>
            </Button>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium capitalize">{value}</span> -{" "}
          {bloomsLevels.find((l) => l.id === value)?.description}
        </p>
      </div>
    </div>
  )
}
