"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AgentsPage } from "@/components/shell";
import { ThinkingBlock, ToolCallCard } from "@/components/thread";
import { ThemeToggle, useTheme } from "@/components/theme";
import { useInteractionStates, useThread } from "@/hooks";

const PORTAL_ID = "bc-773361b1-8875-4853-80fb-1540cd28b9ca";

export default function LightThemeStatePage() {
  const { setTheme } = useTheme();
  const { thread } = useThread(PORTAL_ID);
  const { data: states } = useInteractionStates();

  useEffect(() => {
    setTheme("light");
    return () => setTheme("dark");
  }, [setTheme]);

  const demoTurn = thread?.turns[0];
  const interactionTurn = demoTurn
    ? {
        ...demoTurn,
        thinking: states?.thinking.doneExpanded,
        toolCalls: states ? [states.toolCards.expanded] : [],
        assistantHtml: demoTurn.assistantHtml.slice(0, 1200),
      }
    : undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex items-center justify-between border-b border-tertiary bg-sidebar px-4 py-2">
        <div>
          <h1 className="text-sm font-semibold">Light theme</h1>
          <p className="text-xs text-secondary">
            html.light — anchors from design guidelines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/states" className="text-xs text-accent hover:underline">
            States
          </Link>
        </div>
      </div>

      {interactionTurn ? (
        <AgentsPage
          activeThreadId={PORTAL_ID}
          threadTitle={thread?.composer.name}
          turns={[interactionTurn]}
          composer={thread?.composer}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-secondary">
          Loading light theme preview…
        </div>
      )}

      <div className="border-t border-tertiary bg-sidebar p-4">
        <p className="mb-2 text-xs text-tertiary">Isolated components</p>
        <div className="mx-auto max-w-[720px] space-y-3">
          {states && (
            <>
              <ThinkingBlock {...states.thinking.doneExpanded} />
              <ToolCallCard {...states.toolCards.collapsed} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
