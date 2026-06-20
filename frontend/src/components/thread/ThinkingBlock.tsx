interface ThinkingBlockProps {
  isRunning: boolean;
  durationSeconds?: number;
}

export function ThinkingBlock({
  isRunning,
  durationSeconds = 1,
}: ThinkingBlockProps) {
  const suffix =
    durationSeconds === 1 ? " for 1 second" : ` for ${durationSeconds} seconds`;

  return (
    <div className="mb-0 flex items-center text-base text-white/40">
      <span className="min-w-0 flex-1 truncate">
        <span className="composer-run-title-verb">
          {isRunning ? "Thinking" : "Thought"}
        </span>
        {!isRunning && (
          <span className="composer-run-title-rest">{suffix}</span>
        )}
      </span>
      {!isRunning && (
        <svg
          className="lucide lucide-chevron-right h-3 w-3 shrink-0 opacity-60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </div>
  );
}
