"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  Target,
  Brain,
  Award,
  AlertTriangle,
  Calendar,
  Upload,
  MessageSquare,
  Edit,
  Eye,
  Plus
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface GeneratedQuestion {
  id: string
  question: string
  type: string
  difficulty: number
  bloomsLevel: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
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

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>([])
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

    // Sample generated questions
    const demoQuestions: GeneratedQuestion[] = [
      {
        id: "1",
        question: "What is the difference between supervised and unsupervised learning? Provide examples of each.",
        type: "MCQ",
        difficulty: 3,
        bloomsLevel: "Understanding",
        status: "pending",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        question: "Explain the concept of overfitting in machine learning models and describe strategies to prevent it.",
        type: "Subjective",
        difficulty: 4,
        bloomsLevel: "Analysis",
        status: "approved",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        question: "What is the purpose of activation functions in neural networks? Compare ReLU and Sigmoid functions.",
        type: "MCQ",
        difficulty: 2,
        bloomsLevel: "Understanding",
        status: "rejected",
        createdAt: new Date().toISOString()
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
      
      // Simulate file processing
      setTimeout(() => {
        const newMaterial: UploadedMaterial = {
          id: `material-${Date.now()}`,
          name: file.name,
          content: "Extracted content from uploaded file...",
          concepts: ["Sample Concept 1", "Sample Concept 2"],
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

  const generateQuestions = (materialId: string) => {
    setIsGenerating(true)
    
    // Simulate question generation
    setTimeout(() => {
      const newQuestions: GeneratedQuestion[] = [
        {
          id: `q-${Date.now()}-1`,
          question: "What are the key components of a neural network?",
          type: "MCQ",
          difficulty: 3,
          bloomsLevel: "Understanding",
          status: "pending",
          createdAt: new Date().toISOString()
        },
        {
          id: `q-${Date.now()}-2`,
          question: "Explain the backpropagation algorithm in detail.",
          type: "Subjective",
          difficulty: 4,
          bloomsLevel: "Analysis",
          status: "pending",
          createdAt: new Date().toISOString()
        }
      ]
      
      setGeneratedQuestions(prev => [...prev, ...newQuestions])
      setIsGenerating(false)
    }, 3000)
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

  const stats = {
    totalStudents: 45,
    activeStudents: 38,
    totalQuestions: generatedQuestions.length,
    approvedQuestions: generatedQuestions.filter(q => q.status === "approved").length,
    pendingQuestions: generatedQuestions.filter(q => q.status === "pending").length,
    averageQualityScore: 8.5
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
                <p className="text-gray-600">Welcome back, {user?.name || "Teacher"}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
                    <p className="text-xs text-green-600 mt-1">+12% this month</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                    <p className="text-xs text-green-600 mt-1">{stats.approvedQuestions} approved</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingQuestions}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.averageQualityScore}/10</p>
                    <p className="text-xs text-purple-600 mt-1">Excellent quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">Upload & Generate</TabsTrigger>
              <TabsTrigger value="review">Question Review</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Upload & Generate Tab */}
            <TabsContent value="upload" className="space-y-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Study Materials</CardTitle>
                  <CardDescription>
                    Upload PDF, PPT, or other documents to generate AI-powered questions for your students.
                  </CardDescription>
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
                            {isUploading ? "Uploading..." : "Choose File"}
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
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Materials</CardTitle>
                  <CardDescription>
                    Your uploaded study materials and generated questions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedMaterials.map((material) => (
                      <div key={material.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{material.name}</h4>
                            <p className="text-sm text-gray-600">
                              {material.questionCount} questions generated • Uploaded {new Date(material.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              onClick={() => generateQuestions(material.id)}
                              disabled={isGenerating}
                              size="sm"
                            >
                              {isGenerating ? "Generating..." : "Generate Questions"}
                            </Button>
                            <Badge variant="secondary">
                              {material.status === "completed" ? "✓ Ready" : "Processing"}
                            </Badge>
                          </div>
                        </div>
                        
                        {material.concepts.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {material.concepts.map((concept, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Question Review Tab */}
            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Questions</CardTitle>
                  <CardDescription>
                    Review and manage AI-generated questions from your uploaded materials.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedQuestions.map((question) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">{question.question}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                              <Badge variant="outline" className="text-xs">{question.type}</Badge>
                              <Badge variant="secondary" className="text-xs">Difficulty: {question.difficulty}/5</Badge>
                              <Badge variant="outline" className="text-xs">{question.bloomsLevel}</Badge>
                              <span>•</span>
                              <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Badge 
                              className={
                                question.status === "approved" ? "bg-green-100 text-green-800" :
                                question.status === "rejected" ? "bg-red-100 text-red-800" :
                                "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {question.status === "approved" ? "✓ Approved" :
                               question.status === "rejected" ? "✗ Rejected" :
                               "⏳ Pending Review"}
                            </Badge>
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Question Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approved</span>
                        <span className="font-medium">{stats.approvedQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending</span>
                        <span className="font-medium">{stats.pendingQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rejected</span>
                        <span className="font-medium">{generatedQuestions.filter(q => q.status === "rejected").length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Students</span>
                        <span className="font-medium">{stats.totalStudents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Students</span>
                        <span className="font-medium">{stats.activeStudents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Engagement Rate</span>
                        <span className="font-medium">{Math.round((stats.activeStudents / stats.totalStudents) * 100)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
