import type { AssessmentConfig, GeneratedQuestion, StudyMaterial } from "@/lib/types"

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class OpenAIService {
  private apiKey: string
  private baseURL: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ""
    this.baseURL = "https://api.openai.com/v1"
  }

  async generateQuestions(config: AssessmentConfig, materials: StudyMaterial[]): Promise<GeneratedQuestion[]> {
    if (!this.apiKey) {
      console.warn("OpenAI API key not found, falling back to mock generation")
      return this.generateMockQuestions(config, materials)
    }

    try {
      const combinedContent = materials.map((m) => m.content).join("\n\n")
      const prompt = this.buildQuestionGenerationPrompt(config, combinedContent)

      const response = await this.callOpenAI(prompt, {
        temperature: 0.7,
        max_tokens: 2000,
        model: "gpt-4",
      })

      return this.parseQuestionResponse(response, config)
    } catch (error) {
      console.error("OpenAI API error:", error)
      return this.generateMockQuestions(config, materials)
    }
  }

  async validateQuestionQuality(question: GeneratedQuestion, config: AssessmentConfig): Promise<{
    isValid: boolean
    score: number
    feedback: string
  }> {
    if (!this.apiKey) {
      return {
        isValid: true,
        score: 0.8,
        feedback: "Mock validation - API key not configured",
      }
    }

    try {
      const prompt = this.buildQualityValidationPrompt(question, config)

      const response = await this.callOpenAI(prompt, {
        temperature: 0.3,
        max_tokens: 500,
        model: "gpt-4",
      })

      return this.parseQualityResponse(response)
    } catch (error) {
      console.error("Quality validation error:", error)
      return {
        isValid: true,
        score: 0.7,
        feedback: "Validation failed - using fallback",
      }
    }
  }

  async extractConceptsFromContent(content: string): Promise<string[]> {
    if (!this.apiKey) {
      return this.extractConceptsMock(content)
    }

    try {
      const prompt = `Extract the top 10 key concepts from the following educational content. Return only the concept names, one per line:

${content.substring(0, 2000)}`

      const response = await this.callOpenAI(prompt, {
        temperature: 0.3,
        max_tokens: 300,
        model: "gpt-4",
      })

      const concepts = response.choices[0]?.message?.content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 10)

      return concepts || this.extractConceptsMock(content)
    } catch (error) {
      console.error("Concept extraction error:", error)
      return this.extractConceptsMock(content)
    }
  }

  private async callOpenAI(prompt: string, options: any): Promise<OpenAIResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert educational assessment generator. Generate high-quality, diverse questions that test different cognitive levels according to Bloom's Taxonomy.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    return response.json()
  }

  private buildQuestionGenerationPrompt(config: AssessmentConfig, content: string): string {
    const bloomsKeywords = {
      remember: "recall, identify, list, define, name, match",
      understand: "explain, describe, summarize, interpret, compare, contrast",
      apply: "use, apply, demonstrate, solve, implement, execute",
      analyze: "analyze, examine, compare, contrast, differentiate, organize",
      evaluate: "evaluate, assess, judge, critique, justify, argue",
      create: "create, design, develop, construct, formulate, generate",
    }

    const keywords = bloomsKeywords[config.bloomsLevel as keyof typeof bloomsKeywords] || bloomsKeywords.understand

    return `Generate ${config.questionCount} ${config.type.toUpperCase()} questions based on the following study material content.

Requirements:
- Question type: ${config.type}
- Difficulty level: ${config.difficulty}/5
- Bloom's Taxonomy level: ${config.bloomsLevel} (use keywords: ${keywords})
- Focus areas: ${config.focusAreas || "General concepts"}

Study Material Content:
${content.substring(0, 3000)}

Generate questions in the following JSON format:
[
  {
    "question": "Question text here?",
    "type": "${config.type}",
    "difficulty": ${config.difficulty},
    "bloomsLevel": "${config.bloomsLevel}",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "A",
    "explanation": "Explanation of the correct answer",
    "keywords": ["keyword1", "keyword2"]
  }
]

Ensure questions are:
- Relevant to the study material
- Appropriate for the specified difficulty level
- Aligned with the Bloom's taxonomy level
- Clear and unambiguous
- Educational and engaging`
  }

  private buildQualityValidationPrompt(question: GeneratedQuestion, config: AssessmentConfig): string {
    return `Evaluate the quality of this educational question:

Question: ${question.question}
Type: ${question.type}
Difficulty: ${question.difficulty}/5
Bloom's Level: ${question.bloomsLevel}
Options: ${question.options?.join(", ") || "N/A"}

Assessment the question on:
1. Clarity and understandability
2. Alignment with Bloom's taxonomy level
3. Appropriate difficulty
4. Educational value
5. Potential biases or issues

Return a JSON response:
{
  "isValid": true/false,
  "score": 0.0-1.0,
  "feedback": "Detailed feedback on quality and suggestions for improvement"
}`
  }

  private parseQuestionResponse(response: OpenAIResponse, config: AssessmentConfig): GeneratedQuestion[] {
    try {
      const content = response.choices[0]?.message?.content
      if (!content) return []

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (!jsonMatch) return []

      const questions = JSON.parse(jsonMatch[0])
      return questions.map((q: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        question: q.question,
        type: (q.type || config.type) === "mixed" ? "mcq" : (q.type || config.type),
        difficulty: q.difficulty || config.difficulty,
        bloomsLevel: q.bloomsLevel || config.bloomsLevel,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        keywords: q.keywords || [],
        sourceText: "Generated from study materials",
        qualityScore: 0.8,
      }))
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error)
      return []
    }
  }

  private parseQualityResponse(response: OpenAIResponse): {
    isValid: boolean
    score: number
    feedback: string
  } {
    try {
      const content = response.choices[0]?.message?.content
      if (!content) {
        return { isValid: true, score: 0.7, feedback: "Unable to parse response" }
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return { isValid: true, score: 0.7, feedback: "No JSON found in response" }
      }

      const result = JSON.parse(jsonMatch[0])
      return {
        isValid: result.isValid || true,
        score: result.score || 0.7,
        feedback: result.feedback || "No feedback provided",
      }
    } catch (error) {
      console.error("Failed to parse quality response:", error)
      return { isValid: true, score: 0.7, feedback: "Parse error" }
    }
  }

  private generateMockQuestions(config: AssessmentConfig, materials: StudyMaterial[]): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = []
    const concepts = materials.flatMap((m) => m.concepts || [])

    for (let i = 0; i < config.questionCount; i++) {
      const concept = concepts[i % concepts.length] || "machine learning"
      const question: GeneratedQuestion = {
        id: `mock-${Date.now()}-${i}`,
        question: `Explain the concept of ${concept} based on your study materials.`,
        type: config.type === "mixed" ? "mcq" : config.type,
        difficulty: config.difficulty,
        bloomsLevel: config.bloomsLevel,
        keywords: [concept],
        sourceText: "Generated from study materials",
        qualityScore: 0.7,
      }

      if (config.type === "mcq") {
        question.options = [
          `Correct answer about ${concept}`,
          `Incorrect but plausible option`,
          `Another incorrect option`,
          `Clearly wrong option`,
        ]
        question.correctAnswer = "A"
        question.explanation = `This answer correctly demonstrates understanding of ${concept}.`
      }

      questions.push(question)
    }

    return questions
  }

  private extractConceptsMock(content: string): string[] {
    const concepts = new Set<string>()
    const capitalizedPhrases = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
    capitalizedPhrases.forEach((phrase) => concepts.add(phrase))
    return Array.from(concepts).slice(0, 10)
  }
}
