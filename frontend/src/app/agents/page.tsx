"use client";

import { AgentsShell } from "@/components/shell";
import { useAgents } from "@/hooks";

export default function AgentsPage() {
  const { agents, isLoading, error } = useAgents();

  return (
    <AgentsShell title="Agents">
      <div className="mx-auto max-w-3xl p-6">
        <p className="mb-4 text-sm text-[#888]">
          Live-capture scaffold — thread list will be populated from captured
          APIs.
        </p>
        {isLoading && <p className="text-sm">Loading agents…</p>}
        {error && (
          <p className="text-sm text-red-400">Error: {error.message}</p>
        )}
        {!isLoading && !error && agents.length === 0 && (
          <p className="text-sm text-[#888]">
            No agents yet. Navigate cursor.com while logged in to capture thread
            data.
          </p>
        )}
        <ul className="space-y-2">
          {agents.map((agent) => (
            <li
              key={agent.id}
              className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-3"
            >
              <div className="font-medium">{agent.title}</div>
              <div className="text-xs text-[#888]">{agent.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </AgentsShell>
  );
}
