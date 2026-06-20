"use client";

import Link from "next/link";
import { Sidebar } from "@/components/shell";
import { useAgents, useAutomations } from "@/hooks";

export default function AutomationsPage() {
  const { composers } = useAgents();
  const { automations, isLoading, error } = useAutomations();

  return (
    <div className="agents-page flex h-dvh min-h-dvh bg-theme-bg text-primary">
      <Sidebar composers={composers} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 shrink-0 items-center border-b border-tertiary px-4">
          <h1 className="text-sm font-medium">Automations</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          {isLoading && <p className="text-sm text-secondary">Loading…</p>}
          {error && (
            <p className="text-sm text-danger">Error: {error.message}</p>
          )}

          <div className="mx-auto grid max-w-4xl gap-4">
            {automations.map((entry) => {
              const wf = entry.workflow;
              return (
                <article
                  key={wf.automationId}
                  className="rounded-xl border border-tertiary bg-elevated p-5"
                >
                  <div className="mb-1 flex items-start justify-between gap-4">
                    <h2 className="text-lg font-medium text-primary">
                      {wf.name}
                    </h2>
                    {wf.templateId && (
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-tertiary">
                        {wf.templateId}
                      </span>
                    )}
                  </div>
                  {wf.description && (
                    <p className="mb-3 text-sm text-secondary">
                      {wf.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-tertiary">
                    <span>Model: {wf.workflow.model ?? "default"}</span>
                    <span>Owner: {entry.ownerName}</span>
                    {wf.workflow.triggers?.map((trigger, i) => (
                      <span key={i}>
                        Trigger:{" "}
                        {Object.keys(trigger)[0]?.replace("Trigger", "") ??
                          "manual"}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/agents"
                      className="text-sm text-accent hover:text-accent-secondary"
                    >
                      Configure →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
