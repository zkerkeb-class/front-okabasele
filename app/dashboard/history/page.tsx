import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Practice History</h1>
          <p className="text-muted-foreground">Review your past practice sessions and track your progress over time.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search sessions..." className="w-full pl-8" />
          </div>
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Export</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
            <CardDescription>A complete history of your practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>{session.lesson}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${session.successRate}%` }}
                          />
                        </div>
                        <span className="text-sm">{session.successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{session.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/history/${session.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

// Sample data
const sessions = [
  {
    id: "1",
    date: "May 4, 2023",
    duration: "25 min",
    lesson: "C Major Scale",
    successRate: 85,
    notes: "Good progress on finger positioning",
  },
  {
    id: "2",
    date: "May 3, 2023",
    duration: "40 min",
    lesson: "Basic Chords",
    successRate: 72,
    notes: "Need to work on transitions between chords",
  },
  {
    id: "3",
    date: "May 1, 2023",
    duration: "15 min",
    lesson: "Rhythm Exercise",
    successRate: 90,
    notes: "Excellent timing",
  },
  {
    id: "4",
    date: "Apr 28, 2023",
    duration: "35 min",
    lesson: "Twinkle Twinkle Little Star",
    successRate: 68,
    notes: "Struggled with left hand coordination",
  },
  {
    id: "5",
    date: "Apr 25, 2023",
    duration: "20 min",
    lesson: "Finger Exercises",
    successRate: 95,
    notes: "Great improvement in dexterity",
  },
]
