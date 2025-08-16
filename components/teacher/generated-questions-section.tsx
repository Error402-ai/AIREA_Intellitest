import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, MessageSquare, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GeneratedQuestion } from "@/lib/types"

interface GeneratedQuestionsSectionProps {
  generatedQuestions: GeneratedQuestion[]
  handleQuestionAction: (questionId: string, action: "approve" | "reject" | "feedback" | "edit") => void
}

export function GeneratedQuestionsSection({ 
  generatedQuestions, 
  handleQuestionAction 
}: GeneratedQuestionsSectionProps) {
  if (generatedQuestions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Questions</CardTitle>
        <CardDescription>
          Review and manage AI-generated questions from your uploaded materials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {generatedQuestions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">{question.question}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Badge variant="outline" className="text-xs">{question.type.toUpperCase()}</Badge>
                    <Badge variant="secondary" className="text-xs">Difficulty: {question.difficulty}/5</Badge>
                    <Badge variant="outline" className="capitalize text-xs">{question.bloomsLevel}</Badge>
                    <span>•</span>
                    <span>Quality: {Math.round(question.qualityScore * 100)}%</span>
                  </div>
                  <Badge 
                    className={cn(
                      "status-indicator text-xs",
                      question.status === "approved" && "status-success",
                      question.status === "rejected" && "status-error",
                      question.status === "needs_feedback" && "status-warning",
                      question.status === "pending" && "status-info"
                    )}
                  >
                    {question.status === "approved" && "✓ Approved"}
                    {question.status === "rejected" && "✗ Rejected"}
                    {question.status === "needs_feedback" && "⚠ Needs Feedback"}
                    {question.status === "pending" && "⏳ Pending"}
                  </Badge>
                </div>
              </div>

              {question.type === "mcq" && question.options && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Options:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option, index) => (
                      <div key={index} className="text-sm p-2 border rounded">
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Correct Answer:</span> {question.correctAnswer}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {question.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleQuestionAction(question.id, "approve")}
                    disabled={question.status === "approved"}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuestionAction(question.id, "feedback")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Feedback
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuestionAction(question.id, "edit")}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleQuestionAction(question.id, "reject")}
                    disabled={question.status === "rejected"}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
