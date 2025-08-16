"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  X, 
  Edit, 
  MessageSquare,
  Eye,
  Download,
  Trash2,
  Plus,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Zap,
  XCircle,
  BarChart3
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface UploadedMaterial {
  id: string
  name: string
  content: string
  concepts: string[]
  uploadedAt: string
  questionCount: number
  status: string
}

interface GeneratedQuestion {
  id: string
  question: string
  type: string
  difficulty: number
  bloomsLevel: string
  status: string
  createdAt: string
  materialId?: string
  feedback?: string
  editedQuestion?: string
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>([])
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<GeneratedQuestion | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch user info
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error("Authentication failed")
        }
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error)
        // For demonstration purposes, set a default user
        setUser({
          id: "teacher-001",
          name: "Professor Johnson",
          email: "teacher@intellitest.com",
          role: "teacher"
        })
      })

    // Load demo data
    loadDemoData()
  }, [])

  const loadDemoData = () => {
    // Sample uploaded materials
    const demoMaterials: UploadedMaterial[] = [
      {
        id: "1",
        name: "Machine Learning Fundamentals.pdf",
        content: "Comprehensive guide covering supervised learning, unsupervised learning, and model evaluation techniques.",
        concepts: ["Supervised Learning", "Classification", "Regression", "Model Evaluation"],
        uploadedAt: new Date().toISOString(),
        questionCount: 15,
        status: "completed"
      },
      {
        id: "2",
        name: "Deep Learning Basics.pptx",
        content: "Introduction to neural networks, backpropagation, and modern deep learning architectures.",
        concepts: ["Neural Networks", "Backpropagation", "Activation Functions", "CNNs"],
        uploadedAt: new Date().toISOString(),
        questionCount: 12,
        status: "completed"
      }
    ]

    // Sample generated questions based on uploaded materials
    const demoQuestions: GeneratedQuestion[] = [
      {
        id: "1",
        question: "Based on the supervised learning concepts in the uploaded material, what is the primary difference between classification and regression tasks? Provide examples of each.",
        type: "MCQ",
        difficulty: 3,
        bloomsLevel: "Understanding",
        status: "pending",
        createdAt: new Date().toISOString(),
        materialId: "1"
      },
      {
        id: "2",
        question: "Using the neural network concepts from the Deep Learning presentation, explain how backpropagation works and why it's essential for training neural networks.",
        type: "Subjective",
        difficulty: 4,
        bloomsLevel: "Analysis",
        status: "approved",
        createdAt: new Date().toISOString(),
        materialId: "2"
      },
      {
        id: "3",
        question: "According to the model evaluation section in the ML Fundamentals document, what are the key metrics used to assess classification model performance?",
        type: "MCQ",
        difficulty: 2,
        bloomsLevel: "Understanding",
        status: "rejected",
        createdAt: new Date().toISOString(),
        materialId: "1",
        feedback: "Question is too basic for this level. Consider making it more challenging."
      }
    ]

    setUploadedMaterials(demoMaterials)
    setGeneratedQuestions(demoQuestions)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setIsUploading(true)
      
      // Simulate file processing with realistic content extraction
      setTimeout(() => {
        const extractedConcepts = getExtractedConcepts(file.name)
        const newMaterial: UploadedMaterial = {
          id: `material-${Date.now()}`,
          name: file.name,
          content: `Successfully extracted content from ${file.name}. Found ${extractedConcepts.length} key concepts: ${extractedConcepts.join(', ')}.`,
          concepts: extractedConcepts,
          uploadedAt: new Date().toISOString(),
          questionCount: 0,
          status: "completed"
        }
        
        setUploadedMaterials(prev => [...prev, newMaterial])
        setIsUploading(false)
        setSelectedFile(null)
      }, 2000)
    }
  }

  const getExtractedConcepts = (fileName: string): string[] => {
    // Simulate AI content extraction based on file name
    const conceptMap: { [key: string]: string[] } = {
      "machine learning": ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering"],
      "deep learning": ["Neural Networks", "Backpropagation", "Activation Functions", "Convolutional Networks"],
      "statistics": ["Probability", "Hypothesis Testing", "Regression Analysis", "Data Distribution"],
      "python": ["Programming Fundamentals", "Data Structures", "Object-Oriented Programming", "Libraries"],
      "database": ["SQL", "Database Design", "Normalization", "Query Optimization"],
      "algorithms": ["Sorting", "Searching", "Dynamic Programming", "Graph Algorithms"]
    }

    const lowerFileName = fileName.toLowerCase()
    for (const [key, concepts] of Object.entries(conceptMap)) {
      if (lowerFileName.includes(key)) {
        return concepts
      }
    }
    
    // Default concepts for unknown file types
    return ["Core Concepts", "Advanced Topics", "Practical Applications", "Best Practices"]
  }

  const generateQuestions = (materialId: string) => {
    setIsGenerating(true)
    
    const material = uploadedMaterials.find(m => m.id === materialId)
    if (!material) return
    
    // Simulate AI question generation based on material content
    setTimeout(() => {
      const newQuestions: GeneratedQuestion[] = generateQuestionsFromMaterial(material)
      
      setGeneratedQuestions(prev => [...prev, ...newQuestions])
      setIsGenerating(false)
    }, 3000)
  }

  const generateQuestionsFromMaterial = (material: UploadedMaterial): GeneratedQuestion[] => {
    const questions: GeneratedQuestion[] = []
    const questionTemplates = [
      {
        template: "Based on the {concept} section in {materialName}, explain how {concept} works and provide a real-world example.",
        type: "Subjective",
        difficulty: 4,
        bloomsLevel: "Analysis"
      },
      {
        template: "According to the uploaded material on {concept}, what are the key differences between {concept} and related approaches?",
        type: "MCQ",
        difficulty: 3,
        bloomsLevel: "Understanding"
      },
      {
        template: "Using the concepts from {materialName}, describe the process of {concept} and its applications in modern technology.",
        type: "Subjective",
        difficulty: 3,
        bloomsLevel: "Application"
      },
      {
        template: "The {materialName} discusses {concept}. What are the main challenges and solutions associated with implementing {concept}?",
        type: "MCQ",
        difficulty: 4,
        bloomsLevel: "Evaluation"
      }
    ]

    material.concepts.forEach((concept, index) => {
      const template = questionTemplates[index % questionTemplates.length]
      const question = template.template
        .replace(/{concept}/g, concept)
        .replace(/{materialName}/g, material.name)

      questions.push({
        id: `q-${Date.now()}-${index}`,
        question,
        type: template.type,
        difficulty: template.difficulty,
        bloomsLevel: template.bloomsLevel,
        status: "pending",
        createdAt: new Date().toISOString(),
        materialId: material.id
      })
    })

    return questions.slice(0, 3) // Generate 3 questions per material
  }

  const handleQuestionAction = (questionId: string, action: "approve" | "reject") => {
    setGeneratedQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, status: action === "approve" ? "approved" : "rejected" }
          : q
      )
    )
  }

  const handleEditQuestion = (question: GeneratedQuestion) => {
    setEditingQuestion(question)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingQuestion) return
    
    setGeneratedQuestions(prev => 
      prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, question: editingQuestion.editedQuestion || q.question }
          : q
      )
    )
    setIsEditDialogOpen(false)
    setEditingQuestion(null)
  }

  const handleAddFeedback = (question: GeneratedQuestion) => {
    setEditingQuestion(question)
    setFeedbackText(question.feedback || "")
    setIsFeedbackDialogOpen(true)
  }

  const handleSaveFeedback = () => {
    if (!editingQuestion) return
    
    setGeneratedQuestions(prev => 
      prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, feedback: feedbackText }
          : q
      )
    )
    setIsFeedbackDialogOpen(false)
    setEditingQuestion(null)
    setFeedbackText("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalMaterials: uploadedMaterials.length,
    totalQuestions: generatedQuestions.length,
    approvedQuestions: generatedQuestions.filter(q => q.status === "approved").length,
    pendingQuestions: generatedQuestions.filter(q => q.status === "pending").length,
    totalStudents: 45,
    activeStudents: 38,
    averageQualityScore: 8.5
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  fetch("/api/auth/logout", { method: "POST" }).then(() => (window.location.href = "/login"))
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Materials</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingQuestions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="materials" className="space-y-6">
            <TabsList>
              <TabsTrigger value="materials">Uploaded Materials</TabsTrigger>
              <TabsTrigger value="questions">Generated Questions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Uploaded Materials Tab */}
            <TabsContent value="materials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Study Materials</CardTitle>
                  <CardDescription>
                    Upload PDF, PPT, or other documents to generate questions automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Upload your study materials</p>
                        <p className="text-sm text-gray-500">Supports PDF, PPT, PPTX, DOC, DOCX files</p>
                        <div className="mt-4">
                          <Input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.ppt,.pptx,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <Button variant="outline" disabled={isUploading} className="cursor-pointer">
                              {isUploading ? "Processing..." : "Choose File"}
                            </Button>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedMaterials.map((material) => (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{material.name}</CardTitle>
                        <Badge variant="secondary">{material.concepts.length} concepts</Badge>
                      </div>
                      <CardDescription>{material.content}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Key Concepts:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {material.concepts.map((concept, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}</span>
                          <span>{material.questionCount} questions</span>
                        </div>
                        <Button 
                          onClick={() => generateQuestions(material.id)}
                          disabled={isGenerating}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Generate Questions
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Generated Questions Tab */}
            <TabsContent value="questions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Questions</CardTitle>
                  <CardDescription>
                    Review, edit, and approve questions generated from your materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedQuestions.map((question) => {
                      const material = uploadedMaterials.find(m => m.id === question.materialId)
                      return (
                        <Card key={question.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-lg font-medium mb-2">{question.question}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>Type: {question.type}</span>
                                    <span>Difficulty: {question.difficulty}/5</span>
                                    <span>Bloom's: {question.bloomsLevel}</span>
                                    {material && (
                                      <span>From: {material.name}</span>
                                    )}
                                  </div>
                                </div>
                                <Badge className={getStatusColor(question.status)}>
                                  {question.status}
                                </Badge>
                              </div>

                              {question.feedback && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <p className="text-sm font-medium text-yellow-800">Feedback:</p>
                                  <p className="text-sm text-yellow-700">{question.feedback}</p>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                {question.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleQuestionAction(question.id, "approve")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQuestionAction(question.id, "reject")}
                                      className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditQuestion(question)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddFeedback(question)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Feedback
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Question Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.averageQualityScore}/10</p>
                    <p className="text-sm text-gray-600">Average quality score</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Approval Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {stats.totalQuestions > 0 ? Math.round((stats.approvedQuestions / stats.totalQuestions) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Questions approved</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Generation Speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">~3s</p>
                    <p className="text-sm text-gray-600">Average generation time</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Modify the question content to better suit your requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question-text">Question</Label>
              <Textarea
                id="question-text"
                value={editingQuestion?.editedQuestion || editingQuestion?.question || ""}
                onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, editedQuestion: e.target.value } : null)}
                rows={4}
                placeholder="Enter the question text..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              Provide feedback on this question to help improve future generations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback-text">Feedback</Label>
              <Textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                placeholder="Enter your feedback on this question..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFeedback}>
                Save Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
