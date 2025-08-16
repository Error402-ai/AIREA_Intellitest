import type { AssessmentConfig, GeneratedQuestion, StudyMaterial } from "@/lib/types"
import { PromptTemplate } from "./prompt-template"
import { OpenAIService } from "./openai-service"

export class QuestionGenerator {
  private promptTemplate: PromptTemplate
  private openAIService: OpenAIService

  constructor() {
    this.promptTemplate = new PromptTemplate()
    this.openAIService = new OpenAIService()
  }

  async generateQuestions(config: AssessmentConfig, count: number): Promise<GeneratedQuestion[]> {
    // Get study materials content
    const materials = await this.getStudyMaterials(config.selectedMaterials)
    
    // Try real AI generation first
    try {
      const aiQuestions = await this.openAIService.generateQuestions(config, materials)
      if (aiQuestions.length >= count) {
        console.log(`[v1] Generated ${aiQuestions.length} questions using OpenAI`)
        return aiQuestions.slice(0, count)
      }
    } catch (error) {
      console.warn("[v1] OpenAI generation failed, falling back to mock:", error)
    }

    // Fallback to mock generation
    return this.generateMockQuestions(config, materials, count)
  }

  async generateFallbackQuestions(config: AssessmentConfig, count: number): Promise<GeneratedQuestion[]> {
    const materials = await this.getStudyMaterials(config.selectedMaterials)
    return this.generateMockQuestions(config, materials, count)
  }

  private async generateMockQuestions(
    config: AssessmentConfig, 
    materials: StudyMaterial[], 
    count: number
  ): Promise<GeneratedQuestion[]> {
    const fallbackQuestions: GeneratedQuestion[] = []
    const concepts = materials.flatMap((m) => m.concepts || [])

    for (let i = 0; i < count; i++) {
      const concept = concepts[i % concepts.length] || "machine learning"
      const question: GeneratedQuestion = {
        id: `fallback-${Date.now()}-${i}`,
        question: this.generateRealisticQuestion(
          config.type,
          config.bloomsLevel,
          concept,
          materials[0]?.content || ""
        ),
        type: config.type === "mixed" ? "mcq" : config.type,
        difficulty: Math.max(1, config.difficulty - 1), // Slightly easier
        bloomsLevel: config.bloomsLevel,
        keywords: [concept, ...concepts.slice(0, 2)],
        sourceText: "Generated from study materials",
        qualityScore: 0.6,
      }

      if (config.type === "mcq" || (config.type === "mixed" && Math.random() > 0.5)) {
        question.options = this.generateRealisticMCQOptions(concept, config.bloomsLevel)
        question.correctAnswer = "A"
        question.explanation = `This answer correctly demonstrates understanding of ${concept} based on your study materials.`
      } else if (config.type === "numerical") {
        question.expectedAnswer = this.generateNumericalAnswer(concept)
        question.explanation = `Calculate using the principles of ${concept} from your materials.`
      }

      fallbackQuestions.push(question)
    }

    return fallbackQuestions
  }

  private async getStudyMaterials(materialIds: string[]): Promise<StudyMaterial[]> {
    return [
      {
        id: "1",
        name: "Machine Learning Fundamentals.pdf",
        content: `Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. 

Key concepts include:
- Supervised Learning: Learning with labeled data to make predictions
- Unsupervised Learning: Finding patterns in unlabeled data  
- Neural Networks: Computing systems inspired by biological neural networks
- Deep Learning: Neural networks with multiple layers for complex pattern recognition
- Training Data: Dataset used to teach the algorithm
- Feature Engineering: Selecting and transforming variables for models
- Overfitting: When a model learns training data too specifically
- Cross-validation: Technique to assess model performance

Applications of machine learning include:
- Image recognition and computer vision
- Natural language processing and text analysis
- Recommendation systems for e-commerce and content
- Predictive analytics for business intelligence
- Autonomous vehicles and robotics
- Medical diagnosis and drug discovery

Popular algorithms include linear regression, decision trees, random forests, support vector machines, and various neural network architectures like CNNs and RNNs.`,
        concepts: [
          "Machine Learning",
          "Neural Networks",
          "Supervised Learning",
          "Deep Learning",
          "Overfitting",
          "Cross-validation",
        ],
        extractedAt: new Date().toISOString(),
        mimeType: "application/pdf",
      },
      {
        id: "2",
        name: "Data Structures and Algorithms.pdf",
        content: `Data structures are ways of organizing and storing data to enable efficient access and modification. Common data structures include:

Arrays: Fixed-size sequential collection of elements
Linked Lists: Dynamic data structure with nodes containing data and pointers
Stacks: Last-In-First-Out (LIFO) data structure
Queues: First-In-First-Out (FIFO) data structure
Trees: Hierarchical data structure with nodes and edges
Graphs: Collection of vertices connected by edges
Hash Tables: Key-value pairs with fast lookup times

Algorithm complexity is measured using Big O notation:
- O(1): Constant time
- O(log n): Logarithmic time
- O(n): Linear time
- O(n²): Quadratic time

Sorting algorithms include bubble sort, merge sort, quick sort, and heap sort. Search algorithms include linear search and binary search.`,
        concepts: [
          "Data Structures",
          "Arrays",
          "Linked Lists",
          "Big O Notation",
          "Sorting Algorithms",
          "Binary Search",
        ],
        extractedAt: new Date().toISOString(),
        mimeType: "application/pdf",
      },
    ]
  }

  private generateRealisticQuestion(type: string, bloomsLevel: string, concept: string, content: string): string {
    const contextualQuestions = {
      mcq: {
        remember: [
          `Which of the following best defines ${concept}?`,
          `What is the primary characteristic of ${concept}?`,
          `${concept} is best described as:`,
        ],
        understand: [
          `How does ${concept} work in the context of your study materials?`,
          `What is the relationship between ${concept} and the other concepts you studied?`,
          `Based on your materials, ${concept} can be explained as:`,
        ],
        apply: [
          `Given a scenario involving ${concept}, which approach would be most appropriate?`,
          `How would you implement ${concept} in a practical situation?`,
          `Which example best demonstrates the application of ${concept}?`,
        ],
        analyze: [
          `What are the key components that make ${concept} effective?`,
          `How do the different aspects of ${concept} interact with each other?`,
          `What factors should be considered when evaluating ${concept}?`,
        ],
        evaluate: [
          `Which approach to ${concept} would be most effective and why?`,
          `What are the strengths and limitations of ${concept}?`,
          `How would you assess the quality of a ${concept} implementation?`,
        ],
        create: [
          `How would you design a new system incorporating ${concept}?`,
          `What innovative approach could improve upon traditional ${concept} methods?`,
          `How would you modify ${concept} for a specific use case?`,
        ],
      },
      subjective: {
        remember: [
          `Define ${concept} and list its key characteristics.`,
          `What are the main features of ${concept} according to your study materials?`,
          `Describe the basic principles of ${concept}.`,
        ],
        understand: [
          `Explain how ${concept} works and why it's important in this field.`,
          `Describe the relationship between ${concept} and related concepts from your materials.`,
          `Summarize the key insights about ${concept} from your study materials.`,
        ],
        apply: [
          `Demonstrate how you would use ${concept} to solve a real-world problem.`,
          `Provide an example of ${concept} application based on your study materials.`,
          `Show how ${concept} can be implemented in a practical scenario.`,
        ],
        analyze: [
          `Compare and contrast different approaches to ${concept}.`,
          `Analyze the components and structure of ${concept}.`,
          `Examine the factors that influence the effectiveness of ${concept}.`,
        ],
        evaluate: [
          `Evaluate the effectiveness of ${concept} in different contexts.`,
          `Critically assess the advantages and disadvantages of ${concept}.`,
          `Justify why ${concept} is considered important in this field.`,
        ],
        create: [
          `Design a comprehensive solution using ${concept} principles.`,
          `Develop a new framework that incorporates ${concept}.`,
          `Create an innovative approach to implementing ${concept}.`,
        ],
      },
      numerical: {
        remember: [
          `What is the numerical value associated with ${concept}?`,
          `Calculate the basic metric for ${concept}.`,
          `What is the standard measurement for ${concept}?`,
        ],
        understand: [
          `Calculate and explain the significance of ${concept} in this context.`,
          `Determine the numerical relationship between ${concept} and related factors.`,
          `Compute the value and interpret what it means for ${concept}.`,
        ],
        apply: [
          `Apply the ${concept} formula to solve this problem.`,
          `Calculate the ${concept} value for the given scenario.`,
          `Use ${concept} principles to determine the numerical answer.`,
        ],
        analyze: [
          `Analyze the numerical patterns in ${concept} data.`,
          `Calculate and compare different ${concept} metrics.`,
          `Determine the factors affecting ${concept} calculations.`,
        ],
        evaluate: [
          `Calculate and assess the effectiveness of ${concept} using numerical methods.`,
          `Determine the optimal ${concept} value and justify your calculation.`,
          `Evaluate the numerical results of ${concept} implementation.`,
        ],
        create: [
          `Design a calculation method for ${concept} optimization.`,
          `Create a formula to predict ${concept} performance.`,
          `Develop a numerical model for ${concept} analysis.`,
        ],
      },
    }

    const typeQuestions = contextualQuestions[type as keyof typeof contextualQuestions]
    if (!typeQuestions) {
      console.log(`[v1] Unknown question type: ${type}, falling back to subjective`)
      return this.generateRealisticQuestion("subjective", bloomsLevel, concept, content)
    }

    const levelQuestions = typeQuestions[bloomsLevel as keyof typeof typeQuestions]
    if (!levelQuestions || levelQuestions.length === 0) {
      console.log(`[v1] Unknown bloom's level: ${bloomsLevel}, falling back to understand`)
      return this.generateRealisticQuestion(type, "understand", concept, content)
    }

    return levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
  }

  private generateRealisticMCQOptions(concept: string, bloomsLevel: string): string[] {
    const optionTemplates = {
      remember: [
        `The correct definition of ${concept}`,
        `A partially correct but incomplete description`,
        `A common misconception about ${concept}`,
        `An unrelated concept often confused with ${concept}`,
      ],
      understand: [
        `Demonstrates clear understanding of ${concept} principles`,
        `Shows partial understanding but misses key elements`,
        `Reflects a common misunderstanding of ${concept}`,
        `Completely incorrect interpretation of ${concept}`,
      ],
      apply: [
        `The most appropriate application of ${concept}`,
        `A reasonable but suboptimal use of ${concept}`,
        `An incorrect application that seems plausible`,
        `A completely inappropriate use of ${concept}`,
      ],
    }

    const templates = optionTemplates[bloomsLevel as keyof typeof optionTemplates] || optionTemplates.understand
    return templates
  }

  private generateNumericalAnswer(concept: string): string {
    // Generate realistic numerical answers based on concept
    const numericalConcepts: Record<string, () => string> = {
      "Machine Learning": () => `${(Math.random() * 0.3 + 0.7).toFixed(3)}`, // Accuracy score
      "Big O Notation": () => `O(${Math.random() > 0.5 ? "n" : "log n"})`,
      "Neural Networks": () => `${Math.floor(Math.random() * 10 + 1)} layers`,
      default: () => `${(Math.random() * 100).toFixed(2)}`,
    }

    const generator = numericalConcepts[concept] || numericalConcepts.default
    return generator()
  }
}
