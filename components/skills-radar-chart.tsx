"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

interface TestResult {
  strengths: string[]
  improvements: string[]
  score: number
}

interface SkillsRadarChartProps {
  results: TestResult[]
}

export function SkillsRadarChart({ results }: SkillsRadarChartProps) {
  // Extract and aggregate skills data
  const skillsMap = new Map<string, { total: number; count: number }>()

  results.forEach((result) => {
    // Add strengths with higher weight
    result.strengths.forEach((skill) => {
      const current = skillsMap.get(skill) || { total: 0, count: 0 }
      skillsMap.set(skill, {
        total: current.total + result.score,
        count: current.count + 1,
      })
    })

    // Add improvements with lower weight
    result.improvements.forEach((skill) => {
      const current = skillsMap.get(skill) || { total: 0, count: 0 }
      skillsMap.set(skill, {
        total: current.total + result.score * 0.7, // Lower weight for improvement areas
        count: current.count + 1,
      })
    })
  })

  // Convert to chart data
  const chartData = Array.from(skillsMap.entries())
    .map(([skill, data]) => ({
      skill: skill.length > 15 ? skill.substring(0, 15) + "..." : skill,
      score: Math.round(data.total / data.count),
      fullName: skill,
    }))
    .slice(0, 8) // Limit to top 8 skills for readability

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis dataKey="skill" className="text-xs fill-muted-foreground" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs fill-muted-foreground" />
          <Radar
            name="Performance"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
