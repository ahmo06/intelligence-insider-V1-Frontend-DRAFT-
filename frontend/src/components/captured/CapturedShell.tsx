"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { CapturedPageMeta } from "@/lib/captured/loader";

interface CapturedShellProps {
  page: CapturedPageMeta;
  inlineStyles: string;
  bodyHtml: string;
}

const INTERNAL_PREFIXES = ["/agents", "/automations", "/login"];

const CHEVRON_RIGHT_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>';

const CHEVRON_DOWN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>';

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

  // WP-4: minimal interaction glue for the injected right-panel workspace tabs.
  // Toggles `display`/state on already-present captured elements only — no new
  // UI is created here (layout lives in the captured-DOM transform).
  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;
    const panel = container.querySelector<HTMLElement>("[data-right-panel]");
    if (!panel) return;

    const tabs = Array.from(
      panel.querySelectorAll<HTMLElement>("[data-rp-tab]"),
    );
    const panes = Array.from(
      panel.querySelectorAll<HTMLElement>("[data-rp-pane]"),
    );

    const activate = (name: string) => {
      for (const tab of tabs) {
        const active = tab.getAttribute("data-rp-tab") === name;
        tab.setAttribute("data-rp-active", String(active));
        tab.setAttribute("aria-selected", String(active));
        tab.classList.toggle("text-primary", active);
        tab.classList.toggle("text-secondary", !active);
        const indicator = tab.querySelector<HTMLElement>("[data-rp-indicator]");
        if (indicator) indicator.classList.toggle("hidden", !active);
      }
      for (const pane of panes) {
        pane.classList.toggle(
          "hidden",
          pane.getAttribute("data-rp-pane") !== name,
        );
      }
    };

    const onTabClick = (event: MouseEvent) => {
      const tab = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-rp-tab]",
      );
      if (!tab || !panel.contains(tab)) return;
      const name = tab.getAttribute("data-rp-tab");
      if (name) activate(name);
    };
    panel.addEventListener("click", onTabClick);

    // WP-11: wire the Browser pane toolbar (back / forward / refresh) to the
    // embedded preview iframe. Same-origin, so history/reload are permitted.
    const onBrowserClick = (event: MouseEvent) => {
      const btn = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-rp-browser]",
      );
      if (!btn || !panel.contains(btn)) return;
      const frame = panel.querySelector<HTMLIFrameElement>(
        "[data-rp-browser-frame]",
      );
      const win = frame?.contentWindow;
      if (!win) return;
      const action = btn.getAttribute("data-rp-browser");
      try {
        if (action === "back") win.history.back();
        else if (action === "forward") win.history.forward();
        else if (action === "refresh") win.location.reload();
      } catch {
        // Cross-origin navigation may block access; ignore.
      }
    };
    panel.addEventListener("click", onBrowserClick);

    // Drag-to-resize the panel (clamped 280–720px).
    const handle = panel.querySelector<HTMLElement>("[data-rp-resize]");
    let dragging = false;
    const onDown = (event: MouseEvent) => {
      dragging = true;
      event.preventDefault();
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };
    const onMove = (event: MouseEvent) => {
      if (!dragging) return;
      const width = Math.min(
        720,
        Math.max(280, panel.getBoundingClientRect().right - event.clientX),
      );
      panel.style.width = `${width}px`;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    handle?.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      panel.removeEventListener("click", onTabClick);
      panel.removeEventListener("click", onBrowserClick);
      handle?.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [bodyHtml]);

  // Sidebar: project expand/collapse, project menu, Projects + button.
  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    const setProjectExpanded = (
      projectId: string,
      expanded: boolean,
    ) => {
      const header = container.querySelector<HTMLElement>(
        `[data-project-header][data-project-id="${projectId}"]`,
      );
      const sessions = container.querySelector<HTMLElement>(
        `[data-project-sessions][data-project-id="${projectId}"]`,
      );
      const chevron = header?.querySelector<HTMLElement>(
        "[data-project-chevron]",
      );
      if (!header || !sessions) return;
      header.setAttribute("data-project-expanded", String(expanded));
      header.setAttribute("aria-expanded", String(expanded));
      sessions.classList.toggle("hidden", !expanded);
      sessions.classList.toggle("flex", expanded);
      if (chevron) {
        chevron.innerHTML = expanded ? CHEVRON_DOWN_SVG : CHEVRON_RIGHT_SVG;
      }
    };

    const closeAllMenus = () => {
      container
        .querySelectorAll<HTMLElement>('[data-project-menu-panel="true"]')
        .forEach((panel) => panel.classList.add("hidden"));
    };

    const onSidebarClick = (event: MouseEvent) => {
      const target = event.target as Element;

      const menuBtn = target.closest<HTMLElement>("[data-project-menu]");
      if (menuBtn) {
        event.stopPropagation();
        const projectId = menuBtn.getAttribute("data-project-id");
        if (!projectId) return;
        const panel = container.querySelector<HTMLElement>(
          `[data-project-menu-panel][data-project-id="${projectId}"]`,
        );
        if (!panel) return;
        const wasHidden = panel.classList.contains("hidden");
        closeAllMenus();
        if (wasHidden) panel.classList.remove("hidden");
        return;
      }

      const actionBtn = target.closest<HTMLElement>("[data-project-action]");
      if (actionBtn) {
        event.stopPropagation();
        const action = actionBtn.getAttribute("data-project-action");
        const projectId = actionBtn.getAttribute("data-project-id");
        closeAllMenus();
        if (action === "new-session" && projectId) {
          router.push(`/agents/new?project=${encodeURIComponent(projectId)}`);
        }
        return;
      }

      const projectsAdd = target.closest<HTMLElement>("[data-projects-add]");
      if (projectsAdd) {
        event.preventDefault();
        router.push("/agents/new");
        return;
      }

      const header = target.closest<HTMLElement>("[data-project-header]");
      if (header) {
        const projectId = header.getAttribute("data-project-id");
        if (!projectId) return;
        const expanded = header.getAttribute("data-project-expanded") === "true";
        setProjectExpanded(projectId, !expanded);
      }
    };

    const onDocClick = () => closeAllMenus();

    container.addEventListener("click", onSidebarClick);
    document.addEventListener("click", onDocClick);
    return () => {
      container.removeEventListener("click", onSidebarClick);
      document.removeEventListener("click", onDocClick);
    };
  }, [bodyHtml, router]);

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
