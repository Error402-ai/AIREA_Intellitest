"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  RotateCcw, 
  CheckCircle, 
  X, 
  Brain, 
  Zap, 
  BookOpen, 
  TrendingUp,
  Upload,
  FileText,
  Plus,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Download,
  Share2
} from "lucide-react"

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  lastReviewed?: Date
  nextReview: Date
  interval: number
  easeFactor: number
  repetitions: number
  isNew?: boolean
}

interface FlashcardDeck {
  id: string
  name: string
  description: string
  subject: string
  cardCount: number
  createdAt: Date
  lastStudied?: Date
  cards: Flashcard[]
}

export default function FlashcardsPage() {
  const [currentDeck, setCurrentDeck] = useState<FlashcardDeck | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [decks, setDecks] = useState<FlashcardDeck[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  })

  // Pre-generated ML/DL flashcards for demo
  const demoFlashcards: Flashcard[] = [
    // Machine Learning
    {
      id: "ml-1",
      front: "What is Supervised Learning?",
      back: "A type of machine learning where the algorithm learns from labeled training data to make predictions on new, unseen data. The model is trained on input-output pairs.",
      subject: "Machine Learning",
      difficulty: "easy",
      category: "Supervised Learning",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "ml-2",
      front: "What is the difference between Classification and Regression?",
      back: "Classification predicts discrete categories/classes (e.g., spam/not spam), while Regression predicts continuous numerical values (e.g., house prices, temperature).",
      subject: "Machine Learning",
      difficulty: "medium",
      category: "Supervised Learning",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "ml-3",
      front: "What is Overfitting in Machine Learning?",
      back: "A modeling error where the model learns the training data too well, including noise and outliers, leading to poor generalization on new data. The model performs well on training data but poorly on test data.",
      subject: "Machine Learning",
      difficulty: "medium",
      category: "Model Evaluation",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "ml-4",
      front: "What is Cross-Validation?",
      back: "A technique to assess how well a model will generalize to new data by dividing the dataset into multiple folds and training/testing on different combinations to get a more robust performance estimate.",
      subject: "Machine Learning",
      difficulty: "medium",
      category: "Model Evaluation",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "ml-5",
      front: "What is the Bias-Variance Tradeoff?",
      back: "The relationship between a model's ability to minimize bias (underfitting) and variance (overfitting). High bias models are too simple, high variance models are too complex. The goal is to find the optimal balance.",
      subject: "Machine Learning",
      difficulty: "hard",
      category: "Model Evaluation",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    // Deep Learning
    {
      id: "dl-1",
      front: "What is a Neural Network?",
      back: "A computational model inspired by biological neural networks, consisting of interconnected nodes (neurons) organized in layers that process information and learn patterns from data.",
      subject: "Deep Learning",
      difficulty: "easy",
      category: "Neural Networks",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "dl-2",
      front: "What is Backpropagation?",
      back: "An algorithm for training neural networks that calculates gradients of the loss function with respect to each weight by applying the chain rule of calculus, allowing the network to learn from its mistakes.",
      subject: "Deep Learning",
      difficulty: "hard",
      category: "Training",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "dl-3",
      front: "What is the purpose of Activation Functions?",
      back: "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns. Common functions include ReLU, Sigmoid, and Tanh, each with different properties and use cases.",
      subject: "Deep Learning",
      difficulty: "medium",
      category: "Neural Networks",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "dl-4",
      front: "What is Dropout in Neural Networks?",
      back: "A regularization technique where randomly selected neurons are ignored during training, preventing overfitting by reducing co-adaptation between neurons and improving generalization.",
      subject: "Deep Learning",
      difficulty: "medium",
      category: "Regularization",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "dl-5",
      front: "What are Convolutional Neural Networks (CNNs)?",
      back: "A type of neural network designed for processing grid-like data (e.g., images). They use convolutional layers with filters to detect features like edges, textures, and patterns at different scales.",
      subject: "Deep Learning",
      difficulty: "medium",
      category: "Architectures",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    // Computer Vision
    {
      id: "cv-1",
      front: "What is Image Classification?",
      back: "A computer vision task where an algorithm assigns a label or class to an input image from a predefined set of categories (e.g., cat, dog, car).",
      subject: "Computer Vision",
      difficulty: "easy",
      category: "Classification",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "cv-2",
      front: "What is Object Detection?",
      back: "A computer vision task that identifies and locates objects in images by drawing bounding boxes around them and classifying each object within the boxes.",
      subject: "Computer Vision",
      difficulty: "medium",
      category: "Detection",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    // Natural Language Processing
    {
      id: "nlp-1",
      front: "What is Tokenization?",
      back: "The process of breaking down text into smaller units (tokens) such as words, subwords, or characters, which is a crucial preprocessing step for NLP models.",
      subject: "NLP",
      difficulty: "easy",
      category: "Preprocessing",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    },
    {
      id: "nlp-2",
      front: "What are Word Embeddings?",
      back: "Dense vector representations of words in a continuous vector space where semantically similar words are close to each other, capturing meaning and relationships between words.",
      subject: "NLP",
      difficulty: "medium",
      category: "Representation",
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0
    }
  ]

  useEffect(() => {
    // Initialize with demo decks
    const mlDeck: FlashcardDeck = {
      id: "ml-deck",
      name: "Machine Learning Fundamentals",
      description: "Core concepts and algorithms in machine learning",
      subject: "Machine Learning",
      cardCount: demoFlashcards.filter(card => card.subject === "Machine Learning").length,
      createdAt: new Date(),
      cards: demoFlashcards.filter(card => card.subject === "Machine Learning")
    }

    const dlDeck: FlashcardDeck = {
      id: "dl-deck",
      name: "Deep Learning Essentials",
      description: "Neural networks, backpropagation, and deep learning concepts",
      subject: "Deep Learning",
      cardCount: demoFlashcards.filter(card => card.subject === "Deep Learning").length,
      createdAt: new Date(),
      cards: demoFlashcards.filter(card => card.subject === "Deep Learning")
    }

    const cvDeck: FlashcardDeck = {
      id: "cv-deck",
      name: "Computer Vision",
      description: "Image processing and computer vision concepts",
      subject: "Computer Vision",
      cardCount: demoFlashcards.filter(card => card.subject === "Computer Vision").length,
      createdAt: new Date(),
      cards: demoFlashcards.filter(card => card.subject === "Computer Vision")
    }

    const nlpDeck: FlashcardDeck = {
      id: "nlp-deck",
      name: "Natural Language Processing",
      description: "Text processing and NLP fundamentals",
      subject: "NLP",
      cardCount: demoFlashcards.filter(card => card.subject === "NLP").length,
      createdAt: new Date(),
      cards: demoFlashcards.filter(card => card.subject === "NLP")
    }

    setDecks([mlDeck, dlDeck, cvDeck, nlpDeck])
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsUploading(true)
      
      // Simulate processing
      setTimeout(() => {
        setIsUploading(false)
        // Generate new deck from uploaded file
        const newDeck: FlashcardDeck = {
          id: `uploaded-${Date.now()}`,
          name: `Generated from ${file.name}`,
          description: `Flashcards generated from ${file.name}`,
          subject: "Uploaded Content",
          cardCount: 8,
          createdAt: new Date(),
          cards: demoFlashcards.slice(0, 8).map(card => ({
            ...card,
            id: `uploaded-${card.id}`,
            isNew: true
          }))
        }
        setDecks(prev => [newDeck, ...prev])
        setUploadedFile(null)
      }, 2000)
    }
  }

  const startDeck = (deck: FlashcardDeck) => {
    setCurrentDeck(deck)
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setSessionStats({ correct: 0, incorrect: 0, total: 0 })
  }

  const handleCardResponse = (response: "easy" | "medium" | "hard") => {
    if (!currentDeck) return

    const currentCard = currentDeck.cards[currentCardIndex]
    if (!currentCard) return

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: response === "easy" ? prev.correct + 1 : prev.correct,
      incorrect: response === "hard" ? prev.incorrect + 1 : prev.incorrect
    }))

    // Move to next card
    if (currentCardIndex < currentDeck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setShowAnswer(false)
    } else {
      // Deck completed
      setCurrentDeck(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (currentDeck) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="lg:ml-64 p-4">
          <div className="max-w-4xl mx-auto">
            <FlashcardContent
              deck={currentDeck}
              currentCard={currentCardIndex}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              handleCardResponse={handleCardResponse}
              getDifficultyColor={getDifficultyColor}
              sessionStats={sessionStats}
            />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="lg:ml-64 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashcards</h1>
            <p className="text-gray-600">Master concepts through spaced repetition learning</p>
          </div>

          <Tabs defaultValue="decks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="decks">Study Decks</TabsTrigger>
              <TabsTrigger value="upload">Upload & Generate</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="decks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck) => (
                  <Card key={deck.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startDeck(deck)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{deck.name}</CardTitle>
                        <Badge variant="secondary">{deck.cardCount} cards</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{deck.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{deck.subject}</span>
                        <span>{deck.lastStudied ? `Last studied: ${deck.lastStudied.toLocaleDateString()}` : "Not studied yet"}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Study Materials</CardTitle>
                  <p className="text-gray-600">Upload PDF, PPT, or other documents to generate flashcards automatically</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <p className="text-lg font-medium">Upload your study materials</p>
                          <p className="text-sm text-gray-500">Supports PDF, PPT, PPTX, DOC, DOCX files</p>
                          <Button variant="outline" disabled={isUploading}>
                            {isUploading ? "Processing..." : "Choose File"}
                          </Button>
                        </div>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.ppt,.pptx,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </div>
                    
                    {isUploading && (
                      <Alert>
                        <Brain className="h-4 w-4" />
                        <AlertDescription>
                          Processing your file and generating flashcards... This may take a few moments.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Total Cards Studied
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">124</p>
                    <p className="text-sm text-gray-600">+12 this week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Mastery Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">87%</p>
                    <p className="text-sm text-gray-600">+5% this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Study Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">7 days</p>
                    <p className="text-sm text-gray-600">Keep it up!</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function FlashcardContent({
  deck,
  currentCard,
  showAnswer,
  setShowAnswer,
  handleCardResponse,
  getDifficultyColor,
  sessionStats,
}: any) {
  if (!deck || !deck.cards || currentCard >= deck.cards.length) {
    return <div>Loading...</div>
  }

  const card = deck.cards[currentCard]
  if (!card) return <div>Card not found</div>

  const progress = ((currentCard + 1) / deck.cards.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{deck.name}</h2>
            <p className="text-sm text-gray-600">{deck.subject}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Session Progress</p>
          <p className="text-lg font-semibold">{sessionStats.correct}/{sessionStats.total} correct</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Card {currentCard + 1} of {deck.cards.length}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <Card className="min-h-[400px] flex flex-col">
        <CardContent className="flex-1 flex flex-col justify-center p-8">
          <div className="text-center space-y-6">
            {/* Front of card */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Badge className={getDifficultyColor(card.difficulty)}>
                  {card.difficulty}
                </Badge>
                <Badge variant="outline">{card.category}</Badge>
              </div>
              
              <div className="text-2xl font-medium leading-relaxed">
                {card.front}
              </div>
            </div>

            {/* Back of card */}
            {showAnswer && (
              <div className="space-y-4 pt-6 border-t">
                <div className="text-lg text-gray-700 leading-relaxed">
                  {card.back}
                </div>
                
                {/* Response buttons */}
                <div className="flex justify-center gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleCardResponse("hard")}
                    className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCardResponse("medium")}
                    className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Good
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCardResponse("easy")}
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Easy
                  </Button>
                </div>
              </div>
            )}

            {/* Show answer button */}
            {!showAnswer && (
              <Button 
                onClick={() => setShowAnswer(true)}
                className="mt-6"
                size="lg"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Answer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
