"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { CapturedPageMeta } from "@/lib/captured/loader";

interface CapturedShellProps {
  page: CapturedPageMeta;
  inlineStyles: string;
  bodyHtml: string;
}

const INTERNAL_PREFIXES = ["/agents", "/dashboard", "/automations", "/login"];

function isInternalHref(href: string): boolean {
  if (!href || href.startsWith("#") || href.startsWith("http")) return false;
  return INTERNAL_PREFIXES.some(
    (prefix) => href === prefix || href.startsWith(`${prefix}/`),
  );
}

export function CapturedShell({
  page,
  inlineStyles,
  bodyHtml,
}: CapturedShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    root.className = `${page.htmlClass} geistsans geistmono monaco-enable-motion underline-links h-full`;
    root.style.colorScheme = page.htmlClass;
  }, [page.htmlClass]);

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest("a[href]");
      if (!target || !(target instanceof HTMLAnchorElement)) return;
      const href = target.getAttribute("href");
      if (!href || !isInternalHref(href)) return;
      event.preventDefault();
      router.push(href);
    };

    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [router]);

  return (
    <>
      {page.stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {inlineStyles ? (
        <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      ) : null}
      <div
        ref={rootRef}
        className="captured-root"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
        suppressHydrationWarning
      />
    </>
  );
}
