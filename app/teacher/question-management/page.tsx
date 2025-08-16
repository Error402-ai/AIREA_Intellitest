"use client"

import { useState, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Brain,
  AlertCircle,
  Clock,
  Target,
  Users,
  BarChart3
} from "lucide-react"
import { FileProcessor } from "@/lib/file-processor"
import { OpenAIService } from "@/lib/ai/openai-service"
import { getDatabaseService } from "@/lib/database"

interface GeneratedQuestion {
  id: string
  question: string
  type: "mcq" | "subjective" | "numerical" | "mixed"
  difficulty: number
  bloomsLevel: string
  options?: string[]
  correctAnswer?: string
  explanation: string
  keywords: string[]
  sourceText: string
  qualityScore: number
  status: "pending" | "approved" | "rejected" | "needs_feedback"
  feedback?: string
  feedbackHistory: FeedbackEntry[]
  createdAt: string
  approvedBy?: string
  approvedAt?: string
}

interface FeedbackEntry {
  id: string
  feedback: string
  type: "rejection" | "improvement" | "approval"
  givenBy: string
  givenAt: string
  aiAnalysis?: string
}

interface UploadedMaterial {
  id: string
  name: string
  content: string
  concepts: string[]
  uploadedAt: string
  questionCount: number
  status: "processing" | "completed" | "failed"
}

export default function TeacherQuestionManagementPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>([])
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<GeneratedQuestion | null>(null)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackType, setFeedbackType] = useState<"rejection" | "improvement" | "approval">("improvement")
  
  const fileProcessor = new FileProcessor()
  const openAIService = new OpenAIService()
  const db = getDatabaseService()

  // Mock questions for demonstration
  const mockQuestions: GeneratedQuestion[] = [
    {
      id: "q1",
      question: "What is supervised learning in machine learning?",
      type: "mcq",
      difficulty: 3,
      bloomsLevel: "understand",
      options: [
        "Learning without labeled data",
        "Learning with labeled training data",
        "Learning through trial and error",
        "Learning from environment feedback"
      ],
      correctAnswer: "B",
      explanation: "Supervised learning uses labeled training data to learn the mapping from inputs to outputs.",
      keywords: ["supervised learning", "machine learning", "labeled data"],
      sourceText: "From Chapter 2: Machine Learning Fundamentals",
      qualityScore: 0.85,
      status: "pending",
      feedbackHistory: [],
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "q2",
      question: "Explain the concept of overfitting in machine learning models and provide strategies to prevent it.",
      type: "subjective",
      difficulty: 4,
      bloomsLevel: "analyze",
      explanation: "Overfitting occurs when a model learns the training data too well, including noise and irrelevant patterns.",
      keywords: ["overfitting", "machine learning", "model validation"],
      sourceText: "From Chapter 3: Model Evaluation",
      qualityScore: 0.92,
      status: "approved",
      feedbackHistory: [
        {
          id: "fb1",
          feedback: "Excellent question that tests deep understanding of overfitting concepts.",
          type: "approval",
          givenBy: "Dr. Sarah Johnson",
          givenAt: "2024-01-15T11:00:00Z"
        }
      ],
      approvedBy: "Dr. Sarah Johnson",
      approvedAt: "2024-01-15T11:00:00Z",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "q3",
      question: "Calculate the accuracy of a classification model that correctly classified 85 out of 100 test samples.",
      type: "numerical",
      difficulty: 2,
      bloomsLevel: "apply",
      explanation: "Accuracy = (Correct predictions / Total predictions) × 100 = (85/100) × 100 = 85%",
      keywords: ["accuracy", "classification", "model evaluation"],
      sourceText: "From Chapter 4: Performance Metrics",
      qualityScore: 0.78,
      status: "needs_feedback",
      feedbackHistory: [
        {
          id: "fb2",
          feedback: "Question is too basic for the target audience. Consider increasing difficulty.",
          type: "improvement",
          givenBy: "Dr. Sarah Johnson",
          givenAt: "2024-01-15T12:00:00Z",
          aiAnalysis: "AI suggests: Consider adding complexity by asking students to calculate multiple metrics or compare different models."
        }
      ],
      createdAt: "2024-01-15T10:30:00Z"
    }
  ]

  // Initialize with mock data
  useState(() => {
    setGeneratedQuestions(mockQuestions)
  })

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newMaterials: UploadedMaterial[] = []

    for (const file of files) {
      const validation = fileProcessor.validateFile(file)
      if (!validation.isValid) {
        console.error(`Invalid file: ${file.name} - ${validation.error}`)
        continue
      }

      const material: UploadedMaterial = {
        id: `material-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        content: "",
        concepts: [],
        uploadedAt: new Date().toISOString(),
        questionCount: 0,
        status: "processing"
      }

      newMaterials.push(material)
      setUploadedMaterials(prev => [...prev, material])

      try {
        const result = await fileProcessor.processFiles([file])
        if (result.success && result.materials.length > 0) {
          const processedMaterial = result.materials[0]
          setUploadedMaterials(prev => 
            prev.map(m => 
              m.id === material.id 
                ? { 
                    ...m, 
                    content: processedMaterial.content,
                    concepts: processedMaterial.concepts || [],
                    status: "completed"
                  }
                : m
            )
          )
        } else {
          setUploadedMaterials(prev => 
            prev.map(m => 
              m.id === material.id 
                ? { ...m, status: "failed" }
                : m
            )
          )
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        setUploadedMaterials(prev => 
          prev.map(m => 
            m.id === material.id 
              ? { ...m, status: "failed" }
              : m
          )
        )
      }
    }

    setIsUploading(false)
  }, [fileProcessor])

  const generateQuestionsFromMaterial = async (material: UploadedMaterial) => {
    setIsGenerating(true)
    
    try {
      // Generate questions using AI service
      const questions = await openAIService.generateQuestions(
        {
          type: "mixed",
          difficulty: 3,
          bloomsLevel: "understand",
          questionCount: 10,
          focusAreas: material.concepts.join(", "),
          selectedMaterials: [material.id],
          timeLimit: 30
        },
        [{
          id: material.id,
          name: material.name,
          content: material.content,
          concepts: material.concepts,
          extractedAt: material.uploadedAt,
          mimeType: "application/pdf"
        }]
      )

      // Convert to our format and add to state
      const newQuestions: GeneratedQuestion[] = questions.map((q, index) => ({
        id: `gen-${Date.now()}-${index}`,
        question: q.question,
        type: q.type,
        difficulty: q.difficulty,
        bloomsLevel: q.bloomsLevel,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "Explanation will be provided after review.",
        keywords: q.keywords,
        sourceText: `Generated from: ${material.name}`,
        qualityScore: q.qualityScore || 0.7,
        status: "pending",
        feedbackHistory: [],
        createdAt: new Date().toISOString()
      }))

      setGeneratedQuestions(prev => [...prev, ...newQuestions])
      
      // Update material with question count
      setUploadedMaterials(prev => 
        prev.map(m => 
          m.id === material.id 
            ? { ...m, questionCount: newQuestions.length }
            : m
        )
      )

    } catch (error) {
      console.error("Error generating questions:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuestionAction = async (questionId: string, action: "approve" | "reject" | "feedback") => {
    if (action === "feedback") {
      const question = generatedQuestions.find(q => q.id === questionId)
      if (question) {
        setSelectedQuestion(question)
        setIsFeedbackModalOpen(true)
      }
      return
    }

    setGeneratedQuestions(prev => 
      prev.map(q => {
        if (q.id === questionId) {
          const feedbackEntry: FeedbackEntry = {
            id: `fb-${Date.now()}`,
            feedback: action === "approve" ? "Question approved" : "Question rejected",
            type: action === "approve" ? "approval" : "rejection",
            givenBy: "Dr. Sarah Johnson",
            givenAt: new Date().toISOString()
          }

          return {
            ...q,
            status: action === "approve" ? "approved" : "rejected",
            feedbackHistory: [...q.feedbackHistory, feedbackEntry],
            approvedBy: action === "approve" ? "Dr. Sarah Johnson" : undefined,
            approvedAt: action === "approve" ? new Date().toISOString() : undefined
          }
        }
        return q
      })
    )
  }

  const submitFeedback = async () => {
    if (!selectedQuestion || !feedbackText.trim()) return

    // Analyze feedback with AI for quality improvement
    let aiAnalysis = ""
    try {
      const analysis = await openAIService.validateQuestionQuality(
        {
          id: selectedQuestion.id,
          question: selectedQuestion.question,
          type: selectedQuestion.type === "mixed" ? "mcq" : selectedQuestion.type,
          difficulty: selectedQuestion.difficulty,
          bloomsLevel: selectedQuestion.bloomsLevel,
          options: selectedQuestion.options,
          correctAnswer: selectedQuestion.correctAnswer,
          explanation: selectedQuestion.explanation,
          keywords: selectedQuestion.keywords,
          sourceText: selectedQuestion.sourceText,
          qualityScore: selectedQuestion.qualityScore
        },
        {
          type: "mixed",
          difficulty: 3,
          bloomsLevel: "understand",
          questionCount: 1,
          focusAreas: selectedQuestion.keywords.join(", "),
          selectedMaterials: [],
          timeLimit: 30
        }
      )
      aiAnalysis = analysis.feedback
    } catch (error) {
      console.error("Error analyzing feedback:", error)
    }

    const feedbackEntry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      feedback: feedbackText,
      type: feedbackType,
      givenBy: "Dr. Sarah Johnson",
      givenAt: new Date().toISOString(),
      aiAnalysis
    }

    setGeneratedQuestions(prev => 
      prev.map(q => {
        if (q.id === selectedQuestion.id) {
          return {
            ...q,
            status: feedbackType === "approval" ? "approved" : "needs_feedback",
            feedbackHistory: [...q.feedbackHistory, feedbackEntry],
            approvedBy: feedbackType === "approval" ? "Dr. Sarah Johnson" : undefined,
            approvedAt: feedbackType === "approval" ? new Date().toISOString() : undefined
          }
        }
        return q
      })
    )

    setFeedbackText("")
    setFeedbackType("improvement")
    setIsFeedbackModalOpen(false)
    setSelectedQuestion(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      case "needs_feedback": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalQuestions: generatedQuestions.length,
    approved: generatedQuestions.filter(q => q.status === "approved").length,
    pending: generatedQuestions.filter(q => q.status === "pending").length,
    needsFeedback: generatedQuestions.filter(q => q.status === "needs_feedback").length,
    averageQuality: Math.round(generatedQuestions.reduce((sum, q) => sum + q.qualityScore, 0) / generatedQuestions.length * 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Question Management</h1>
            <p className="text-muted-foreground">
              Upload study materials, generate questions, and manage quality control with AI-powered feedback.
            </p>
          </div>

          {/* Content will be added here */}
          <div className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Question Management System</h2>
            <p className="text-muted-foreground">Implementation in progress...</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Questions</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.totalQuestions}</p>
                <p className="text-xs text-muted-foreground mt-1">Generated questions</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-muted-foreground">Approved</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.approved}</p>
                <p className="text-xs text-green-600 mt-1">{stats.totalQuestions > 0 ? Math.round((stats.approved / stats.totalQuestions) * 100) : 0}% approval rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-muted-foreground">Pending Review</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.pending}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-muted-foreground">Avg Quality</span>
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.averageQuality}%</p>
                <p className="text-xs text-blue-600 mt-1">AI quality score</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload Materials</TabsTrigger>
              <TabsTrigger value="questions">Question Review</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Upload Materials Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Study Materials</CardTitle>
                  <CardDescription>
                    Upload PDF files to generate questions. The AI will extract content and create relevant questions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Upload PDF Files</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop PDF files here, or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Files
                        </span>
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Materials */}
              {uploadedMaterials.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Uploaded Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {uploadedMaterials.map((material) => (
                        <div key={material.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <h4 className="font-medium">{material.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {material.status === "completed" 
                                    ? `${material.concepts.length} concepts extracted`
                                    : material.status === "processing"
                                    ? "Processing..."
                                    : "Processing failed"
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {material.status === "completed" && (
                                <Button 
                                  onClick={() => generateQuestionsFromMaterial(material)}
                                  disabled={isGenerating}
                                >
                                  <Brain className="mr-2 h-4 w-4" />
                                  Generate Questions
                                </Button>
                              )}
                              <Badge variant={material.status === "completed" ? "default" : "secondary"}>
                                {material.status}
                              </Badge>
                            </div>
                          </div>
                          
                          {material.concepts.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">Key Concepts:</p>
                              <div className="flex flex-wrap gap-1">
                                {material.concepts.slice(0, 5).map((concept, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                                {material.concepts.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{material.concepts.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Question Review Tab */}
            <TabsContent value="questions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Question Review</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Approved
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Quality Report
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {generatedQuestions.map((question) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{question.question}</CardTitle>
                            <Badge className={getStatusColor(question.status)}>
                              {question.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{question.type.toUpperCase()}</Badge>
                            <Badge variant="secondary">Difficulty: {question.difficulty}/5</Badge>
                            <Badge variant="outline" className="capitalize">{question.bloomsLevel}</Badge>
                            <span>•</span>
                            <span>Quality: {Math.round(question.qualityScore * 100)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedQuestion(question)
                              setIsQuestionModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {question.type === "mcq" && question.options && (
                        <div className="mb-4">
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

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>

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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Question Quality Distribution</CardTitle>
                    <CardDescription>Distribution of questions by quality score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { range: "90-100%", count: generatedQuestions.filter(q => q.qualityScore >= 0.9).length, color: "bg-green-500" },
                        { range: "80-89%", count: generatedQuestions.filter(q => q.qualityScore >= 0.8 && q.qualityScore < 0.9).length, color: "bg-blue-500" },
                        { range: "70-79%", count: generatedQuestions.filter(q => q.qualityScore >= 0.7 && q.qualityScore < 0.8).length, color: "bg-yellow-500" },
                        { range: "Below 70%", count: generatedQuestions.filter(q => q.qualityScore < 0.7).length, color: "bg-red-500" }
                      ].map((item) => (
                        <div key={item.range} className="flex items-center space-x-4">
                          <div className="w-20 text-sm">{item.range}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${(item.count / stats.totalQuestions) * 100}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm text-right">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Analysis</CardTitle>
                    <CardDescription>AI-powered feedback insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {generatedQuestions.filter(q => q.feedbackHistory.length > 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Questions with feedback</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Most common feedback:</span>
                          <span>Difficulty adjustment</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>AI suggestions used:</span>
                          <span>78%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Quality improvement:</span>
                          <span>+15%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Question Detail Modal */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
            <DialogDescription>
              Complete question information and feedback history
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuestion && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Question Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Question:</Label>
                    <p className="mt-1">{selectedQuestion.question}</p>
                  </div>
                  
                  {selectedQuestion.type === "mcq" && selectedQuestion.options && (
                    <div>
                      <Label className="text-sm font-medium">Options:</Label>
                      <div className="mt-2 space-y-2">
                        {selectedQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                            <span>{option}</span>
                            {selectedQuestion.correctAnswer === String.fromCharCode(65 + index) && (
                              <Badge variant="default" className="text-xs">Correct</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm font-medium">Explanation:</Label>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedQuestion.explanation}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Type:</Label>
                      <p className="mt-1 text-sm">{selectedQuestion.type.toUpperCase()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Difficulty:</Label>
                      <p className="mt-1 text-sm">{selectedQuestion.difficulty}/5</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Bloom's Level:</Label>
                      <p className="mt-1 text-sm capitalize">{selectedQuestion.bloomsLevel}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Quality Score:</Label>
                      <p className="mt-1 text-sm">{Math.round(selectedQuestion.qualityScore * 100)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedQuestion.feedbackHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedQuestion.feedbackHistory.map((feedback) => (
                        <div key={feedback.id} className="border-l-4 border-primary pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={feedback.type === "approval" ? "default" : feedback.type === "rejection" ? "destructive" : "secondary"}>
                              {feedback.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(feedback.givenAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{feedback.feedback}</p>
                          {feedback.aiAnalysis && (
                            <div className="bg-muted/50 p-3 rounded">
                              <p className="text-xs font-medium mb-1">AI Analysis:</p>
                              <p className="text-xs text-muted-foreground">{feedback.aiAnalysis}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              Give feedback to improve question quality. AI will analyze your feedback for insights.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback-type">Feedback Type</Label>
              <Select value={feedbackType} onValueChange={(value: "rejection" | "improvement" | "approval") => setFeedbackType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                  <SelectItem value="approval">Approval with Comments</SelectItem>
                  <SelectItem value="rejection">Rejection with Reason</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="feedback-text">Feedback</Label>
              <Textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Provide detailed feedback about the question quality, difficulty, clarity, or any other aspects..."
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={submitFeedback} className="flex-1">
                Submit Feedback
              </Button>
              <Button variant="outline" onClick={() => setIsFeedbackModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
