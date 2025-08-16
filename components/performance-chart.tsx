"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface TestResult {
  id: string
  title: string
  score: number
  completedAt: string
}

interface PerformanceChartProps {
  data: TestResult[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map((result, index) => ({
      test: `Test ${index + 1}`,
      score: result.score,
      date: format(new Date(result.completedAt), "MMM dd"),
      title: result.title,
    }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis domain={[0, 100]} className="text-xs fill-muted-foreground" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{data.title}</p>
                    <p className="text-sm text-muted-foreground">{data.date}</p>
                    <p className="text-sm">
                      Score: <span className="font-medium text-primary">{data.score}%</span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
