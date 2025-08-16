"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StudyPlanCard } from "@/components/study-plan-card"
import { FlashcardDeck } from "@/components/flashcard-deck"
import { StudySchedule } from "@/components/study-schedule"
import { BookOpen, Brain, Target, Plus, Zap, Eye, Play, Calendar, Clock, Edit, Trash2 } from "lucide-react"

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

export default function StudyPlansPage() {
  const [activeTab, setActiveTab] = useState("plans")
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null)
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false)
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState(false)
  
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([
    {
      id: "plan-1",
      title: "Master Machine Learning Fundamentals",
      description: "Comprehensive study plan to strengthen your understanding of core ML concepts",
      targetSkills: ["Supervised Learning", "Neural Networks", "Model Evaluation"],
      estimatedHours: 12,
      difficulty: 3,
      progress: 65,
      dueDate: "2024-02-15",
      status: "active",
      activities: [
        {
          id: "act-1",
          type: "flashcards",
          title: "ML Terminology Review",
          description: "Review key machine learning terms and definitions",
          estimatedTime: 30,
          completed: true,
          dueDate: "2024-01-16",
        },
        {
          id: "act-2",
          type: "practice",
          title: "Supervised Learning Exercises",
          description: "Practice problems on classification and regression",
          estimatedTime: 60,
          completed: true,
          dueDate: "2024-01-17",
        },
        {
          id: "act-3",
          type: "review",
          title: "Neural Network Architecture",
          description: "Deep dive into neural network structures",
          estimatedTime: 45,
          completed: false,
          dueDate: "2024-01-18",
        },
      ],
    },
    {
      id: "plan-2",
      title: "Improve Statistical Analysis Skills",
      description: "Focus on probability distributions and hypothesis testing",
      targetSkills: ["Probability Distributions", "Hypothesis Testing", "Bayesian Statistics"],
      estimatedHours: 8,
      difficulty: 4,
      progress: 25,
      dueDate: "2024-02-20",
      status: "active",
      activities: [
        {
          id: "act-4",
          type: "flashcards",
          title: "Probability Concepts",
          description: "Master probability theory fundamentals",
          estimatedTime: 25,
          completed: false,
          dueDate: "2024-01-19",
        },
      ],
    },
  ])

  const toggleActivityCompletion = (planId: string, activityId: string) => {
    setStudyPlans((plans) =>
      plans.map((plan) => {
        if (plan.id === planId) {
          const updatedActivities = plan.activities.map((activity) =>
            activity.id === activityId ? { ...activity, completed: !activity.completed } : activity,
          )
          const completedCount = updatedActivities.filter((a) => a.completed).length
          const newProgress = Math.round((completedCount / updatedActivities.length) * 100)

          return { ...plan, activities: updatedActivities, progress: newProgress }
        }
        return plan
      }),
    )
  }

  const createNewPlan = () => {
    setIsCreatePlanOpen(true)
  }

  const handleCreatePlan = (planData: Partial<StudyPlan>) => {
    const newPlan: StudyPlan = {
      id: `plan-${Date.now()}`,
      title: planData.title || "Custom Study Plan",
      description: planData.description || "Personalized study plan based on your recent assessments",
      targetSkills: planData.targetSkills || ["Critical Thinking", "Problem Solving"],
      estimatedHours: planData.estimatedHours || 6,
      difficulty: planData.difficulty || 3,
      progress: 0,
      dueDate: planData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "assessment",
          title: "Initial Assessment",
          description: "Evaluate current knowledge level",
          estimatedTime: 30,
          completed: false,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
      ],
    }
    setStudyPlans((plans) => [...plans, newPlan])
    setIsCreatePlanOpen(false)
  }

  const handleViewDetails = (plan: StudyPlan) => {
    setSelectedPlan(plan)
    setIsViewDetailsOpen(true)
  }

  const handleContinuePlan = (plan: StudyPlan) => {
    // Navigate to the next incomplete activity
    const nextActivity = plan.activities.find(a => !a.completed)
    if (nextActivity) {
      console.log(`Continuing plan: ${plan.title}, next activity: ${nextActivity.title}`)
      // In a real app, this would navigate to the activity page
      window.location.href = `/study-activity?plan=${plan.id}&activity=${nextActivity.id}`
    }
  }

  const handleStartRecommendedPlan = (title: string, hours: number) => {
    const newPlan: StudyPlan = {
      id: `plan-${Date.now()}`,
      title,
      description: `Recommended study plan for ${title.toLowerCase()}`,
      targetSkills: [title],
      estimatedHours: hours,
      difficulty: 3,
      progress: 0,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "assessment",
          title: "Initial Assessment",
          description: "Evaluate current knowledge level",
          estimatedTime: 30,
          completed: false,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
      ],
    }
    setStudyPlans((plans) => [...plans, newPlan])
    setActiveTab("plans")
  }

  const handleCreateDeck = () => {
    setIsCreateDeckOpen(true)
  }

  const handleStartReviewSession = () => {
    setIsReviewSessionOpen(true)
  }

  // Mock flashcard sets
  const flashcardSets: FlashcardSet[] = [
    {
      id: "deck-1",
      title: "Machine Learning Terminology",
      description: "Essential ML terms and definitions",
      cardCount: 45,
      studiedToday: 12,
      nextReview: "2024-01-16T14:00:00Z",
      difficulty: "medium",
      subject: "Machine Learning",
    },
    {
      id: "deck-2",
      title: "Statistical Distributions",
      description: "Key probability distributions and their properties",
      cardCount: 28,
      studiedToday: 0,
      nextReview: "2024-01-16T16:30:00Z",
      difficulty: "hard",
      subject: "Statistics",
    },
    {
      id: "deck-3",
      title: "AI Ethics Principles",
      description: "Core ethical concepts in artificial intelligence",
      cardCount: 20,
      studiedToday: 8,
      nextReview: "2024-01-17T10:00:00Z",
      difficulty: "easy",
      subject: "AI Ethics",
    },
  ]

  const totalStudyHours = studyPlans.reduce((sum, plan) => sum + plan.estimatedHours, 0)
  const completedHours = studyPlans.reduce((sum, plan) => sum + (plan.estimatedHours * plan.progress) / 100, 0)
  const activeFlashcards = flashcardSets.reduce((sum, set) => sum + set.cardCount, 0)
  const studiedToday = flashcardSets.reduce((sum, set) => sum + set.studiedToday, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Study Plans & Flashcards</h1>
            <p className="text-muted-foreground">
              Personalized study recommendations and spaced repetition learning to maximize your progress.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Active Plans</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{studyPlans.length}</p>
                <p className="text-xs text-muted-foreground mt-1">{totalStudyHours}h total</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-muted-foreground">Study Progress</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{Math.round(completedHours)}h</p>
                <p className="text-xs text-blue-600 mt-1">
                  {Math.round((completedHours / totalStudyHours) * 100)}% complete
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-muted-foreground">Flashcards</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{activeFlashcards}</p>
                <p className="text-xs text-muted-foreground mt-1">{flashcardSets.length} decks</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-muted-foreground">Today's Progress</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{studiedToday}</p>
                <p className="text-xs text-orange-600 mt-1">cards reviewed</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="plans">Study Plans</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* Study Plans Tab */}
            <TabsContent value="plans" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Your Study Plans</h2>
                <Button onClick={createNewPlan}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Plan
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {studyPlans.map((plan) => (
                  <StudyPlanCard 
                    key={plan.id} 
                    plan={plan} 
                    onToggleActivity={toggleActivityCompletion}
                    onViewDetails={() => handleViewDetails(plan)}
                    onContinuePlan={() => handleContinuePlan(plan)}
                  />
                ))}
              </div>

              {/* Recommended Plans */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Study Plans</CardTitle>
                  <CardDescription>Based on your recent test performance and learning goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium mb-2">Advanced Neural Networks</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Deep dive into CNN, RNN, and transformer architectures
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">15 hours</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStartRecommendedPlan("Advanced Neural Networks", 15)}
                        >
                          Start Plan
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium mb-2">Data Visualization Mastery</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn advanced plotting and dashboard creation techniques
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">8 hours</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStartRecommendedPlan("Data Visualization Mastery", 8)}
                        >
                          Start Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Flashcards Tab */}
            <TabsContent value="flashcards" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Flashcard Decks</h2>
                <Button onClick={handleCreateDeck}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Deck
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcardSets.map((deck) => (
                  <FlashcardDeck key={deck.id} deck={deck} />
                ))}
              </div>

              {/* Quick Review Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Review</CardTitle>
                  <CardDescription>Cards due for review based on spaced repetition algorithm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-medium mb-2">Ready for Review</h3>
                    <p className="text-muted-foreground mb-4">You have 23 cards ready for review across 3 decks</p>
                    <Button size="lg" onClick={handleStartReviewSession}>
                      <Zap className="mr-2 h-4 w-4" />
                      Start Review Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <StudySchedule plans={studyPlans} flashcards={flashcardSets} />
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Plan Progress</CardTitle>
                    <CardDescription>Your progress across all active study plans</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {studyPlans.map((plan) => (
                      <div key={plan.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{plan.title}</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Flashcard Mastery</CardTitle>
                    <CardDescription>Your retention rates across different subjects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {flashcardSets.map((deck) => {
                      const masteryRate = Math.round((deck.studiedToday / deck.cardCount) * 100) || 0
                      return (
                        <div key={deck.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{deck.subject}</p>
                            <p className="text-xs text-muted-foreground">{deck.cardCount} cards</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{masteryRate}%</p>
                            <p className="text-xs text-muted-foreground">mastery</p>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Streaks</CardTitle>
                  <CardDescription>Your consistency in studying and reviewing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">7</p>
                      <p className="text-sm text-muted-foreground">Day streak</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">156</p>
                      <p className="text-sm text-muted-foreground">Cards mastered</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">24h</p>
                      <p className="text-sm text-muted-foreground">Study time this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Create New Plan Modal */}
      <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Study Plan</DialogTitle>
            <DialogDescription>
              Create a personalized study plan based on your learning goals and current progress.
            </DialogDescription>
          </DialogHeader>
          
          <CreatePlanForm onSubmit={handleCreatePlan} onCancel={() => setIsCreatePlanOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.title} - Plan Details</DialogTitle>
            <DialogDescription>
              Complete overview of your study plan progress and activities
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6">
              {/* Plan Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedPlan.progress}%</div>
                      <div className="text-sm text-muted-foreground">Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedPlan.estimatedHours}h</div>
                      <div className="text-sm text-muted-foreground">Estimated Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedPlan.activities.length}</div>
                      <div className="text-sm text-muted-foreground">Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedPlan.difficulty}/5</div>
                      <div className="text-sm text-muted-foreground">Difficulty</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activities List */}
              <Card>
                <CardHeader>
                  <CardTitle>Activities</CardTitle>
                  <CardDescription>All activities in this study plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPlan.activities.map((activity, index) => (
                      <div key={activity.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <Badge variant={activity.completed ? "default" : "secondary"}>
                            {activity.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{activity.estimatedTime} min</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Due {new Date(activity.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{activity.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Target Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.targetSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Deck Modal */}
      <Dialog open={isCreateDeckOpen} onOpenChange={setIsCreateDeckOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Flashcard Deck</DialogTitle>
            <DialogDescription>
              Create a new flashcard deck to help you memorize key concepts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="deck-title">Deck Title</Label>
              <Input id="deck-title" placeholder="e.g., Machine Learning Terms" />
            </div>
            
            <div>
              <Label htmlFor="deck-description">Description</Label>
              <Textarea id="deck-description" placeholder="Brief description of what this deck covers" />
            </div>
            
            <div>
              <Label htmlFor="deck-subject">Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="machine-learning">Machine Learning</SelectItem>
                  <SelectItem value="statistics">Statistics</SelectItem>
                  <SelectItem value="ai-ethics">AI Ethics</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="deck-difficulty">Difficulty</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button className="flex-1">Create Deck</Button>
              <Button variant="outline" onClick={() => setIsCreateDeckOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Session Modal */}
      <Dialog open={isReviewSessionOpen} onOpenChange={setIsReviewSessionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flashcard Review Session</DialogTitle>
            <DialogDescription>
              Review cards based on spaced repetition algorithm
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-6">
              <Brain className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Ready to Review</h3>
              <p className="text-muted-foreground mb-4">
                You have 23 cards ready for review across 3 decks
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">ML Terms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-sm text-muted-foreground">Statistics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-muted-foreground">AI Ethics</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="lg" className="flex-1">
                  <Play className="mr-2 h-4 w-4" />
                  Start Review
                </Button>
                <Button variant="outline" onClick={() => setIsReviewSessionOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Create Plan Form Component
function CreatePlanForm({ onSubmit, onCancel }: { onSubmit: (data: Partial<StudyPlan>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetSkills: "",
    estimatedHours: 6,
    difficulty: 3,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      targetSkills: formData.targetSkills.split(",").map(s => s.trim()).filter(s => s),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Plan Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Master Machine Learning Fundamentals"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what you want to achieve with this study plan"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="targetSkills">Target Skills (comma-separated)</Label>
        <Input
          id="targetSkills"
          value={formData.targetSkills}
          onChange={(e) => setFormData({ ...formData, targetSkills: e.target.value })}
          placeholder="e.g., Supervised Learning, Neural Networks, Model Evaluation"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="estimatedHours">Estimated Hours</Label>
          <Input
            id="estimatedHours"
            type="number"
            min="1"
            max="100"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={formData.difficulty.toString()} onValueChange={(value) => setFormData({ ...formData, difficulty: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Very Easy</SelectItem>
              <SelectItem value="2">Easy</SelectItem>
              <SelectItem value="3">Medium</SelectItem>
              <SelectItem value="4">Hard</SelectItem>
              <SelectItem value="5">Very Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          Create Plan
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
