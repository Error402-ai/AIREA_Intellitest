import type { GeneratedQuestion, QualityResult, AssessmentConfig } from "@/lib/types"
import { OpenAIService } from "./openai-service"

export class QualityController {
  private sensitiveWords = ["inappropriate", "offensive", "biased", "discriminatory"]
  private minQuestionLength = 10
  private maxQuestionLength = 500
  private openAIService: OpenAIService

  constructor() {
    this.openAIService = new OpenAIService()
  }

  async validateQuestion(question: GeneratedQuestion, config: AssessmentConfig): Promise<QualityResult> {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 1.0

    // Rule-based filtering
    const ruleBasedResult = this.applyRuleBasedFilters(question)
    issues.push(...ruleBasedResult.issues)
    score *= ruleBasedResult.scoreMultiplier

    // AI verification (enhanced with real AI)
    const aiResult = await this.performAIVerification(question, config)
    issues.push(...aiResult.issues)
    suggestions.push(...aiResult.suggestions)
    score *= aiResult.scoreMultiplier

    // Similarity check would be performed at the caller level
    const finalScore = Math.max(0, Math.min(1, score))
    const isValid = finalScore >= 0.6 && issues.length === 0

    return {
      isValid,
      score: finalScore,
      issues,
      suggestions,
    }
  }

  async checkDuplicate(question: GeneratedQuestion, existingQuestions: GeneratedQuestion[]): Promise<boolean> {
    // Enhanced similarity check with AI assistance
    const questionText = question.question.toLowerCase()

    for (const existing of existingQuestions) {
      const existingText = existing.question.toLowerCase()

      // Check for exact matches
      if (questionText === existingText) {
        return true
      }

      // Check for high similarity (enhanced word overlap)
      const similarity = this.calculateTextSimilarity(questionText, existingText)
      if (similarity > 0.8) {
        return true
      }

      // AI-powered semantic similarity check (if available)
      try {
        const semanticSimilarity = await this.checkSemanticSimilarity(questionText, existingText)
        if (semanticSimilarity > 0.85) {
          return true
        }
      } catch (error) {
        console.warn("Semantic similarity check failed, using fallback:", error)
      }
    }

    return false
  }

  private applyRuleBasedFilters(question: GeneratedQuestion): { issues: string[]; scoreMultiplier: number } {
    const issues: string[] = []
    let scoreMultiplier = 1.0

    // Length check
    if (question.question.length < this.minQuestionLength) {
      issues.push("Question too short")
      scoreMultiplier *= 0.5
    }

    if (question.question.length > this.maxQuestionLength) {
      issues.push("Question too long")
      scoreMultiplier *= 0.8
    }

    // Sensitive content check
    const questionLower = question.question.toLowerCase()
    for (const word of this.sensitiveWords) {
      if (questionLower.includes(word)) {
        issues.push(`Contains sensitive word: ${word}`)
        scoreMultiplier *= 0.3
      }
    }

    // Format validation
    if (question.type === "mcq" && (!question.options || question.options.length < 2)) {
      issues.push("MCQ question missing options")
      scoreMultiplier *= 0.4
    }

    // Question mark check for questions
    if (!question.question.includes("?") && !question.question.toLowerCase().includes("explain")) {
      issues.push("Question should end with question mark or be an instruction")
      scoreMultiplier *= 0.9
    }

    return { issues, scoreMultiplier }
  }

  private async performAIVerification(
    question: GeneratedQuestion,
    config: AssessmentConfig,
  ): Promise<{ issues: string[]; suggestions: string[]; scoreMultiplier: number }> {
    const issues: string[] = []
    const suggestions: string[] = []
    let scoreMultiplier = 1.0

    // Try AI-powered validation first
    try {
      const aiValidation = await this.openAIService.validateQuestionQuality(question, config)
      
      if (!aiValidation.isValid) {
        issues.push("AI validation failed")
        scoreMultiplier *= 0.7
      }
      
      if (aiValidation.score < 0.7) {
        suggestions.push(`Quality score: ${(aiValidation.score * 100).toFixed(0)}% - ${aiValidation.feedback}`)
        scoreMultiplier *= aiValidation.score
      }
    } catch (error) {
      console.warn("AI validation failed, using fallback:", error)
    }

    // Fallback to rule-based validation
    const bloomsAlignment = this.checkBloomsAlignment(question.question, config.bloomsLevel)
    if (!bloomsAlignment.isAligned) {
      issues.push(`Question doesn't match ${config.bloomsLevel} cognitive level`)
      suggestions.push(bloomsAlignment.suggestion)
      scoreMultiplier *= 0.7
    }

    // Check difficulty appropriateness
    const difficultyCheck = this.assessDifficulty(question.question, config.difficulty)
    if (Math.abs(difficultyCheck.estimatedDifficulty - config.difficulty) > 1) {
      suggestions.push(`Consider adjusting question complexity for difficulty level ${config.difficulty}`)
      scoreMultiplier *= 0.9
    }

    // Check for bias indicators
    const biasCheck = this.checkForBias(question.question)
    if (biasCheck.hasBias) {
      issues.push("Potential bias detected")
      suggestions.push(biasCheck.suggestion)
      scoreMultiplier *= 0.6
    }

    return { issues, suggestions, scoreMultiplier }
  }

  private async checkSemanticSimilarity(text1: string, text2: string): Promise<number> {
    // Simple semantic similarity using word embeddings concept
    // In a real implementation, this would use actual embeddings
    const words1 = new Set(text1.split(/\s+/))
    const words2 = new Set(text2.split(/\s+/))

    const intersection = new Set([...words1].filter((word) => words2.has(word)))
    const union = new Set([...words1, ...words2])

    return intersection.size / union.size
  }

  private checkBloomsAlignment(questionText: string, targetLevel: string): { isAligned: boolean; suggestion: string } {
    const bloomsKeywords = {
      remember: ["what", "define", "list", "identify", "recall", "name"],
      understand: ["explain", "describe", "summarize", "interpret", "compare"],
      apply: ["use", "apply", "demonstrate", "solve", "implement", "execute"],
      analyze: ["analyze", "examine", "compare", "contrast", "differentiate"],
      evaluate: ["evaluate", "assess", "judge", "critique", "justify", "argue"],
      create: ["create", "design", "develop", "construct", "formulate", "generate"],
    }

    const keywords = bloomsKeywords[targetLevel as keyof typeof bloomsKeywords] || []
    const questionLower = questionText.toLowerCase()

    const hasKeyword = keywords.some((keyword) => questionLower.includes(keyword))

    return {
      isAligned: hasKeyword,
      suggestion: hasKeyword
        ? "Question aligns well with cognitive level"
        : `Consider using keywords like: ${keywords.slice(0, 3).join(", ")}`,
    }
  }

  private assessDifficulty(questionText: string, targetDifficulty: number): { estimatedDifficulty: number } {
    // Enhanced difficulty assessment
    let difficulty = 3 // Default medium

    const complexWords = questionText.split(" ").filter((word) => word.length > 8).length
    const questionLength = questionText.length
    const hasComplexConcepts = questionText.includes("algorithm") || questionText.includes("optimization") || questionText.includes("analysis")

    if (complexWords > 3 || questionLength > 200 || hasComplexConcepts) difficulty += 1
    if (complexWords < 1 && questionLength < 50) difficulty -= 1

    if (questionText.includes("analyze") || questionText.includes("evaluate")) difficulty += 1
    if (questionText.includes("list") || questionText.includes("define")) difficulty -= 1

    return { estimatedDifficulty: Math.max(1, Math.min(5, difficulty)) }
  }

  private checkForBias(questionText: string): { hasBias: boolean; suggestion: string } {
    const biasIndicators = ["always", "never", "all", "none", "obviously", "clearly", "everyone", "nobody"]
    const questionLower = questionText.toLowerCase()

    const hasBias = biasIndicators.some((indicator) => questionLower.includes(indicator))

    return {
      hasBias,
      suggestion: hasBias
        ? "Consider using more neutral language and avoiding absolute terms"
        : "Question appears to use neutral language",
    }
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/))
    const words2 = new Set(text2.split(/\s+/))

    const intersection = new Set([...words1].filter((word) => words2.has(word)))
    const union = new Set([...words1, ...words2])

    return intersection.size / union.size
  }
}
