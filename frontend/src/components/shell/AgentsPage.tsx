"use client";

import type { Composer as ComposerType, ThreadTurnFixture } from "@/types";
import { useAgents } from "@/hooks";
import { Sidebar } from "./Sidebar";
import { AppHeader } from "./AppHeader";
import { Composer } from "./Composer";
import { Turn } from "@/components/thread";

interface AgentsPageProps {
  activeThreadId?: string;
  threadTitle?: string;
  turns?: ThreadTurnFixture[];
  composer?: ComposerType;
}

export function AgentsPage({
  activeThreadId,
  threadTitle,
  turns = [],
  composer,
}: AgentsPageProps) {
  const { composers } = useAgents();
  const title = threadTitle ?? composer?.name ?? "New Agent";

  return (
    <div className="agents-page flex h-dvh min-h-dvh bg-theme-bg text-primary">
      <Sidebar composers={composers} activeThreadId={activeThreadId} />

      <div className="flex min-w-0 flex-1 flex-col">
        {activeThreadId ? (
          <>
            <AppHeader title={title} />
            <main className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[720px] px-4 py-6">
                {turns.map((turn) => (
                  <Turn key={turn.index} turn={turn} />
                ))}
              </div>
            </main>
            <Composer />
          </>
        ) : (
          <>
            <div className="flex h-10 shrink-0 items-center border-b border-tertiary px-4">
              <h1 className="text-sm font-medium text-primary">New Agent</h1>
            </div>
            <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
              <p className="mb-2 text-lg text-primary">
                What should we build today?
              </p>
              <p className="text-sm text-secondary">
                Select a thread from the sidebar or start a new agent.
              </p>
            </main>
            <Composer />
          </>
        )}
      </div>
    </div>
  );
}
