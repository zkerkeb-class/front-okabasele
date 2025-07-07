import { BookOpen, Clock, Home, Music, Settings, CreditCard } from "lucide-react"

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Practice",
    href: "/dashboard/practice/ai-session",
    icon: Music,
  },
  // {
  //   title: "Library",
  //   href: "/dashboard/library",
  //   icon: BookOpen,
  // },
  {
    title: "History",
    href: "/dashboard/history",
    icon: Clock,
  },
  {
    title: "Subscription",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
]