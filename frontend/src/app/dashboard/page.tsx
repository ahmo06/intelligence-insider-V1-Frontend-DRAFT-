"use client";

import { AgentsShell } from "@/components/shell";
import { useDashboard } from "@/hooks";

export default function DashboardPage() {
  const { usage, isLoading, error } = useDashboard();

  return (
    <AgentsShell title="Dashboard">
      <div className="mx-auto max-w-3xl p-6">
        {isLoading && <p className="text-sm">Loading dashboard…</p>}
        {error && (
          <p className="text-sm text-red-400">Error: {error.message}</p>
        )}
        {usage && (
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
              <dt className="text-xs text-[#888]">Period usage</dt>
              <dd className="mt-1 text-lg font-medium">
                {usage.currentPeriodUsage ?? "—"}
              </dd>
            </div>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
              <dt className="text-xs text-[#888]">Credit balance</dt>
              <dd className="mt-1 text-lg font-medium">
                {usage.creditBalance ?? "—"}
              </dd>
            </div>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
              <dt className="text-xs text-[#888]">Billing cycle</dt>
              <dd className="mt-1 text-lg font-medium">
                {usage.billingCycle ?? "—"}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </AgentsShell>
  );
}
