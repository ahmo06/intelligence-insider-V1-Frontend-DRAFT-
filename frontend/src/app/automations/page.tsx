"use client";

import { AgentsShell } from "@/components/shell";
import { useAutomations } from "@/hooks";

export default function AutomationsPage() {
  const { automations, isLoading, error } = useAutomations();

  return (
    <AgentsShell title="Automations">
      <div className="mx-auto max-w-3xl p-6">
        {isLoading && <p className="text-sm">Loading automations…</p>}
        {error && (
          <p className="text-sm text-red-400">Error: {error.message}</p>
        )}
        <ul className="space-y-2">
          {automations.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-3"
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-[#888]">{item.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </AgentsShell>
  );
}
