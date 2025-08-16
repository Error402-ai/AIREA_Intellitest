"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Award, Eye, TrendingUp, TrendingDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TestResult {
  id: string
  title: string
  type: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  timeLimit: number
  difficulty: number
  bloomsLevel: string
  completedAt: string
  feedback: string
  strengths: string[]
  improvements: string[]
}

interface TestResultCardProps {
  result: TestResult
  onViewDetails?: () => void
  onRetakeTest?: () => void
}

export function TestResultCard({ result, onViewDetails, onRetakeTest }: TestResultCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 80) return "secondary"
    if (score >= 70) return "outline"
    return "destructive"
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"]
    return labels[difficulty] || "Medium"
  }

  const timeEfficiency = (result.timeSpent / result.timeLimit) * 100

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{result.title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Badge variant="outline">{result.type}</Badge>
              <Badge variant="secondary">{getDifficultyLabel(result.difficulty)}</Badge>
              <Badge variant="outline" className="capitalize">
                {result.bloomsLevel}
              </Badge>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(result.completedAt), { addSuffix: true })}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</div>
            <div className="text-sm text-muted-foreground">
              {result.correctAnswers}/{result.totalQuestions} correct
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Score Progress</span>
            <span>{result.score}%</span>
          </div>
          <Progress value={result.score} className="h-2" />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {result.timeSpent}m / {result.timeLimit}m
              </p>
              <p className="text-xs text-muted-foreground">
                {timeEfficiency < 80 ? "Efficient" : timeEfficiency < 100 ? "Good pace" : "Consider more time"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Performance</p>
              <div className="flex items-center space-x-1">
                {result.score >= 85 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-orange-500" />
                )}
                <p className="text-xs text-muted-foreground">
                  {result.score >= 85 ? "Excellent" : result.score >= 70 ? "Good" : "Needs improvement"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">{result.feedback}</p>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">Strengths</h4>
            <div className="space-y-1">
              {result.strengths.slice(0, 2).map((strength, index) => (
                <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-orange-700 mb-2">Focus Areas</h4>
            <div className="space-y-1">
              {result.improvements.slice(0, 2).map((improvement, index) => (
                <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                  {improvement}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={onRetakeTest}>
            Retake Test
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
