export interface AssessmentConfig {
  type: "mcq" | "subjective" | "numerical" | "mixed"
  difficulty: number
  bloomsLevel: string
  questionCount: number
  focusAreas: string
  selectedMaterials: string[]
  timeLimit: number
}

export interface GeneratedQuestion {
  id: string
  question: string
  type: "mcq" | "subjective" | "numerical"
  difficulty: number
  bloomsLevel: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
  keywords: string[]
  sourceText: string
  qualityScore: number
  expectedAnswer?: string
}

export interface QualityResult {
  isValid: boolean
  score: number
  issues: string[]
  suggestions: string[]
}

export interface StudyMaterial {
  id: string
  name: string
  content: string
  concepts: string[]
  extractedAt: string
  mimeType: string
}

export interface TestResult {
  id: string
  testId: string
  userId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: number
  completedAt: string
  questions: GeneratedQuestion[]
  completionRate?: number
  timeSpent?: number
  difficulty?: number
  bloomsLevel?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  avatar?: string
  preferences?: UserPreferences
  createdAt: string
  lastLogin: string
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  notifications: boolean
  language: string
  timezone: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

export interface SessionToken {
  userId: string
  role: string
  name: string
  email: string
  iat: number
  exp: number
}

export interface UploadedMaterial {
  id: string
  name: string
  content: string
  concepts: string[]
  uploadedAt: string
  questionCount: number
  status: "processing" | "completed" | "failed"
}

export interface GeneratedQuestion {
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
  feedbackHistory: any[]
  createdAt: string
}
