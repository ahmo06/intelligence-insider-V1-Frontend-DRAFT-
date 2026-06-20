"use client";

import { useState } from "react";

interface HumanMessageCardProps {
  message: string;
  collapsed?: boolean;
}

export function HumanMessageCard({
  message,
  collapsed = false,
}: HumanMessageCardProps) {
  const [expanded, setExpanded] = useState(!collapsed);
  const isLong = message.length > 200;
  const showCollapsed = collapsed && isLong && !expanded;

  return (
    <div className="group relative">
      <div
        className={`human-message-card relative w-full min-w-0 overflow-hidden rounded-[12px] px-3 py-2 ${
          isLong
            ? "cursor-pointer transition-[border-color] duration-150 hover:border-secondary"
            : ""
        }`}
        aria-label={isLong ? "Expand or collapse message" : undefined}
        onClick={isLong ? () => setExpanded((v) => !v) : undefined}
        onKeyDown={
          isLong
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpanded((v) => !v);
                }
              }
            : undefined
        }
        role={isLong ? "button" : undefined}
        tabIndex={isLong ? 0 : undefined}
      >
        <div className="relative">
          <div
            className={`text-theme w-full whitespace-pre-wrap break-words text-base ${
              showCollapsed ? "max-h-[68px] overflow-hidden" : ""
            }`}
          >
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
