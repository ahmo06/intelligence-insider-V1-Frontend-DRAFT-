import type { Composer } from "@/types";

export function isComposerRunning(status: string): boolean {
  return status === "BACKGROUND_COMPOSER_STATUS_RUNNING";
}

export function formatRepoSecondary(composer: Composer): string {
  if (composer.environmentName) return composer.environmentName;
  if (composer.repoUrls?.[0]) return composer.repoUrls[0];
  try {
    return new URL(composer.repoUrl).pathname.slice(1);
  } catch {
    return composer.repoUrl;
  }
}

export function formatSpend(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export interface ThreadGroup {
  label: string;
  composers: Composer[];
}

export function groupComposersByDate(composers: Composer[]): ThreadGroup[] {
  const sorted = [...composers].sort(
    (a, b) => b.lastMessageActivityAtMs - a.lastMessageActivityAtMs,
  );

  const dayKeys = new Set<string>();
  for (const c of sorted) {
    dayKeys.add(dayKey(c.lastMessageActivityAtMs));
  }

  const orderedDays = [...dayKeys];
  const todayKey = orderedDays[0];
  const yesterdayKey = orderedDays[1];

  const groups = new Map<string, Composer[]>();

  for (const composer of sorted) {
    const key = dayKey(composer.lastMessageActivityAtMs);
    let label: string;
    if (key === todayKey) {
      label = "Today";
    } else if (key === yesterdayKey) {
      label = "Yesterday";
    } else {
      label = formatDayLabel(composer.lastMessageActivityAtMs);
    }

    const existing = groups.get(label) ?? [];
    existing.push(composer);
    groups.set(label, existing);
  }

  return [...groups.entries()].map(([label, items]) => ({ label, composers: items }));
}

function dayKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatDayLabel(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
