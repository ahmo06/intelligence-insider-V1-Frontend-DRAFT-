const TABS = ["Environment", "Git", "Desktop", "Terminal", "Files"] as const;

interface AppHeaderProps {
  title: string;
  activeTab?: (typeof TABS)[number];
}

export function AppHeader({
  title,
  activeTab = "Environment",
}: AppHeaderProps) {
  return (
    <header className="shrink-0 border-b border-tertiary">
      <div className="flex h-10 items-center gap-2 px-4">
        <h1 className="min-w-0 truncate text-sm font-medium text-primary">
          {title}
        </h1>
      </div>
      <div className="flex h-9 items-end gap-1 px-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`border-b-2 px-3 pb-2 text-sm transition-colors ${
              tab === activeTab
                ? "border-accent text-primary"
                : "border-transparent text-secondary hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
}
