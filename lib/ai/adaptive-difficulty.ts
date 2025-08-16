import type { AssessmentConfig, GeneratedQuestion, TestResult } from "@/lib/types"

export interface DifficultyAdjustment {
  newDifficulty: number
  reason: string
  confidence: number
}

export interface PerformanceMetrics {
  currentScore: number
  averageResponseTime: number
  consecutiveCorrect: number
  consecutiveIncorrect: number
  difficultyLevel: number
  questionsAnswered: number
  totalQuestions: number
}

export class AdaptiveDifficultyController {
  private readonly MIN_DIFFICULTY = 1
  private readonly MAX_DIFFICULTY = 5
  private readonly DIFFICULTY_STEP = 0.5
  private readonly CONFIDENCE_THRESHOLD = 0.7

  /**
   * Adjusts difficulty based on real-time performance
   */
  adjustDifficulty(
    currentMetrics: PerformanceMetrics,
    recentAnswers: Array<{ isCorrect: boolean; timeSpent: number; difficulty: number }>,
    config: AssessmentConfig
  ): DifficultyAdjustment {
    const { currentScore, averageResponseTime, consecutiveCorrect, consecutiveIncorrect } = currentMetrics

    // Calculate performance trend
    const performanceTrend = this.calculatePerformanceTrend(recentAnswers)
    const timeEfficiency = this.calculateTimeEfficiency(averageResponseTime, currentMetrics.difficultyLevel)
    
    // Determine difficulty adjustment
    let difficultyChange = 0
    let reason = ""
    let confidence = 0.5

    // High performance - increase difficulty
    if (currentScore >= 80 && consecutiveCorrect >= 3 && timeEfficiency > 0.8) {
      difficultyChange = this.DIFFICULTY_STEP
      reason = "Excellent performance - increasing challenge"
      confidence = 0.9
    }
    // Good performance - slight increase
    else if (currentScore >= 70 && consecutiveCorrect >= 2 && timeEfficiency > 0.6) {
      difficultyChange = this.DIFFICULTY_STEP * 0.5
      reason = "Good performance - moderate challenge increase"
      confidence = 0.7
    }
    // Poor performance - decrease difficulty
    else if (currentScore < 50 || consecutiveIncorrect >= 3 || timeEfficiency < 0.3) {
      difficultyChange = -this.DIFFICULTY_STEP
      reason = "Struggling - reducing difficulty for better engagement"
      confidence = 0.8
    }
    // Moderate performance - slight decrease
    else if (currentScore < 60 || consecutiveIncorrect >= 2 || timeEfficiency < 0.5) {
      difficultyChange = -this.DIFFICULTY_STEP * 0.5
      reason = "Moderate performance - slight difficulty reduction"
      confidence = 0.6
    }
    // Stable performance - maintain current level
    else {
      difficultyChange = 0
      reason = "Stable performance - maintaining current difficulty"
      confidence = 0.5
    }

    // Apply Bloom's taxonomy considerations
    const bloomsAdjustment = this.adjustForBloomsLevel(config.bloomsLevel, currentScore)
    difficultyChange += bloomsAdjustment.adjustment
    reason += ` | ${bloomsAdjustment.reason}`

    // Calculate new difficulty
    const newDifficulty = Math.max(
      this.MIN_DIFFICULTY,
      Math.min(this.MAX_DIFFICULTY, currentMetrics.difficultyLevel + difficultyChange)
    )

    return {
      newDifficulty: Math.round(newDifficulty * 2) / 2, // Round to nearest 0.5
      reason,
      confidence: Math.min(1, confidence + bloomsAdjustment.confidence)
    }
  }

  /**
   * Generates the next question with adjusted difficulty
   */
  generateNextQuestion(
    currentMetrics: PerformanceMetrics,
    recentAnswers: Array<{ isCorrect: boolean; timeSpent: number; difficulty: number }>,
    config: AssessmentConfig,
    availableQuestions: GeneratedQuestion[]
  ): GeneratedQuestion | null {
    const adjustment = this.adjustDifficulty(currentMetrics, recentAnswers, config)
    
    // Filter questions by adjusted difficulty
    const targetDifficulty = adjustment.newDifficulty
    const difficultyRange = 0.5 // Allow questions within ±0.5 difficulty
    
    const suitableQuestions = availableQuestions.filter(q => 
      Math.abs(q.difficulty - targetDifficulty) <= difficultyRange &&
      q.bloomsLevel === config.bloomsLevel
    )

    if (suitableQuestions.length === 0) {
      // Fallback to questions with similar difficulty
      const fallbackQuestions = availableQuestions.filter(q => 
        Math.abs(q.difficulty - targetDifficulty) <= 1
      )
      
      if (fallbackQuestions.length === 0) {
        return null
      }
      
      // Return random question from fallback
      return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]
    }

    // Select question based on performance pattern
    return this.selectOptimalQuestion(suitableQuestions, recentAnswers, adjustment)
  }

  /**
   * Analyzes learning patterns to provide insights
   */
  analyzeLearningPatterns(assessmentResults: TestResult[]): {
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    optimalDifficulty: number
  } {
    if (assessmentResults.length === 0) {
      return {
        strengths: [],
        weaknesses: [],
        recommendations: ["Start with basic assessments to establish baseline"],
        optimalDifficulty: 3
      }
    }

    const recentResults = assessmentResults.slice(-5)
    const averageScore = recentResults.reduce((sum, r) => sum + (r.completionRate || 0), 0) / recentResults.length
    
    // Analyze performance by difficulty level
    const difficultyPerformance = this.analyzeDifficultyPerformance(recentResults)
    
    // Analyze performance by Bloom's level
    const bloomsPerformance = this.analyzeBloomsPerformance(recentResults)

    const strengths: string[] = []
    const weaknesses: string[] = []
    const recommendations: string[] = []

    // Identify strengths
    if (averageScore >= 80) {
      strengths.push("Strong overall performance")
      recommendations.push("Consider increasing challenge level")
    }
    
    if (difficultyPerformance.highDifficulty > 70) {
      strengths.push("Excellent performance on complex questions")
    }

    // Identify weaknesses
    if (averageScore < 60) {
      weaknesses.push("Struggling with current difficulty level")
      recommendations.push("Focus on foundational concepts")
    }

    if (bloomsPerformance.analysis < 60) {
      weaknesses.push("Difficulty with analytical thinking")
      recommendations.push("Practice breaking down complex problems")
    }

    if (bloomsPerformance.evaluation < 60) {
      weaknesses.push("Challenges with evaluation tasks")
      recommendations.push("Work on critical thinking and assessment skills")
    }

    // Calculate optimal difficulty
    const optimalDifficulty = this.calculateOptimalDifficulty(averageScore, difficultyPerformance)

    return {
      strengths,
      weaknesses,
      recommendations,
      optimalDifficulty
    }
  }

  private calculatePerformanceTrend(recentAnswers: Array<{ isCorrect: boolean; timeSpent: number; difficulty: number }>): number {
    if (recentAnswers.length < 3) return 0

    const recent = recentAnswers.slice(-3)
    const correctCount = recent.filter(a => a.isCorrect).length
    return correctCount / recent.length
  }

  private calculateTimeEfficiency(averageResponseTime: number, difficulty: number): number {
    // Expected time based on difficulty (in seconds)
    const expectedTime = difficulty * 30 // 30 seconds per difficulty level
    const efficiency = expectedTime / Math.max(averageResponseTime, 1)
    return Math.min(1, efficiency)
  }

  private adjustForBloomsLevel(bloomsLevel: string, currentScore: number): {
    adjustment: number
    reason: string
    confidence: number
  } {
    const bloomsWeights = {
      remember: 0.1,
      understand: 0.2,
      apply: 0.3,
      analyze: 0.4,
      evaluate: 0.5,
      create: 0.6
    }

    const weight = bloomsWeights[bloomsLevel as keyof typeof bloomsWeights] || 0.3
    
    // Higher Bloom's levels require more careful difficulty adjustment
    if (bloomsLevel === "evaluate" || bloomsLevel === "create") {
      if (currentScore < 70) {
        return {
          adjustment: -0.3,
          reason: "High-order thinking requires strong foundation",
          confidence: 0.8
        }
      }
    }

    return {
      adjustment: 0,
      reason: "Standard difficulty adjustment",
      confidence: 0.5
    }
  }

  private selectOptimalQuestion(
    questions: GeneratedQuestion[],
    recentAnswers: Array<{ isCorrect: boolean; timeSpent: number; difficulty: number }>,
    adjustment: DifficultyAdjustment
  ): GeneratedQuestion {
    // Prefer questions that match the adjustment direction
    const targetDifficulty = adjustment.newDifficulty
    
    // Sort by difficulty proximity to target
    const sortedQuestions = questions.sort((a, b) => 
      Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
    )

    // If confidence is high, use the closest match
    if (adjustment.confidence > this.CONFIDENCE_THRESHOLD) {
      return sortedQuestions[0]
    }

    // Otherwise, add some randomness to avoid getting stuck
    const topChoices = sortedQuestions.slice(0, Math.min(3, sortedQuestions.length))
    return topChoices[Math.floor(Math.random() * topChoices.length)]
  }

  private analyzeDifficultyPerformance(results: TestResult[]): {
    lowDifficulty: number
    mediumDifficulty: number
    highDifficulty: number
  } {
    const difficultyScores = {
      lowDifficulty: 0,
      mediumDifficulty: 0,
      highDifficulty: 0
    }

    let counts = { low: 0, medium: 0, high: 0 }

    results.forEach(result => {
      if (result.questions) {
        result.questions.forEach(question => {
          // Calculate performance score (mock implementation)
          const score = Math.random() > 0.5 ? 100 : 0 // Mock score for demonstration
          
          if (question.difficulty <= 2) {
            difficultyScores.lowDifficulty += score
            counts.low++
          } else if (question.difficulty <= 4) {
            difficultyScores.mediumDifficulty += score
            counts.medium++
          } else {
            difficultyScores.highDifficulty += score
            counts.high++
          }
        })
      }
    })

    return {
      lowDifficulty: counts.low > 0 ? difficultyScores.lowDifficulty / counts.low : 0,
      mediumDifficulty: counts.medium > 0 ? difficultyScores.mediumDifficulty / counts.medium : 0,
      highDifficulty: counts.high > 0 ? difficultyScores.highDifficulty / counts.high : 0
    }
  }

  private analyzeBloomsPerformance(results: TestResult[]): Record<string, number> {
    const bloomsScores: Record<string, number> = {}
    const counts: Record<string, number> = {}

    results.forEach(result => {
      if (result.questions) {
        result.questions.forEach(question => {
          const level = question.bloomsLevel
          // Calculate performance score (mock implementation)
          const score = Math.random() > 0.5 ? 100 : 0 // Mock score for demonstration
          
          bloomsScores[level] = (bloomsScores[level] || 0) + score
          counts[level] = (counts[level] || 0) + 1
        })
      }
    })

    // Calculate averages
    Object.keys(bloomsScores).forEach(level => {
      bloomsScores[level] = bloomsScores[level] / counts[level]
    })

    return bloomsScores
  }

  private calculateOptimalDifficulty(averageScore: number, difficultyPerformance: any): number {
    // Base optimal difficulty on overall performance
    let optimal = 3

    if (averageScore >= 85) {
      optimal = 4.5
    } else if (averageScore >= 75) {
      optimal = 4
    } else if (averageScore >= 65) {
      optimal = 3.5
    } else if (averageScore >= 55) {
      optimal = 3
    } else {
      optimal = 2.5
    }

    // Adjust based on difficulty-specific performance
    if (difficultyPerformance.highDifficulty > 80) {
      optimal = Math.min(5, optimal + 0.5)
    }
    if (difficultyPerformance.lowDifficulty < 60) {
      optimal = Math.max(1, optimal - 0.5)
    }

    return Math.round(optimal * 2) / 2
  }
}
