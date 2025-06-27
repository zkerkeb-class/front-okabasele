import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

const recentSessions = [
  {
    id: "1",
    date: "Today",
    lesson: "C Major Scale",
    duration: "25 min",
    status: "Completed",
  },
  {
    id: "2",
    date: "Yesterday",
    lesson: "Basic Chords",
    duration: "40 min",
    status: "Completed",
  },
  {
    id: "3",
    date: "May 1, 2023",
    lesson: "Rhythm Exercise",
    duration: "15 min",
    status: "Completed",
  },
  {
    id: "4",
    date: "Apr 28, 2023",
    lesson: "Twinkle Twinkle Little Star",
    duration: "35 min",
    status: "Incomplete",
  },
  {
    id: "5",
    date: "Apr 25, 2023",
    lesson: "Finger Exercises",
    duration: "20 min",
    status: "Completed",
  },
]

export function RecentSessions() {
  return (
    <div className="space-y-4">
      {recentSessions.map((session) => (
        <div key={session.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{session.lesson}</p>
            <p className="text-sm text-muted-foreground">{session.date}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={session.status === "Completed" ? "default" : "secondary"}>{session.status}</Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/history/${session.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View session</span>
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
