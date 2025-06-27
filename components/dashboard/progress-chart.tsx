"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    day: "Mon",
    score: 65,
  },
  {
    day: "Tue",
    score: 70,
  },
  {
    day: "Wed",
    score: 68,
  },
  {
    day: "Thu",
    score: 75,
  },
  {
    day: "Fri",
    score: 80,
  },
  {
    day: "Sat",
    score: 85,
  },
  {
    day: "Sun",
    score: 82,
  },
]

export function ProgressChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Day</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.day}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Score</span>
                      <span className="font-bold">{payload[0].value}%</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 6, style: { fill: "#8884d8", opacity: 0.25 } }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
