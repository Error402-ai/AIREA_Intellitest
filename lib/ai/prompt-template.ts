interface PromptConfig {
  questionCount: number
  assessmentType: string
  difficulty: number
  bloomsLevel: string
  concepts: string[]
  summaryText: string
  focusAreas: string
}

export class PromptTemplate {
  generatePrompt(config: PromptConfig): string {
    const difficultyLabels = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"]
    const difficultyLabel = difficultyLabels[config.difficulty] || "Medium"

    return `Generate ${config.questionCount} ${config.assessmentType.toUpperCase()} questions at ${difficultyLabel} difficulty, based on the following concepts: ${config.concepts.join(", ")}.

Each question should align with the Bloom's Taxonomy level: ${config.bloomsLevel.toUpperCase()}.

${config.focusAreas ? `Focus particularly on these areas: ${config.focusAreas}` : ""}

Ensure questions are derived from the summarized study material:
"${config.summaryText}"

Format Requirements:
${this.getFormatRequirements(config.assessmentType)}

Quality Guidelines:
- Questions should be clear, unambiguous, and directly related to the study material
- Avoid cultural bias and ensure accessibility
- Match the specified cognitive level (${config.bloomsLevel})
- Vary question complexity within the ${difficultyLabel} range
- Include relevant keywords from the source material

Generate questions now:`
  }

  private getFormatRequirements(assessmentType: string): string {
    switch (assessmentType.toLowerCase()) {
      case "mcq":
        return `- Each question should have 4 options (A, B, C, D)
- Clearly indicate the correct answer
- Provide brief explanation for the correct answer
- Ensure distractors are plausible but clearly incorrect`

      case "subjective":
        return `- Questions should require detailed explanations or analysis
- Include expected key points in the answer
- Specify approximate word count or time allocation
- Provide evaluation criteria`

      case "numerical":
        return `- Include specific numerical problems or calculations
- Provide step-by-step solution approach
- Specify units and precision requirements
- Include relevant formulas if needed`

      case "mixed":
        return `- Combine different question types (MCQ, Subjective, Numerical)
- Maintain balance between question types
- Follow format requirements for each type
- Ensure variety in cognitive demands`

      default:
        return `- Follow standard academic question formatting
- Ensure clarity and precision in language
- Include necessary context and instructions`
    }
  }
}
