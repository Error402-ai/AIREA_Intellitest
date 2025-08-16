"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Brain, Play, Download, Share } from "lucide-react"

interface AssessmentPreviewProps {
  assessment: {
    id: string
    title: string
    questions: Array<{
      id: number
      question: string
      type: string
      difficulty: number
      bloomsLevel: string
    }>
    timeLimit: number
    createdAt: string
  }
}

export function AssessmentPreview({ assessment }: AssessmentPreviewProps) {
  const router = useRouter()

  const handleStartAssessment = () => {
    router.push(`/take-assessment/${assessment.id}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Assessment Generated Successfully!</span>
            </CardTitle>
            <CardDescription>Your personalized assessment is ready to use</CardDescription>
          </div>
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ready
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Assessment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{assessment.questions.length} Questions</p>
              <p className="text-xs text-muted-foreground">Mixed difficulty levels</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{assessment.timeLimit} Minutes</p>
              <p className="text-xs text-muted-foreground">Recommended time</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Brain className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">AI Generated</p>
              <p className="text-xs text-muted-foreground">Personalized content</p>
            </div>
          </div>
        </div>

        {/* Sample Questions Preview */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Sample Questions Preview</h4>
          <div className="space-y-3">
            {assessment.questions.slice(0, 3).map((question) => (
              <div key={question.id} className="border rounded-lg p-3 bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium">Q{question.id}</span>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {question.type.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {question.bloomsLevel}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{question.question}</p>
              </div>
            ))}
            {assessment.questions.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                ... and {assessment.questions.length - 3} more questions
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1" onClick={handleStartAssessment}>
            <Play className="mr-2 h-4 w-4" />
            Start Assessment
          </Button>
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="lg">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
