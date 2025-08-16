"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const velocityData = [
  { week: "Week 1", testsCompleted: 2, skillsLearned: 5, efficiency: 85 },
  { week: "Week 2", testsCompleted: 3, skillsLearned: 8, efficiency: 88 },
  { week: "Week 3", testsCompleted: 4, skillsLearned: 12, efficiency: 92 },
  { week: "Week 4", testsCompleted: 3, skillsLearned: 10, efficiency: 90 },
  { week: "Week 5", testsCompleted: 5, skillsLearned: 15, efficiency: 95 },
  { week: "Week 6", testsCompleted: 4, skillsLearned: 13, efficiency: 93 },
]

export function LearningVelocityChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={velocityData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="week" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm">
                      Tests: <span className="font-medium text-primary">{payload[0]?.value}</span>
                    </p>
                    <p className="text-sm">
                      Skills: <span className="font-medium text-green-500">{payload[1]?.value}</span>
                    </p>
                    <p className="text-sm">
                      Efficiency: <span className="font-medium text-blue-500">{payload[2]?.value}%</span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="testsCompleted"
            stackId="1"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="skillsLearned"
            stackId="2"
            stroke="hsl(142, 76%, 36%)"
            fill="hsl(142, 76%, 36%)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
