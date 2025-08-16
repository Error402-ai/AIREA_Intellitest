"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, Zap, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface FlashcardSet {
  id: string
  title: string
  description: string
  cardCount: number
  studiedToday: number
  nextReview: string
  difficulty: "easy" | "medium" | "hard"
  subject: string
}

interface FlashcardDeckProps {
  deck: FlashcardSet
}

export function FlashcardDeck({ deck }: FlashcardDeckProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const studyProgress = (deck.studiedToday / deck.cardCount) * 100
  const isReviewDue = new Date(deck.nextReview) <= new Date()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{deck.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{deck.description}</p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Deck Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{deck.cardCount} cards</span>
          </div>
          <Badge className={getDifficultyColor(deck.difficulty)}>{deck.difficulty}</Badge>
        </div>

        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Today's Progress</span>
            <span>
              {deck.studiedToday}/{deck.cardCount}
            </span>
          </div>
          <Progress value={studyProgress} className="h-2" />
        </div>

        {/* Next Review */}
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Next review {isReviewDue ? "now" : formatDistanceToNow(new Date(deck.nextReview), { addSuffix: true })}
          </span>
        </div>

        {/* Subject Badge */}
        <Badge variant="outline" className="w-fit">
          {deck.subject}
        </Badge>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button className="flex-1" variant={isReviewDue ? "default" : "outline"}>
            {isReviewDue ? (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Review Now
              </>
            ) : (
              "Study Cards"
            )}
          </Button>
          <Button variant="outline">Edit</Button>
        </div>
      </CardContent>
    </Card>
  )
}
