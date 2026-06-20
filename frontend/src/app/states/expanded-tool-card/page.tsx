"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ToolCallCard, TurnFooter } from "@/components/thread";
import { ThemeToggle, useTheme } from "@/components/theme";
import { useInteractionStates } from "@/hooks";

export default function ExpandedToolCardStatePage() {
  const { data, isLoading } = useInteractionStates();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  if (isLoading || !data) {
    return <div className="p-8 text-secondary">Loading states…</div>;
  }

  const { toolCards, turnFooter } = data;

  return (
    <div className="min-h-dvh bg-theme-bg p-8 text-primary">
      <div className="mx-auto max-w-[720px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Tool call card states</h1>
            <p className="text-sm text-secondary">
              Expanded · Collapsed · Running
            </p>
          </div>
          <ThemeToggle />
        </div>

        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-tertiary">
            Expanded
          </h2>
          <ToolCallCard {...toolCards.expanded} />
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-tertiary">
            Collapsed (click header to expand)
          </h2>
          <ToolCallCard {...toolCards.collapsed} />
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-tertiary">
            Running
          </h2>
          <ToolCallCard {...toolCards.running} />
        </section>

        <section className="mb-8 space-y-4 rounded-lg border border-tertiary bg-elevated p-4">
          <h2 className="text-xs font-medium uppercase tracking-wide text-tertiary">
            Turn footer tense
          </h2>
          <div data-agent-turn-hidden-steps={turnFooter.working.hiddenSteps}>
            <TurnFooter
              duration={turnFooter.working.duration}
              isRunning={turnFooter.working.isRunning}
            />
          </div>
          <TurnFooter
            duration={turnFooter.worked.duration}
            isRunning={turnFooter.worked.isRunning}
          />
        </section>

        <Link href="/states" className="text-sm text-accent hover:underline">
          ← All states
        </Link>
      </div>
    </div>
  );
}
