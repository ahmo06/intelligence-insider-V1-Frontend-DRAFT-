// Paste in Chrome DevTools console on cursor.com (logged in).
// Downloads page HTML + intercepted API responses for the current view.
(async () => {
  const slug = location.pathname.replace(/\//g, "_").replace(/^_|_$/g, "") || "home";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  const payload = {
    captured_at: new Date().toISOString(),
    url: location.href,
    pathname: location.pathname,
    title: document.title,
    html: document.documentElement.outerHTML,
    components: {
      agent_turns: document.querySelectorAll("[data-agent-turn]").length,
      human_turns: document.querySelectorAll("[data-agent-turn-human]").length,
      tool_cards: document.querySelectorAll('[data-component="tool-display-card"]').length,
      thinking_blocks: document.querySelectorAll(".composer-run-title-verb").length,
      todo_lists: document.querySelectorAll(".ui-todo-list").length,
      subagent_rows: document.querySelectorAll("[data-subagent-task-id]").length,
      monaco_editors: document.querySelectorAll(".monaco-editor").length,
      data_attributes: [
        ...new Set(
          [...document.querySelectorAll("*")]
            .flatMap((el) => [...el.attributes].map((a) => a.name))
            .filter((n) => n.startsWith("data-")),
        ),
      ].sort(),
    },
    api: window.__CAPTURED_API__ || [],
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `cursor-capture__${slug}__${stamp}.json`;
  a.click();
  console.log("Captured", slug, payload.components);
})();
