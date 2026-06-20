"use client";

import { useParams } from "next/navigation";
import { AgentsShell } from "@/components/shell";
import { useThread } from "@/hooks";

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const threadId = params.id ?? "";
  const { turns, isLoading, error } = useThread(threadId);

  return (
    <AgentsShell title={`Thread ${threadId}`}>
      <div className="mx-auto max-w-3xl p-6">
        {isLoading && <p className="text-sm">Loading thread…</p>}
        {error && (
          <p className="text-sm text-red-400">Error: {error.message}</p>
        )}
        <div className="space-y-4">
          {turns.map((turn) => (
            <article
              key={turn.id}
              data-agent-turn
              className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4"
            >
              <div className="mb-2 text-xs uppercase tracking-wide text-[#888]">
                {turn.role}
              </div>
              <div className="text-sm">{turn.content ?? "(empty turn)"}</div>
            </article>
          ))}
        </div>
      </div>
    </AgentsShell>
  );
}
