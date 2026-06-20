"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme";

const STATE_ROUTES = [
  {
    href: "/states/expanded-thinking",
    title: "Expanded thinking",
    description: "Thinking (running) vs Thought (collapsed/expanded)",
  },
  {
    href: "/states/expanded-tool-card",
    title: "Tool call cards",
    description: "Expanded, collapsed, and running command cards",
  },
  {
    href: "/states/light-theme",
    title: "Light theme",
    description: "Full shell with html.light token ramp",
  },
];

export default function StatesIndexPage() {
  return (
    <div className="min-h-dvh bg-theme-bg p-8 text-primary">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Runtime state variants</h1>
          <ThemeToggle />
        </div>
        <p className="mb-6 text-sm text-secondary">
          Interaction states for frontend development — backed by{" "}
          <code className="rounded bg-elevated px-1">
            fixtures/api/background-composer/interaction-states.json
          </code>
        </p>
        <ul className="space-y-3">
          {STATE_ROUTES.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="block rounded-lg border border-tertiary bg-elevated px-4 py-3 transition-colors hover:border-secondary"
              >
                <div className="font-medium">{route.title}</div>
                <div className="text-sm text-secondary">{route.description}</div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-tertiary">
          <Link href="/agents" className="text-accent hover:underline">
            ← Back to agents
          </Link>
        </p>
      </div>
    </div>
  );
}
