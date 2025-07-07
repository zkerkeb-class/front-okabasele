"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { checkout } from "@/lib/api/payments";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { fetchUserSubscriptions } from "@/lib/api/user";
import { ISubscription } from "@/types";
import { subscriptionPlans } from "@/lib/constants/subscriptionPlans";

export default function SubscriptionPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<ISubscription|null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<ISubscription[]>([]);
  useEffect(() => {
    if (user?.id) {
      setSubLoading(true);
      fetchUserSubscriptions(user.id)
        .then(
          (data) => {
            if (data.length > 0) {
             setPaymentHistory(data);
             setSubscription(data.findLast((sub) => sub.status === "active") || null);
            }
          }
        )
        .finally(() => setSubLoading(false));
    }
  }, [user?.id]);

  const handleCheckout = async (type: string) => {
    setLoading(type);
    try {
      await checkout(type, { type });
      toast.success("Paiement initié avec succès !");
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors du paiement.");
    } finally {
      setLoading(null);
    }
  };

  const getPlanButton = (plan: string) => {
    if (subLoading) return <Button variant="outline" className="w-full" disabled>Loading...</Button>;
    if (subscription?.plan === plan && subscription?.status === "active") {
      return <Button variant="outline" className="w-full">Current Plan</Button>;
    }
    if (!subscription && plan === "free") {
      return (
        <Button
          className="w-full"
          onClick={() => handleCheckout(plan)}
          disabled={loading === plan}
          variant="outline"
        >
         Current Plan
        </Button>
      );
    }
    return (
      <Button
        className="w-full"
        onClick={() => handleCheckout(plan)}
        disabled={loading === plan}
        variant={plan === "basic" ? undefined : "outline"}
      >
        {loading === plan ? "Processing..." : `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`}
      </Button>
    );
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Plans
          </h1>
          <p className="text-muted-foreground">
            Choose the plan that works best for your learning journey
          </p>
        </div>

        {/* All 4 cards in the same line */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Free Plan */}
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
              {getPlanButton("free")}
            </CardFooter>
          </Card>
          {/* Basic Plan */}
          <Card className="flex flex-col border-primary">
            <CardHeader>
              <div className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full w-fit mb-2">
                MOST POPULAR
              </div>
              <CardTitle>Basic Plan</CardTitle>
              <CardDescription>For multiple learners</CardDescription>
              <div className="mt-4 text-4xl font-bold">$7.99</div>
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
                  <span>10 practice sessions per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Expanded song library</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic AI feedback</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {getPlanButton("basic")}
            </CardFooter>
          </Card>
          {/* Premium Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>For dedicated learners</CardDescription>
              <div className="mt-4 text-4xl font-bold">$14.99</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>All Basic Plan features</span>
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
              {getPlanButton("premium")}
            </CardFooter>
          </Card>
          {/* Pro Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
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
                  <span>pro progress dashboard</span>
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
              {getPlanButton("pro")}
            </CardFooter>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {subLoading ? (
              <div className="flex items-center justify-center p-4">
              <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : paymentHistory && paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-muted border rounded-md">
                <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
                </thead>
                <tbody className="bg-background divide-y divide-muted">
                {paymentHistory.map((payment, idx) => (
                  <tr key={payment._id || idx}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {payment.createdAt
                    ? new Date(payment.createdAt).toLocaleDateString()
                    : "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm capitalize">
                    {payment.plan || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {subscriptionPlans[payment.plan as keyof typeof subscriptionPlans]
                    ? `$${subscriptionPlans[payment.plan as keyof typeof subscriptionPlans]}`
                    : "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm capitalize">
                    {payment.status || "-"}
                  </td>
                  </tr>
                ))}
                </tbody>
              </table>
              </div>
            ) : (
              <div className="rounded-md border">
              <div className="flex items-center justify-between p-4">
                <div className="grid gap-1">
                <p className="text-sm font-medium">No payment history</p>
                <p className="text-sm text-muted-foreground">
                  Your payment history will appear here once you subscribe to
                  a paid plan.
                </p>
                </div>
              </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
