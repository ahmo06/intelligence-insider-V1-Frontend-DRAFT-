"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks";
import type { Composer } from "@/types";
import { ThreadList } from "./ThreadList";

const NAV_ITEMS = [
  { href: "/agents", label: "New Agent", exact: true },
  { href: "/automations", label: "Automations" },
  { href: "/dashboard/bugbot", label: "Bugbot", external: false },
  { href: "/dashboard", label: "Dashboard" },
];

interface SidebarProps {
  composers: Composer[];
  activeThreadId?: string;
}

export function Sidebar({ composers, activeThreadId }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className="relative isolate flex w-[280px] shrink-0 flex-col border-r border-tertiary bg-sidebar transition-all duration-150 ease-in-out max-md:hidden"
      style={{ width: 280 }}
    >
      <div className="flex items-center gap-2 border-b border-tertiary px-4 py-3">
        <span className="text-sm font-semibold tracking-tight text-primary">
          Cursor
        </span>
      </div>

      <nav className="flex flex-col gap-0.5 p-2">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-secondary text-primary"
                  : "text-secondary hover:bg-secondary hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <ThreadList composers={composers} activeId={activeThreadId} />

      <div className="mt-auto border-t border-tertiary p-4">
        <div className="text-sm text-primary">{user?.name ?? "Not signed in"}</div>
        <div className="text-xs text-tertiary">Ultra</div>
      </div>
    </aside>
  );
}
