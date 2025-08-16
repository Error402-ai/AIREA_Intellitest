"use client"

const heatmapData = [
  { day: "Mon", hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 2, 4, 5, 3, 2, 1, 0, 0, 0, 0, 0] },
  { day: "Tue", hours: [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 3, 2, 3, 5, 6, 4, 3, 2, 1, 0, 0, 0, 0] },
  { day: "Wed", hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 3, 4, 2, 1, 1, 0, 0, 0, 0, 0] },
  { day: "Thu", hours: [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 4, 5, 3, 2, 1, 0, 0, 0, 0, 0] },
  { day: "Fri", hours: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0] },
  { day: "Sat", hours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0] },
  { day: "Sun", hours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0] },
]

const getIntensityColor = (value: number) => {
  if (value === 0) return "bg-muted"
  if (value <= 1) return "bg-green-200"
  if (value <= 2) return "bg-green-300"
  if (value <= 3) return "bg-green-400"
  if (value <= 4) return "bg-green-500"
  if (value <= 5) return "bg-green-600"
  return "bg-green-700"
}

export function StudyPatternHeatmap() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-25 gap-1 text-xs">
        <div></div>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="text-center text-muted-foreground">
            {i % 6 === 0 ? i : ""}
          </div>
        ))}
      </div>

      {heatmapData.map((dayData) => (
        <div key={dayData.day} className="grid grid-cols-25 gap-1 items-center">
          <div className="text-xs font-medium text-muted-foreground w-8">{dayData.day}</div>
          {dayData.hours.map((intensity, hour) => (
            <div
              key={hour}
              className={`h-3 w-3 rounded-sm ${getIntensityColor(intensity)}`}
              title={`${dayData.day} ${hour}:00 - Activity: ${intensity}`}
            />
          ))}
        </div>
      ))}

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
        <span>Less active</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4, 5, 6].map((level) => (
            <div key={level} className={`h-3 w-3 rounded-sm ${getIntensityColor(level)}`} />
          ))}
        </div>
        <span>More active</span>
      </div>
    </div>
  )
}
