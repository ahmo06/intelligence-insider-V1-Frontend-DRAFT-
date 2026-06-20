"use client";

import { useState } from "react";

export interface ThinkingBlockData {
  isRunning: boolean;
  durationSeconds?: number;
  content?: string;
  defaultExpanded?: boolean;
}

type ThinkingBlockProps = ThinkingBlockData;

export function ThinkingBlock({
  isRunning,
  durationSeconds = 1,
  content = "",
  defaultExpanded = false,
}: ThinkingBlockProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const seconds = Math.max(1, durationSeconds);
  const suffix =
    seconds === 1 ? " for 1 second" : ` for ${seconds} seconds`;
  const canExpand = !isRunning && Boolean(content);

  return (
    <div className="mb-2">
      {canExpand ? (
        <button
          type="button"
          className="mb-0 flex w-full min-w-0 items-center text-left text-base text-white/40 transition-colors hover:text-white/60"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span className="min-w-0 flex-1 truncate">
            <span className="composer-run-title-verb">Thought</span>
            <span className="composer-run-title-rest">{suffix}</span>
          </span>
          <svg
            className={`lucide lucide-chevron-right h-3 w-3 shrink-0 opacity-60 transition-transform ${expanded ? "rotate-90" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      ) : (
        <div className="mb-0 flex items-center text-base text-white/40">
          <span className="min-w-0 flex-1 truncate">
            <span className="composer-run-title-verb">
              {isRunning ? "Thinking" : "Thought"}
            </span>
            {!isRunning && (
              <span className="composer-run-title-rest">{suffix}</span>
            )}
          </span>
          {isRunning && (
            <span className="make-shine ml-2 text-sm text-tertiary">
              Planning next moves
            </span>
          )}
        </div>
      )}

      {canExpand && expanded && (
        <div
          className="prose prose-sm dark:prose-invert mt-2 max-w-none overflow-wrap-anywhere break-words text-base leading-snug text-tertiary [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1"
          data-thinking-expanded
        >
          {content.split("\n\n").map((block, i) => {
            if (block.startsWith("### ")) {
              return (
                <h3 key={i}>{block.replace(/^### /, "")}</h3>
              );
            }
            if (/^\d+\.\s/.test(block)) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ol key={i}>
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^\d+\.\s/, "")}</li>
                  ))}
                </ol>
              );
            }
            return <p key={i}>{block}</p>;
          })}
        </div>
      )}
    </div>
  );
}
