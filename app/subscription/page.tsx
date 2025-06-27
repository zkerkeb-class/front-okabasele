import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function SubscriptionPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">Choose the plan that works best for your learning journey</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>For casual learners</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">Forever free</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic piano lessons</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>5 practice sessions per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Limited song library</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic progress tracking</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-primary">
            <CardHeader>
              <div className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full w-fit mb-2">
                MOST POPULAR
              </div>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>For dedicated learners</CardDescription>
              <div className="mt-4 text-4xl font-bold">$12.99</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>All Free Plan features</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Unlimited practice sessions</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Full song library access</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced AI feedback</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Detailed progress analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Download practice recordings</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Upgrade to Pro</Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Family Plan</CardTitle>
              <CardDescription>For multiple learners</CardDescription>
              <div className="mt-4 text-4xl font-bold">$24.99</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>All Pro Plan features</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Up to 5 user accounts</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Family progress dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Shared song collections</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Upgrade to Family
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="flex items-center justify-between p-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">No payment history</p>
                  <p className="text-sm text-muted-foreground">
                    Your payment history will appear here once you subscribe to a paid plan.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
