import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, Clock, BarChart3 } from "lucide-react"
import type { User } from "@/lib/types"

interface StatsCardsProps {
  students: any[]
  generatedQuestions: any[]
  overallStats: {
    totalStudents: number
    activeStudents: number
    totalQuestions: number
    approvedQuestions: number
    averageQualityScore: number
    improvementRate: number
  }
}

export function StatsCards({ students, generatedQuestions, overallStats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.activeStudents}</p>
              <p className="text-xs text-green-600 mt-1">+{overallStats.improvementRate}% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Generated Questions</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalQuestions}</p>
              <p className="text-xs text-green-600 mt-1">{overallStats.approvedQuestions} approved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {generatedQuestions.filter((q) => q.status === "pending").length}
              </p>
              <p className="text-xs text-orange-600 mt-1">Requires attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Quality Score</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.averageQualityScore}/10</p>
              <p className="text-xs text-purple-600 mt-1">Excellent quality</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

