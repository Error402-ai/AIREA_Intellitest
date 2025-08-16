import { type NextRequest, NextResponse } from "next/server"
import { QuestionGenerator } from "@/lib/ai/question-generator"
import { QualityController } from "@/lib/ai/quality-controller"
import type { AssessmentConfig, GeneratedQuestion } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const config: AssessmentConfig = await request.json()

    console.log("[v0] Received config:", JSON.stringify(config, null, 2))

    // Validate request with better error handling
    if (!config) {
      console.log("[v0] Config is null or undefined")
      return NextResponse.json({ error: "Invalid configuration" }, { status: 400 })
    }

    if (!config.selectedMaterials) {
      console.log("[v0] selectedMaterials is undefined")
      // Provide default materials if none selected
      config.selectedMaterials = ["1", "2"] // Default to available materials
    }

    if (!Array.isArray(config.selectedMaterials) || config.selectedMaterials.length === 0) {
      console.log("[v0] selectedMaterials is not an array or is empty:", config.selectedMaterials)
      return NextResponse.json({ error: "No study materials selected" }, { status: 400 })
    }

    // Ensure other required fields have defaults
    config.questionCount = config.questionCount || 5
    config.type = config.type || "mcq"
    config.difficulty = config.difficulty || 3
    config.bloomsLevel = config.bloomsLevel || "understand"
    config.timeLimit = config.timeLimit || 30
    config.focusAreas = config.focusAreas || ""

    console.log("[v0] Validated config:", JSON.stringify(config, null, 2))

    // Initialize AI components
    const questionGenerator = new QuestionGenerator()
    const qualityController = new QualityController()

    // Generate questions with quality control
    const generatedQuestions = await generateQuestionsWithQualityControl(config, questionGenerator, qualityController)

    // Create assessment object
    const assessment = {
      id: `assessment-${Date.now()}`,
      title: `${config.type.toUpperCase()} Assessment - ${config.bloomsLevel}`,
      questions: generatedQuestions,
      timeLimit: config.timeLimit,
      difficulty: config.difficulty,
      bloomsLevel: config.bloomsLevel,
      createdAt: new Date().toISOString(),
      config,
    }

    console.log("[v0] Generated assessment with", generatedQuestions.length, "questions")
    return NextResponse.json({ assessment })
  } catch (error) {
    console.error("[v0] Assessment generation error:", error)
    return NextResponse.json({ error: "Failed to generate assessment" }, { status: 500 })
  }
}

async function generateQuestionsWithQualityControl(
  config: AssessmentConfig,
  generator: QuestionGenerator,
  qualityController: QualityController,
): Promise<GeneratedQuestion[]> {
  const validQuestions: GeneratedQuestion[] = []
  let attempts = 0
  const maxAttempts = config.questionCount * 3 // Allow multiple attempts

  while (validQuestions.length < config.questionCount && attempts < maxAttempts) {
    attempts++

    // Generate batch of questions
    const batchSize = Math.min(5, config.questionCount - validQuestions.length)
    const generatedBatch = await generator.generateQuestions(config, batchSize)

    // Apply quality control pipeline
    for (const question of generatedBatch) {
      const qualityResult = await qualityController.validateQuestion(question, config)

      if (qualityResult.isValid) {
        // Check for duplicates
        const isDuplicate = await qualityController.checkDuplicate(question, validQuestions)
        if (!isDuplicate) {
          validQuestions.push(question)
        }
      } else {
        // Log quality issues for improvement
        console.log("Question rejected:", qualityResult.issues)
      }
    }
  }

  // If we don't have enough questions, generate simpler ones
  if (validQuestions.length < config.questionCount) {
    const remainingCount = config.questionCount - validQuestions.length
    const fallbackQuestions = await generator.generateFallbackQuestions(config, remainingCount)
    validQuestions.push(...fallbackQuestions)
  }

  return validQuestions.slice(0, config.questionCount)
}
