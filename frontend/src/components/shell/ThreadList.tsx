"use client";

import Link from "next/link";
import type { Composer } from "@/types";
import {
  formatRepoSecondary,
  groupComposersByDate,
  isComposerRunning,
} from "@/lib/format";
import { ProgressSpinner } from "@/components/ui/ProgressSpinner";

interface ThreadRowProps {
  composer: Composer;
  active?: boolean;
}

export function ThreadRow({ composer, active = false }: ThreadRowProps) {
  const running = isComposerRunning(composer.status);
  const secondary = formatRepoSecondary(composer);

  return (
    <Link
      href={`/agents/${composer.bcId}`}
      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary ${
        active ? "bg-secondary" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-1.5 text-base text-primary">
          <span className="min-w-0 truncate">{composer.name}</span>
          {composer.isUnread && (
            <span
              className="size-[5px] shrink-0 rounded-full bg-accent"
              title="Unread"
            />
          )}
        </span>
        <div className="mt-0.5 flex min-w-0 items-center gap-2 text-base text-secondary">
          <div className="flex min-w-0 items-center gap-1.5">
            {running && <ProgressSpinner size={14} syncDelay={-82} />}
            <span className="min-w-0 truncate">{secondary}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ThreadListProps {
  composers: Composer[];
  activeId?: string;
}

export function ThreadList({ composers, activeId }: ThreadListProps) {
  const groups = groupComposersByDate(composers);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-2">
      {groups.map((group) => (
        <section key={group.label} className="mb-3">
          <h3 className="mb-1 px-2 text-xs font-medium text-tertiary">
            {group.label}
          </h3>
          <div className="flex flex-col gap-0.5">
            {group.composers.map((composer) => (
              <ThreadRow
                key={composer.bcId}
                composer={composer}
                active={composer.bcId === activeId}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
