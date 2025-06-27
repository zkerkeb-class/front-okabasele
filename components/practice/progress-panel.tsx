"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ProgressPanel() {
  const [activeTab, setActiveTab] = useState("stats")

  // Sample data for demonstration
  const stats = {
    accuracy: 85,
    timing: 78,
    dynamics: 92,
    streak: 12,
    totalNotes: 48,
    correctNotes: 41,
    incorrectNotes: 7,
    missedNotes: 0,
  }

  const recentMistakes = [
    { note: "F4", measure: 2, count: 3, issue: "Timing" },
    { note: "G4", measure: 3, count: 2, issue: "Wrong Note" },
    { note: "E4", measure: 1, count: 1, issue: "Dynamics" },
  ]

  const achievements = [
    { name: "First Scale", status: "completed", date: "Today" },
    { name: "Perfect Timing", status: "in-progress", progress: 70 },
    { name: "Note Streak", status: "in-progress", progress: 60 },
  ]

  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="bg-muted/20 backdrop-blur-sm border-b px-4 py-3">
        <CardTitle className="text-base font-medium">Practice Statistics</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="stats">Performance</TabsTrigger>
            <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy</span>
                  <span className="text-sm font-medium">{stats.accuracy}%</span>
                </div>
                <Progress value={stats.accuracy} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Timing</span>
                  <span className="text-sm font-medium">{stats.timing}%</span>
                </div>
                <Progress value={stats.timing} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Dynamics</span>
                  <span className="text-sm font-medium">{stats.dynamics}%</span>
                </div>
                <Progress value={stats.dynamics} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current Streak</span>
                  <span className="text-sm font-medium">{stats.streak} notes</span>
                </div>
                <Progress value={(stats.streak / 20) * 100} className="h-2" />
              </div>
            </div>

            <div className="bg-muted/10 rounded-lg p-3 space-y-2">
              <h4 className="text-sm font-medium">Note Statistics</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-md p-2 shadow-sm">
                  <div className="text-lg font-bold">{stats.correctNotes}</div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div className="bg-white rounded-md p-2 shadow-sm">
                  <div className="text-lg font-bold">{stats.incorrectNotes}</div>
                  <div className="text-xs text-muted-foreground">Incorrect</div>
                </div>
                <div className="bg-white rounded-md p-2 shadow-sm">
                  <div className="text-lg font-bold">{stats.missedNotes}</div>
                  <div className="text-xs text-muted-foreground">Missed</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mistakes" className="space-y-4">
            <div className="space-y-3">
              {recentMistakes.map((mistake, index) => (
                <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                  <div>
                    <div className="font-medium">{mistake.note}</div>
                    <div className="text-xs text-muted-foreground">Measure {mistake.measure}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {mistake.issue}
                    </Badge>
                    <div className="text-sm font-medium">{mistake.count}x</div>
                  </div>
                </div>
              ))}

              {recentMistakes.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">No mistakes recorded yet. Keep practicing!</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{achievement.name}</div>
                    {achievement.status === "completed" ? (
                      <Badge className="bg-green-500">Completed</Badge>
                    ) : (
                      <Badge variant="outline">In Progress</Badge>
                    )}
                  </div>

                  {achievement.status === "in-progress" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1.5" />
                    </div>
                  )}

                  {achievement.status === "completed" && (
                    <div className="text-xs text-muted-foreground">Completed {achievement.date}</div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
