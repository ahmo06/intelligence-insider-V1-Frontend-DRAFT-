"use client";

import { useState } from "react";
import { ProgressSpinner } from "@/components/ui/ProgressSpinner";

export interface ToolCallCardData {
  command: string;
  output?: string;
  description?: string;
  isRunning?: boolean;
  defaultExpanded?: boolean;
}

type ToolCallCardProps = ToolCallCardData;

export function ToolCallCard({
  command,
  output,
  description,
  isRunning = false,
  defaultExpanded = true,
}: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      data-component="tool-display-card"
      className="my-0.5 overflow-hidden rounded-lg border border-tertiary bg-transparent"
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-secondary transition-colors duration-150 hover:text-primary focus:outline-none"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {isRunning ? (
          <ProgressSpinner size={13} syncDelay={-200} />
        ) : (
          <svg
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" x2="20" y1="19" y2="19" />
          </svg>
        )}
        <span className="min-w-0 flex-1 truncate font-mono text-primary">
          {description ?? command}
        </span>
        <svg
          className={`h-3 w-3 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
      {expanded && (
        <div className="ui-scroll-area border-t border-tertiary bg-theme-card-hex px-3 py-2">
          <code className="whitespace-pre-wrap break-words pt-1 text-primary">
            <span className="text-tertiary">$ </span>
            {command}
          </code>
          {output ? (
            <pre className="ui-scroll-area__content whitespace-pre-wrap break-words pb-2 pt-1 text-sm text-secondary">
              {output}
            </pre>
          ) : isRunning ? (
            <pre className="pb-2 pt-1 text-sm text-tertiary">Running…</pre>
          ) : null}
        </div>
      )}
    </div>
  );
}
