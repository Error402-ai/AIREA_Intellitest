"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Target, Play, MoreHorizontal, CheckCircle, Circle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface StudyPlan {
  id: string
  title: string
  description: string
  targetSkills: string[]
  estimatedHours: number
  difficulty: number
  progress: number
  dueDate: string
  status: "active" | "completed" | "paused"
  activities: StudyActivity[]
}

interface StudyActivity {
  id: string
  type: "flashcards" | "practice" | "review" | "assessment"
  title: string
  description: string
  estimatedTime: number
  completed: boolean
  dueDate: string
}

interface StudyPlanCardProps {
  plan: StudyPlan
  onToggleActivity?: (planId: string, activityId: string) => void
  onViewDetails?: () => void
  onContinuePlan?: () => void
}

export function StudyPlanCard({ plan, onToggleActivity, onViewDetails, onContinuePlan }: StudyPlanCardProps) {
  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"]
    return labels[difficulty] || "Medium"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedActivities = plan.activities.filter((a) => a.completed).length
  const nextActivity = plan.activities.find((a) => !a.completed)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{plan.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{plan.progress}%</span>
          </div>
          <Progress value={plan.progress} className="h-2" />
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{plan.estimatedHours}h total</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{getDifficultyLabel(plan.difficulty)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Due {formatDistanceToNow(new Date(plan.dueDate), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Play className="h-4 w-4 text-muted-foreground" />
            <span>
              {completedActivities}/{plan.activities.length} activities
            </span>
          </div>
        </div>

        {/* Target Skills */}
        <div>
          <h4 className="text-sm font-medium mb-2">Target Skills</h4>
          <div className="flex flex-wrap gap-1">
            {plan.targetSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Activities</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {plan.activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                onClick={() => onToggleActivity?.(plan.id, activity.id)}
              >
                {activity.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${activity.completed ? "line-through text-muted-foreground" : ""}`}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.estimatedTime} min</p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Next Activity */}
        {nextActivity && (
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-1">Next Activity</h4>
            <p className="text-sm text-muted-foreground mb-2">{nextActivity.title}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{nextActivity.estimatedTime} min</span>
              <Button size="sm" onClick={() => onToggleActivity?.(plan.id, nextActivity.id)}>
                Start
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button className="flex-1" onClick={onContinuePlan}>Continue Plan</Button>
          <Button variant="outline" onClick={onViewDetails}>View Details</Button>
        </div>
      </CardContent>
    </Card>
  )
}
