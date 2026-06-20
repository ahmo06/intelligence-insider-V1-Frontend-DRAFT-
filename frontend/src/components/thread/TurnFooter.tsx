interface TurnFooterProps {
  duration: string;
  isRunning?: boolean;
}

export function TurnFooter({ duration, isRunning = false }: TurnFooterProps) {
  return (
    <button
      type="button"
      className="group flex min-w-0 cursor-pointer items-center gap-1 text-base text-secondary transition-colors hover:text-primary"
    >
      <span className="min-w-0 truncate">
        <span>{isRunning ? "Working for " : "Worked for "}</span>
        {duration}
      </span>
      <svg
        className="lucide lucide-chevron-right h-3 w-3 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}
