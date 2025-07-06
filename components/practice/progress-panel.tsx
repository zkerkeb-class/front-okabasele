"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getUserSessionPerformances } from "@/lib/api/session"

interface ProgressPanelProps {
  sessionId?: string | null
  userId?: string | null
}

export function ProgressPanel({ sessionId, userId }: ProgressPanelProps) {
  const [activeTab, setActiveTab] = useState("stats")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>({})
  const [recentMistakes, setRecentMistakes] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])

  useEffect(() => {
    if (!sessionId || !userId) return
    setLoading(true)
    setError(null)
    getUserSessionPerformances(sessionId, userId)
      .then((data) => {
        setStats({
          accuracy: data?.overallAccuracy || 0,
          timing: data?.overallTiming || 0,
          dynamics: data?.overallDynamics || 0,
          streak: data?.currentStreak || 0,
          totalNotes: data?.totalNotes || 0,
          correctNotes: data?.correctNotes || 0,
          incorrectNotes: data?.incorrectNotes || 0,
          missedNotes: data?.missedNotes || 0,
        })
        setRecentMistakes(Array.isArray(data?.recentMistakes) ? data.recentMistakes : [])
        setAchievements(Array.isArray(data?.achievements) ? data.achievements : [])
        setError(null)
      })
      .catch((e) => {
        // Si c'est une 404 ou aucune performance, on ne met pas d'erreur bloquante
        if (e?.status === 404 || e?.message?.toLowerCase().includes("not found") || e?.message?.toLowerCase().includes("no performance")) {
          setStats({})
          setRecentMistakes([])
          setAchievements([])
          setError(null)
        } else {
          setError(e?.message || "Failed to retrieve performances.")
        }
      })
      .finally(() => setLoading(false))
  }, [sessionId, userId])

  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="bg-muted/20 backdrop-blur-sm border-b px-4 py-3">
        <CardTitle className="text-base font-medium">Practice Statistics</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {loading ? (
          <div className="text-center py-6 text-muted-foreground">Loading statistics...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
