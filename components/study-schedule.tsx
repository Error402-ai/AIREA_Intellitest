"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Brain, BookOpen } from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"

interface StudyPlan {
  id: string
  title: string
  activities: StudyActivity[]
}

interface StudyActivity {
  id: string
  type: "flashcards" | "practice" | "review" | "assessment"
  title: string
  estimatedTime: number
  completed: boolean
  dueDate: string
}

interface FlashcardSet {
  id: string
  title: string
  nextReview: string
  cardCount: number
}

interface StudyScheduleProps {
  plans: StudyPlan[]
  flashcards: FlashcardSet[]
}

export function StudySchedule({ plans, flashcards }: StudyScheduleProps) {
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i))

  const getScheduleForDay = (date: Date) => {
    const activities = plans.flatMap((plan) =>
      plan.activities
        .filter((activity) => isSameDay(new Date(activity.dueDate), date))
        .map((activity) => ({
          ...activity,
          planTitle: plan.title,
          source: "plan" as const,
        })),
    )

    const reviews = flashcards
      .filter((deck) => isSameDay(new Date(deck.nextReview), date))
      .map((deck) => ({
        id: deck.id,
        type: "flashcards" as const,
        title: `Review ${deck.title}`,
        estimatedTime: Math.ceil(deck.cardCount / 2), // Estimate 2 cards per minute
        completed: false,
        dueDate: deck.nextReview,
        planTitle: "Flashcard Review",
        source: "flashcard" as const,
      }))

    return [...activities, ...reviews].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "flashcards":
        return <Brain className="h-4 w-4" />
      case "practice":
        return <BookOpen className="h-4 w-4" />
      case "review":
        return <BookOpen className="h-4 w-4" />
      case "assessment":
        return <Calendar className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "flashcards":
        return "bg-purple-100 text-purple-800"
      case "practice":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-green-100 text-green-800"
      case "assessment":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Study Schedule</h2>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          View Full Calendar
        </Button>
      </div>

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weekDays.slice(0, 4).map((day, index) => {
          const daySchedule = getScheduleForDay(day)
          const isToday = isSameDay(day, today)
          const totalTime = daySchedule.reduce((sum, item) => sum + item.estimatedTime, 0)

          return (
            <Card key={index} className={isToday ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{format(day, "EEE, MMM d")}</span>
                  {isToday && <Badge variant="default">Today</Badge>}
                </CardTitle>
                {totalTime > 0 && (
                  <CardDescription className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{totalTime} min total</span>
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {daySchedule.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No activities scheduled</p>
                ) : (
                  daySchedule.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getActivityIcon(item.type)}
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <Badge className={getActivityColor(item.type)} variant="secondary">
                          {item.type}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">{item.planTitle}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.estimatedTime} min</span>
                        {item.completed ? (
                          <Badge variant="default" className="text-xs">
                            Completed
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs h-6 bg-transparent">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Today's Focus */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Focus</CardTitle>
          <CardDescription>Recommended activities for optimal learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-purple-500" />
                Priority Reviews
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Machine Learning Terms</span>
                  <Badge variant="secondary">12 cards</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Statistical Distributions</span>
                  <Badge variant="secondary">8 cards</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                Study Activities
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Neural Network Review</span>
                  <Badge variant="secondary">45 min</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Probability Practice</span>
                  <Badge variant="secondary">25 min</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
