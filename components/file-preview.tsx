"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, FileText, Brain } from "lucide-react"

interface FilePreviewProps {
  content: string
  fileName: string
}

export function FilePreview({ content, fileName }: FilePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const lines = content.split("\n")
  const previewLines = lines.slice(0, 5)
  const displayContent = isExpanded ? content : previewLines.join("\n")

  // Extract key concepts (simple keyword extraction simulation)
  const extractKeywords = (text: string) => {
    const keywords = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
    return [...new Set(keywords)].slice(0, 6)
  }

  const keywords = extractKeywords(content)

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Content Preview</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Expand
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Extracted text */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Extracted Text</h4>
          <div className="bg-muted rounded-lg p-3 text-sm font-mono">
            <pre className="whitespace-pre-wrap text-muted-foreground">
              {displayContent}
              {!isExpanded && lines.length > 5 && (
                <span className="text-primary">\n... ({lines.length - 5} more lines)</span>
              )}
            </pre>
          </div>
        </div>

        {/* Key concepts */}
        {keywords.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Key Concepts Identified</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{content.length}</p>
            <p className="text-xs text-muted-foreground">Characters</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{content.split(/\s+/).length}</p>
            <p className="text-xs text-muted-foreground">Words</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{lines.length}</p>
            <p className="text-xs text-muted-foreground">Lines</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{keywords.length}</p>
            <p className="text-xs text-muted-foreground">Concepts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
