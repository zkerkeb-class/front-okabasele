import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import { RecentSessions } from "@/components/dashboard/recent-sessions"
import { ArrowRight, Clock, Music, PlayCircle, Settings } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground">Continue your piano journey with personalized lessons and feedback.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Practice Streak</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Practice Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5 hours</div>
              <p className="text-xs text-muted-foreground">+1.2 hours this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Songs Learned</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8 songs</div>
              <p className="text-xs text-muted-foreground">2 in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Intermediate</div>
              <p className="text-xs text-muted-foreground">Level 3 of 5</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your progress over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart />
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your last 5 practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSessions />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Start AI Practice Session</CardTitle>
              <CardDescription>Get real-time feedback and guidance from your AI piano tutor</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Our AI will analyze your playing and provide personalized tips to help you improve.
              </p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button asChild>
                <Link href="/practice/ai-session">
                  Start Session <PlayCircle className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Practice with Sheet Music</CardTitle>
              <CardDescription>
                Choose from our library of songs and practice with interactive sheet music
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Select from different difficulty levels and genres to find the perfect piece to practice.
              </p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" asChild>
                <Link href="/practice/sheet-music">
                  Browse Library <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
