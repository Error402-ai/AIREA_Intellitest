"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { AssessmentTypeSelector } from "@/components/assessment-type-selector"
import { BloomsTaxonomySelector } from "@/components/blooms-taxonomy-selector"
import { MaterialSelector } from "@/components/material-selector"
import { AssessmentPreview } from "@/components/assessment-preview"
import { Brain, Settings, FileText, Zap, ArrowRight } from "lucide-react"

interface AssessmentConfig {
  type: "mcq" | "subjective" | "numerical" | "mixed"
  difficulty: number
  bloomsLevel: string
  questionCount: number
  focusAreas: string
  selectedMaterials: string[]
  timeLimit: number
}

export default function GeneratePage() {
  const [config, setConfig] = useState<AssessmentConfig>({
    type: "mcq",
    difficulty: 3,
    bloomsLevel: "apply",
    questionCount: 10,
    focusAreas: "",
    selectedMaterials: ["1"], // Default to first material selected
    timeLimit: 30,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAssessment, setGeneratedAssessment] = useState<any>(null)

  // Mock uploaded materials
  const availableMaterials = [
    { id: "1", name: "Machine Learning Fundamentals.pdf", concepts: ["ML", "Neural Networks", "Algorithms"] },
    { id: "2", name: "Data Science Presentation.pptx", concepts: ["Statistics", "Data Analysis", "Visualization"] },
    { id: "3", name: "AI Ethics and Society.pdf", concepts: ["Ethics", "AI Impact", "Bias", "Fairness"] },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)

    const configToSend = {
      ...config,
      selectedMaterials: config.selectedMaterials.length > 0 ? config.selectedMaterials : ["1", "2"],
    }

    try {
      console.log("[v0] Sending config to API:", JSON.stringify(configToSend, null, 2))

      const response = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configToSend),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response:", errorText)
        throw new Error(`Failed to generate assessment: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Received assessment data:", data)

      localStorage.setItem("currentAssessment", JSON.stringify(data.assessment))
      console.log("[v0] Stored assessment in localStorage")

      setGeneratedAssessment(data.assessment)
    } catch (error) {
      console.error("[v0] Generation error:", error)
      const mockAssessment = {
        id: "assessment-" + Date.now(),
        title: `${config.type.toUpperCase()} Assessment - ${config.bloomsLevel}`,
        questions: Array.from({ length: config.questionCount }, (_, i) => ({
          id: i + 1, // Use simple numeric IDs for consistency
          question: `Based on your study materials, ${getMockQuestion(config.bloomsLevel, i + 1)}`,
          type:
            config.type === "mixed" ? (i % 3 === 0 ? "mcq" : i % 3 === 1 ? "subjective" : "numerical") : config.type,
          difficulty: config.difficulty,
          bloomsLevel: config.bloomsLevel,
          qualityScore: 0.75 + Math.random() * 0.25,
          ...(config.type === "mcq" || (config.type === "mixed" && i % 3 === 0)
            ? {
                options: [
                  "Machine learning algorithms that learn from data",
                  "Traditional programming approaches",
                  "Database management systems",
                  "Web development frameworks",
                ],
                correctAnswer: "Machine learning algorithms that learn from data", // Store full answer text
                explanation: "This demonstrates understanding of core ML concepts from your materials.",
              }
            : {}),
          ...(config.type === "numerical" || (config.type === "mixed" && i % 3 === 2)
            ? {
                expectedAnswer: `${(Math.random() * 100).toFixed(2)}`,
                explanation: "Calculate based on the formulas in your study materials.",
              }
            : {}),
        })),
        timeLimit: config.timeLimit,
        difficulty: config.difficulty,
        bloomsLevel: config.bloomsLevel,
        createdAt: new Date().toISOString(),
        config: configToSend,
      }

      localStorage.setItem("currentAssessment", JSON.stringify(mockAssessment))
      console.log("[v0] Stored mock assessment in localStorage")

      setGeneratedAssessment(mockAssessment)
    } finally {
      setIsGenerating(false)
    }
  }

  const getMockQuestion = (bloomsLevel: string, questionNum: number) => {
    const questions = {
      remember: [
        "what is the definition of machine learning?",
        "which algorithm is used for supervised learning?",
        "what are the main types of neural networks?",
      ],
      understand: [
        "how do neural networks process information?",
        "why is overfitting a problem in machine learning?",
        "what is the relationship between training data and model performance?",
      ],
      apply: [
        "how would you implement a classification algorithm for this dataset?",
        "which machine learning approach would work best for this problem?",
        "how would you prevent overfitting in this scenario?",
      ],
      analyze: [
        "what factors contribute to the success of this ML model?",
        "how do different algorithms compare for this use case?",
        "what are the trade-offs between accuracy and interpretability?",
      ],
      evaluate: [
        "which approach would be most effective for this business problem?",
        "how would you assess the quality of this machine learning solution?",
        "what are the ethical implications of this AI system?",
      ],
      create: [
        "how would you design a new neural network architecture?",
        "what innovative approach could solve this ML challenge?",
        "how would you build an end-to-end ML pipeline?",
      ],
    }

    const levelQuestions = questions[bloomsLevel as keyof typeof questions] || questions.understand
    return levelQuestions[questionNum % levelQuestions.length]
  }

  const getDifficultyLabel = (value: number) => {
    const labels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"]
    return labels[value - 1] || "Medium"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Generate Assessment</h1>
            <p className="text-muted-foreground">
              Configure your personalized assessment based on your uploaded study materials and learning preferences.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assessment Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Assessment Type</span>
                  </CardTitle>
                  <CardDescription>Choose the format for your assessment questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssessmentTypeSelector
                    value={config.type}
                    onChange={(type) => setConfig((prev) => ({ ...prev, type }))}
                  />
                </CardContent>
              </Card>

              {/* Difficulty & Cognitive Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Difficulty & Cognitive Level</span>
                  </CardTitle>
                  <CardDescription>Set the challenge level and thinking skills required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Difficulty Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Difficulty Level</Label>
                      <Badge variant="secondary">{getDifficultyLabel(config.difficulty)}</Badge>
                    </div>
                    <Slider
                      value={[config.difficulty]}
                      onValueChange={([value]) => setConfig((prev) => ({ ...prev, difficulty: value }))}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Easy</span>
                      <span>Very Hard</span>
                    </div>
                  </div>

                  {/* Bloom's Taxonomy */}
                  <div className="space-y-3">
                    <Label>Cognitive Level (Bloom's Taxonomy)</Label>
                    <BloomsTaxonomySelector
                      value={config.bloomsLevel}
                      onChange={(level) => setConfig((prev) => ({ ...prev, bloomsLevel: level }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Question Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Question Configuration</span>
                  </CardTitle>
                  <CardDescription>Customize the number and focus of questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question Count */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Number of Questions</Label>
                      <Badge variant="outline">{config.questionCount} questions</Badge>
                    </div>
                    <Slider
                      value={[config.questionCount]}
                      onValueChange={([value]) => setConfig((prev) => ({ ...prev, questionCount: value }))}
                      min={5}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Time Limit */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Time Limit</Label>
                      <Badge variant="outline">{config.timeLimit} minutes</Badge>
                    </div>
                    <Slider
                      value={[config.timeLimit]}
                      onValueChange={([value]) => setConfig((prev) => ({ ...prev, timeLimit: value }))}
                      min={10}
                      max={180}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-3">
                    <Label htmlFor="focus-areas">Focus Areas (Optional)</Label>
                    <Textarea
                      id="focus-areas"
                      placeholder="Specify particular topics or concepts you want to focus on..."
                      value={config.focusAreas}
                      onChange={(e) => setConfig((prev) => ({ ...prev, focusAreas: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Material Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Study Materials</CardTitle>
                  <CardDescription>Choose which uploaded materials to include in your assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <MaterialSelector
                    materials={availableMaterials}
                    selectedMaterials={config.selectedMaterials}
                    onChange={(materials) => setConfig((prev) => ({ ...prev, selectedMaterials: materials }))}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Summary & Generation Panel */}
            <div className="space-y-6">
              {/* Configuration Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="secondary">{config.type.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="font-medium">{getDifficultyLabel(config.difficulty)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cognitive Level:</span>
                      <span className="font-medium capitalize">{config.bloomsLevel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{config.questionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time Limit:</span>
                      <span className="font-medium">{config.timeLimit} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Materials:</span>
                      <span className="font-medium">{config.selectedMaterials.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Card>
                <CardContent className="p-6">
                  <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="w-full">
                    {isGenerating ? (
                      <>
                        <Zap className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-2">
                    AI will analyze your materials and generate personalized questions
                  </p>
                </CardContent>
              </Card>

              {/* AI Processing Info */}
              {isGenerating && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        AI is analyzing your materials and generating personalized questions...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Generated Assessment Preview */}
          {generatedAssessment && (
            <div className="mt-8">
              <AssessmentPreview assessment={generatedAssessment} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
