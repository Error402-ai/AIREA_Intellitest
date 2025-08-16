"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const competencyData = [
  { name: "Machine Learning", value: 85, growth: 12, tests: 8 },
  { name: "Data Science", value: 78, growth: 8, tests: 6 },
  { name: "Statistics", value: 82, growth: 15, tests: 5 },
  { name: "AI Ethics", value: 92, growth: 5, tests: 3 },
  { name: "Programming", value: 88, growth: 10, tests: 7 },
]

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

interface CompetencyBreakdownProps {
  results: any[]
}

export function CompetencyBreakdown({ results }: CompetencyBreakdownProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium mb-4">Competency Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={competencyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {competencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm">
                          Score: <span className="font-medium">{data.value}%</span>
                        </p>
                        <p className="text-sm">
                          Growth: <span className="text-green-600">+{data.growth}%</span>
                        </p>
                        <p className="text-sm">Tests: {data.tests}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Growth Trends</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competencyData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 20]} />
              <YAxis dataKey="name" type="category" width={100} className="text-xs" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm">
                          Growth: <span className="font-medium text-green-600">+{payload[0]?.value}%</span>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="growth" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
