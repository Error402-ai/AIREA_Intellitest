"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Award, TrendingUp, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TestResult {
  id: string
  title: string
  type: string
  score: number
  completedAt: string
  bloomsLevel: string
}

interface RecentActivityProps {
  results: TestResult[]
}

export function RecentActivity({ results }: RecentActivityProps) {
  const activities = results
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .map((result) => ({
      id: result.id,
      type: "test_completed",
      title: `Completed ${result.title}`,
      description: `Scored ${result.score}% on ${result.type} assessment`,
      timestamp: result.completedAt,
      score: result.score,
      testType: result.type,
      bloomsLevel: result.bloomsLevel,
    }))

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "test_completed":
        return <FileText className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Your recent learning activities and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">{getActivityIcon(activity.type)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>

                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.testType}
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {activity.bloomsLevel}
                    </Badge>
                    <span className={`text-sm font-medium ${getScoreColor(activity.score)}`}>{activity.score}%</span>
                  </div>
                </div>

                {index < activities.length - 1 && <div className="absolute left-4 mt-8 h-6 w-px bg-border" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span className="text-sm">Scored 90%+ on AI Ethics Assessment</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <span className="text-sm">Completed 3 assessments this week</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-purple-500 rounded-full" />
              <span className="text-sm">Improved average score by 12%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-medium mb-1">Best Performance Time</p>
              <p className="text-muted-foreground">Afternoons (2-4 PM)</p>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-1">Strongest Skill Area</p>
              <p className="text-muted-foreground">Ethical Reasoning & Analysis</p>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-1">Recommended Focus</p>
              <p className="text-muted-foreground">Probability & Statistics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
