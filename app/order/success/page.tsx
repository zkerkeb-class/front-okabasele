"use client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-6xl">🎉</span>
          <h1 className="text-3xl font-bold tracking-tight text-green-600">Payment Successful!</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Thank you for your purchase. Your subscription is now active and you can enjoy all premium features.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </DashboardShell>
  );
}
