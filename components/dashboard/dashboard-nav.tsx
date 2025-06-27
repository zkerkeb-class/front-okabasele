"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, BookOpen, Clock, Home, Music, Settings, CreditCard } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Practice",
    href: "/practice/ai-session",
    icon: Music,
  },
  {
    title: "Library",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "History",
    href: "/history",
    icon: Clock,
  },
  {
    title: "Progress",
    href: "/progress",
    icon: BarChart,
  },
  {
    title: "Subscription",
    href: "/subscription",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 px-2 py-4 text-sm">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn("justify-start", pathname === item.href && "bg-muted font-medium")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
