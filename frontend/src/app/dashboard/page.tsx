"use client";

import { Sidebar } from "@/components/shell";
import { useAgents, useDashboard } from "@/hooks";
import { formatPercent, formatSpend } from "@/lib/format";

export default function DashboardPage() {
  const { composers } = useAgents();
  const { dashboard, isLoading, error } = useDashboard();

  const usage = dashboard?.periodUsage.planUsage;
  const recentMetrics = dashboard?.analytics.dailyMetrics.slice(-14) ?? [];
  const maxAgentRequests = Math.max(
    ...recentMetrics.map((m) => m.agentRequests ?? 0),
    1,
  );

  return (
    <div className="agents-page flex h-dvh min-h-dvh bg-theme-bg text-primary">
      <Sidebar composers={composers} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 shrink-0 items-center border-b border-tertiary px-4">
          <h1 className="text-sm font-medium">Dashboard</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          {isLoading && <p className="text-sm text-secondary">Loading…</p>}
          {error && (
            <p className="text-sm text-danger">Error: {error.message}</p>
          )}

          {dashboard && usage && (
            <div className="mx-auto max-w-5xl space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-tertiary bg-elevated p-4">
                  <dt className="text-xs text-tertiary">Total spend</dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {formatSpend(usage.totalSpend)}
                  </dd>
                  <p className="mt-1 text-xs text-secondary">
                    of {formatSpend(usage.limit)} included
                  </p>
                </div>
                <div className="rounded-xl border border-tertiary bg-elevated p-4">
                  <dt className="text-xs text-tertiary">Total usage</dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {formatPercent(usage.totalPercentUsed)}
                  </dd>
                  <p className="mt-1 text-xs text-secondary">
                    {dashboard.periodUsage.autoModelSelectedDisplayMessage}
                  </p>
                </div>
                <div className="rounded-xl border border-tertiary bg-elevated p-4">
                  <dt className="text-xs text-tertiary">API usage</dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {formatPercent(usage.apiPercentUsed)}
                  </dd>
                  <p className="mt-1 text-xs text-secondary">
                    {dashboard.periodUsage.namedModelSelectedDisplayMessage}
                  </p>
                </div>
                <div className="rounded-xl border border-tertiary bg-elevated p-4">
                  <dt className="text-xs text-tertiary">Credit grants</dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {dashboard.creditGrants.hasCreditGrants ? "Active" : "None"}
                  </dd>
                  {usage.bonusSpend > 0 && (
                    <p className="mt-1 text-xs text-secondary">
                      Bonus: {formatSpend(usage.bonusSpend)}
                    </p>
                  )}
                </div>
              </div>

              <section className="rounded-xl border border-tertiary bg-elevated p-5">
                <h2 className="mb-4 text-sm font-medium text-primary">
                  Agent activity (last 14 days)
                </h2>
                <div className="flex items-end gap-1" style={{ height: 120 }}>
                  {recentMetrics.map((metric) => {
                    const count = metric.agentRequests ?? 0;
                    const height = Math.max(4, (count / maxAgentRequests) * 100);
                    return (
                      <div
                        key={metric.date}
                        className="flex-1 rounded-sm bg-accent/70"
                        style={{ height: `${height}%` }}
                        title={`${count} agent requests`}
                      />
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
