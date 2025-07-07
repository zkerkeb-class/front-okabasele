"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function SessionDetailPage() {
  const { id } = useParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    // You may want to create a getSessionById API call for a single session
    fetch(`${process.env.NEXT_PUBLIC_BDD_SERVICE_URL || "http://localhost:4002"}/api/sessions/${id}`)
      .then((res) => res.json())
      .then(setSession)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">Loading session...</div>
      </DashboardShell>
    );
  }

  if (!session || session.error) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-lg text-muted-foreground">Session not found.</div>
          <Button asChild>
            <Link href="/dashboard/history">Back to History</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2"><b>Session ID:</b> {session._id}</div>
            <div className="mb-2"><b>Started At:</b> {session.startedAt ? new Date(session.startedAt).toLocaleString() : "-"}</div>
            <div className="mb-2"><b>Ended At:</b> {session.endedAt ? new Date(session.endedAt).toLocaleString() : "-"}</div>
            <div className="mb-2"><b>Status:</b> {session.endedAt ? "Ended" : "Active"}</div>
            <div className="mb-2"><b>Reference:</b> {session.reference || "-"}</div>
            {/* Add more session details as needed */}
          </CardContent>
        </Card>
        <Button asChild variant="outline">
          <Link href="/dashboard/history">Back to History</Link>
        </Button>
      </div>
    </DashboardShell>
  );
}
