"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ThinkingBlock } from "@/components/thread";
import { ThemeToggle, useTheme } from "@/components/theme";
import { useInteractionStates } from "@/hooks";

export default function ExpandedThinkingStatePage() {
  const { data, isLoading } = useInteractionStates();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  if (isLoading || !data) {
    return <div className="p-8 text-secondary">Loading states…</div>;
  }

  const { thinking } = data;

  return (
    <div className="min-h-dvh bg-theme-bg p-8 text-primary">
      <div className="mx-auto max-w-[720px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Thinking block states</h1>
            <p className="text-sm text-secondary">
              Running · Thought collapsed · Thought expanded
            </p>
          </div>
          <ThemeToggle />
        </div>

        <section className="mb-8 rounded-lg border border-tertiary bg-elevated p-4">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-tertiary">
            Running
          </h2>
          <ThinkingBlock {...thinking.running} />
        </section>

        <section className="mb-8 rounded-lg border border-tertiary bg-elevated p-4">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-tertiary">
            Done — collapsed (click to expand)
          </h2>
          <ThinkingBlock {...thinking.doneCollapsed} />
        </section>

        <section className="mb-8 rounded-lg border border-tertiary bg-elevated p-4">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-tertiary">
            Done — expanded
          </h2>
          <ThinkingBlock {...thinking.doneExpanded} />
        </section>

        <Link href="/states" className="text-sm text-accent hover:underline">
          ← All states
        </Link>
      </div>
    </div>
  );
}
