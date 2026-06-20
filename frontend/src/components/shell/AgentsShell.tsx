"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks";

const NAV_ITEMS = [
  { href: "/agents", label: "Agents" },
  { href: "/automations", label: "Automations" },
  { href: "/dashboard", label: "Dashboard" },
];

interface AgentsShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AgentsShell({ children, title = "Agents" }: AgentsShellProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  return (
    <div className="agents-page flex h-dvh bg-[#0a0a0a] text-[#e4e4e4]">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-[#2a2a2a] bg-[#111]">
        <div className="border-b border-[#2a2a2a] px-4 py-3">
          <span className="text-sm font-semibold tracking-tight">Cursor</span>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[#1f1f1f] text-white"
                    : "text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-[#2a2a2a] p-4 text-xs text-[#888]">
          {isLoading ? "Loading…" : (user?.name ?? "Not signed in")}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 shrink-0 items-center border-b border-[#2a2a2a] px-4 text-sm font-medium">
          {title}
        </header>
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
