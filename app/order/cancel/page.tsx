"use client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderCancelPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-6xl">❌</span>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">Payment Cancelled</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Your payment was not completed. If this was a mistake, you can try again or contact support for help.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </DashboardShell>
  );
}
