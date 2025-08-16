import { TestResult, StudyMaterial, GeneratedQuestion, AssessmentConfig } from "./types"

export interface DatabaseService {
  saveAssessmentResult(result: TestResult): Promise<void>
  getAssessmentResults(): Promise<TestResult[]>
  saveStudyMaterial(material: StudyMaterial): Promise<void>
  getStudyMaterials(): Promise<StudyMaterial[]>
  saveGeneratedQuestions(questions: GeneratedQuestion[], config: AssessmentConfig): Promise<void>
  getGeneratedQuestions(): Promise<GeneratedQuestion[]>
  saveFeedback(feedback: any): Promise<void>
  getFeedback(): Promise<any[]>
  updateFeedback(feedback: any): Promise<void>
  clearData(): Promise<void>
}

enum LocalStorageKeys {
  ASSESSMENT_RESULTS = "intellitest_assessment_results",
  STUDY_MATERIALS = "intellitest_study_materials",
  GENERATED_QUESTIONS = "intellitest_generated_questions",
  FEEDBACK = "intellitest_feedback"
}

export class LocalStorageDatabase implements DatabaseService {
  private data: {
    assessmentResults: TestResult[]
    studyMaterials: StudyMaterial[]
    generatedQuestions: GeneratedQuestion[]
    feedback: any[]
  }

  constructor() {
    this.data = {
      assessmentResults: [],
      studyMaterials: [],
      generatedQuestions: [],
      feedback: []
    }
    this.loadData()
  }

  private loadData() {
    try {
      if (typeof window !== "undefined") {
        const assessmentResults = localStorage.getItem(LocalStorageKeys.ASSESSMENT_RESULTS)
        const studyMaterials = localStorage.getItem(LocalStorageKeys.STUDY_MATERIALS)
        const generatedQuestions = localStorage.getItem(LocalStorageKeys.GENERATED_QUESTIONS)
        const feedback = localStorage.getItem(LocalStorageKeys.FEEDBACK)

        if (assessmentResults) {
          this.data.assessmentResults = JSON.parse(assessmentResults)
        }
        if (studyMaterials) {
          this.data.studyMaterials = JSON.parse(studyMaterials)
        }
        if (generatedQuestions) {
          this.data.generatedQuestions = JSON.parse(generatedQuestions)
        }
        if (feedback) {
          this.data.feedback = JSON.parse(feedback)
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }

  private saveData() {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LocalStorageKeys.ASSESSMENT_RESULTS, JSON.stringify(this.data.assessmentResults))
        localStorage.setItem(LocalStorageKeys.STUDY_MATERIALS, JSON.stringify(this.data.studyMaterials))
        localStorage.setItem(LocalStorageKeys.GENERATED_QUESTIONS, JSON.stringify(this.data.generatedQuestions))
        localStorage.setItem(LocalStorageKeys.FEEDBACK, JSON.stringify(this.data.feedback))
      }
    } catch (error) {
      console.error("Error saving data to localStorage:", error)
    }
  }

  async saveAssessmentResult(result: TestResult): Promise<void> {
    this.data.assessmentResults.push(result)
    this.saveData()
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  async getAssessmentResults(): Promise<TestResult[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.data.assessmentResults
  }

  async saveStudyMaterial(material: StudyMaterial): Promise<void> {
    this.data.studyMaterials.push(material)
    this.saveData()
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  async getStudyMaterials(): Promise<StudyMaterial[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.data.studyMaterials
  }

  async saveGeneratedQuestions(questions: GeneratedQuestion[], config: AssessmentConfig): Promise<void> {
    // Add config to each question for context
    const questionsWithConfig = questions.map(q => ({ ...q, config }))
    this.data.generatedQuestions.push(...questionsWithConfig)
    this.saveData()
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  async getGeneratedQuestions(): Promise<GeneratedQuestion[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.data.generatedQuestions
  }

  async saveFeedback(feedback: any): Promise<void> {
    this.data.feedback = this.data.feedback || []
    this.data.feedback.push(feedback)
    this.saveData()
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  async getFeedback(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return this.data.feedback || []
  }

  async updateFeedback(feedback: any): Promise<void> {
    this.data.feedback = this.data.feedback || []
    const index = this.data.feedback.findIndex((f: any) => f.id === feedback.id)
    if (index !== -1) {
      this.data.feedback[index] = feedback
      this.saveData()
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  async clearData(): Promise<void> {
    this.data = {
      assessmentResults: [],
      studyMaterials: [],
      generatedQuestions: [],
      feedback: []
    }
    this.saveData()
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

export function getDatabaseService(): DatabaseService {
  return new LocalStorageDatabase()
}

// Analytics service for tracking user behavior
export class AnalyticsService {
  private db: DatabaseService

  constructor(db: DatabaseService) {
    this.db = db
  }

  async trackAssessmentCompletion(result: TestResult): Promise<void> {
    await this.db.saveAssessmentResult(result)
    
    // In a real implementation, this would send analytics to a service like Google Analytics
    console.log("Analytics: Assessment completed", {
      score: result.completionRate,
      timeSpent: result.timeSpent,
      questionCount: result.totalQuestions,
      difficulty: result.difficulty,
      bloomsLevel: result.bloomsLevel,
    })
  }

  async trackFileUpload(materials: StudyMaterial[]): Promise<void> {
    // Save materials to database
    for (const material of materials) {
      await this.db.saveStudyMaterial(material)
    }
    
    console.log("Analytics: Files uploaded", {
      fileCount: materials.length,
      totalSize: materials.reduce((sum, m) => sum + 0, 0),
      formats: materials.map(m => m.name.split('.').pop()),
    })
  }

  async trackQuestionGeneration(questions: GeneratedQuestion[], config: AssessmentConfig): Promise<void> {
    await this.db.saveGeneratedQuestions(questions, config)
    
    console.log("Analytics: Questions generated", {
      questionCount: questions.length,
      type: config.type,
      difficulty: config.difficulty,
      bloomsLevel: config.bloomsLevel,
    })
  }

  async getAnalyticsSummary(): Promise<{
    totalAssessments: number
    averageScore: number
    totalStudyTime: number
    materialsUploaded: number
    questionsGenerated: number
  }> {
    const results = await this.db.getAssessmentResults()
    const materials = await this.db.getStudyMaterials()
    const questions = await this.db.getGeneratedQuestions()

    const totalAssessments = results.length
    const averageScore = totalAssessments > 0 
      ? results.reduce((sum, r) => sum + (r.completionRate || 0), 0) / totalAssessments 
      : 0
    const totalStudyTime = results.reduce((sum, r) => sum + (r.timeSpent || 0), 0)
    const materialsUploaded = materials.length
    const questionsGenerated = questions.length

    return {
      totalAssessments,
      averageScore: Math.round(averageScore),
      totalStudyTime,
      materialsUploaded,
      questionsGenerated,
    }
  }
}
