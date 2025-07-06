"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Music, TrendingUp, Award, BarChart3, History } from "lucide-react"
import { motion } from "framer-motion"

// Types basés sur la structure JSON du backend
interface SessionData {
  id: string
  startedAt: string
}

interface PerformanceFeedback {
  score: number
  comments: string
  details?: any
}

interface Performance {
  _id: string
  startedAt: string
  endedAt: string
  section: string
  midiNotes: any[] // Structure des notes MIDI
  user: string
  session: string
  feedback?: PerformanceFeedback
}

interface PerformancesBySection {
  [sectionName: string]: Performance[]
}

interface SessionPerformanceData {
  session: SessionData
  performances: PerformancesBySection
}

interface ProgressPanelProps {
  data: SessionPerformanceData
  isLoading?: boolean
}

export function ProgressPanel({ data, isLoading = false }: ProgressPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculs des statistiques globales
  const stats = useMemo(() => {
    if (!data || !data.performances) {
      return {
        totalPerformances: 0,
        averageScore: 0,
        totalSections: 0,
        totalNotesPlayed: 0,
        sessionDuration: 0,
        bestSection: null,
        worstSection: null,
        improvementTrend: 0,
      }
    }

    const allPerformances = Object.values(data.performances).flat()
    const totalPerformances = allPerformances.length
    const averageScore =
      totalPerformances > 0
        ? Math.round(
            allPerformances.reduce(
              (sum, perf) => sum + (perf.feedback?.score ?? 0),
              0
            ) / totalPerformances
          )
        : 0

    const totalSections = Object.keys(data.performances).length
    const totalNotesPlayed = allPerformances.reduce((sum, perf) => sum + (perf.midiNotes?.length || 0), 0)

    // Calcul de la durée de session
    const sessionStart = new Date(data.session.startedAt)
    const lastPerformance = allPerformances.reduce((latest, perf) => {
      const perfEnd = new Date(perf.endedAt)
      return perfEnd > latest ? perfEnd : latest
    }, sessionStart)
    const sessionDuration = Math.round((lastPerformance.getTime() - sessionStart.getTime()) / 1000 / 60) // en minutes

    // Meilleure et pire section
    const sectionAverages = Object.entries(data.performances).map(([section, performances]) => ({
      section,
      average: performances.reduce((sum, perf) => sum + (perf?.feedback?.score ?? 0), 0) / performances.length,
    }))

    const bestSection = sectionAverages.reduce(
      (best, current) => (current.average > best.average ? current : best),
      sectionAverages[0],
    )
    const worstSection = sectionAverages.reduce(
      (worst, current) => (current.average < worst.average ? current : worst),
      sectionAverages[0],
    )

    // Tendance d'amélioration (score de la dernière performance vs première)
    const sortedPerformances = allPerformances.sort(
      (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
    )
    const improvementTrend =
      sortedPerformances.length > 1
        ? (sortedPerformances[sortedPerformances.length - 1].feedback?.score ?? 0) - (sortedPerformances[0].feedback?.score ?? 0)
        : 0

    return {
      totalPerformances,
      averageScore,
      totalSections,
      totalNotesPlayed,
      sessionDuration,
      bestSection,
      worstSection,
      improvementTrend,
    }
  }, [data])

  if (isLoading) {
    return (
      <Card className="shadow-md border-none overflow-hidden">
        <CardHeader className="bg-muted/20 backdrop-blur-sm border-b px-4 py-3">
          <CardTitle className="text-base font-medium">Chargement des performances...</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.session) {
    return (
      <Card className="shadow-md border-none overflow-hidden">
        <CardHeader className="bg-muted/20 backdrop-blur-sm border-b px-4 py-3">
          <CardTitle className="text-base font-medium">Aucune donnée disponible</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-muted-foreground">Aucune performance trouvée pour cette session.</p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (startDate: string, endDate: string) => {
    const duration = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 70) return "text-blue-600 bg-blue-50"
    if (score >= 50) return "text-amber-600 bg-amber-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 70) return "Bien"
    if (score >= 50) return "Moyen"
    return "À améliorer"
  }

  // Parse feedback.comments string (json objects separated by commas) into array of objects
  function parseFeedbackComments(comments?: string): { type: string, message: string }[] {
    if (!comments || typeof comments !== "string" || comments.trim() === "") return [];
    // Try to split and parse each JSON object in the string
    // Handles: '{...}, {...}, {...}' or '[{...},{...}]'
    let arr: { type: string, message: string }[] = [];
    try {
      if (comments.trim().startsWith("[")) {
        arr = JSON.parse(comments);
      } else {
        // Split on '}, {' and fix brackets
        const parts = comments.split(/},\s*\{/g).map((part, idx, all) => {
          let jsonStr = part;
          if (idx === 0 && all.length > 1) jsonStr += '}';
          else if (idx === all.length - 1 && all.length > 1) jsonStr = '{' + jsonStr;
          else if (all.length > 1) jsonStr = '{' + jsonStr + '}';
          return jsonStr;
        });
        arr = parts.map(str => {
          try { return JSON.parse(str); } catch { return null; }
        }).filter(Boolean) as { type: string, message: string }[];
      }
    } catch { /* ignore */ }
    return arr;
  }

  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="bg-muted/20 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performances de la Session
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            ID: {data.session.id.slice(-8)}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(data.session.startedAt)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {stats.sessionDuration} min
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="sections">Par section</TabsTrigger>
            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Statistiques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                className="bg-white rounded-lg p-3 border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Score moyen</span>
                </div>
                <div className="text-xl font-bold">{stats.averageScore}%</div>
                <div className="text-xs text-muted-foreground">{getScoreLabel(stats.averageScore)}</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-3 border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Music className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Notes jouées</span>
                </div>
                <div className="text-xl font-bold">{stats.totalNotesPlayed}</div>
                <div className="text-xs text-muted-foreground">{stats.totalPerformances} performances</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-3 border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Progression</span>
                </div>
                <div className={`text-xl font-bold ${stats.improvementTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.improvementTrend >= 0 ? "+" : ""}
                  {stats.improvementTrend}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.improvementTrend >= 0 ? "En amélioration" : "En baisse"}
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-3 border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <History className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Sections</span>
                </div>
                <div className="text-xl font-bold">{stats.totalSections}</div>
                <div className="text-xs text-muted-foreground">complétées</div>
              </motion.div>
            </div>

            {/* Meilleure et pire section */}
            {stats.bestSection && stats.worstSection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Meilleure section</h4>
                  <div className="text-lg font-bold text-green-600 capitalize">{stats.bestSection.section}</div>
                  <div className="text-sm text-green-700">{Math.round(stats.bestSection.average)}% en moyenne</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">Section à améliorer</h4>
                  <div className="text-lg font-bold text-amber-600 capitalize">{stats.worstSection.section}</div>
                  <div className="text-sm text-amber-700">{Math.round(stats.worstSection.average)}% en moyenne</div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            {Object.entries(data.performances).map(([sectionName, performances]) => {
              const avgScore = Math.round(
                performances.reduce((sum, perf) => sum + (perf.feedback?.score ?? 0), 0) / performances.length,
              )
              return (
                <motion.div
                  key={sectionName}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium capitalize text-lg">{sectionName}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(avgScore)}>
                        {avgScore}% - {getScoreLabel(avgScore)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {performances.length} performance{performances.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {performances.map((performance, index) => (
                      <div key={performance._id} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">#{index + 1}</span>
                          <div className="text-xs">
                            <div>{formatDate(performance.startedAt)}</div>
                            <div className="text-muted-foreground">
                              Durée: {formatDuration(performance.startedAt, performance.endedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${getScoreColor(performance.feedback?.score ?? 0)}`}>
                            {(performance.feedback?.score ?? 0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {performance.midiNotes?.length || 0} notes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Commentaires de la dernière performance */}
                  {performances[performances.length - 1]?.feedback?.comments && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-xs font-medium text-blue-800 mb-1">Dernier commentaire :</h4>
                      <p className="text-sm text-blue-700">{performances[performances.length - 1]?.feedback?.comments}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-3">
              {Object.values(data.performances)
                .flat()
                .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
                .map((performance, index) => {
                  const feedbacks = parseFeedbackComments(performance.feedback?.comments);
                  return (
                    <motion.div
                      key={performance._id}
                      className="flex items-center gap-4 p-3 border rounded-lg bg-white shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium capitalize">{performance.section}</h4>
                          <Badge className={getScoreColor(performance.feedback?.score ?? 0)}>
                            {(performance.feedback?.score ?? 0)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(performance.startedAt)} • {formatDuration(performance.startedAt, performance.endedAt)}
                        </div>
                        {feedbacks.length > 0 && (
                            <div className="mt-2 max-h-32 overflow-y-auto pr-2">
                            <ul className="space-y-1 text-xs">
                              {feedbacks.map((fb, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span
                                className={
                                  fb.type === "note"
                                  ? "text-red-600"
                                  : fb.type === "timing"
                                  ? "text-amber-600"
                                  : fb.type === "velocity"
                                  ? "text-blue-600"
                                  : ""
                                }
                                >
                                {fb.message}
                                </span>
                              </li>
                              ))}
                            </ul>
                            </div>
                        )}
                        {performance.feedback?.comments && feedbacks.length === 0 && (
                          <p className="text-xs mt-1 text-muted-foreground italic">{performance.feedback?.comments}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
