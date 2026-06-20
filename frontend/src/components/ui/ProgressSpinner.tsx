interface ProgressSpinnerProps {
  size?: number;
  syncDelay?: number;
  className?: string;
}

export function ProgressSpinner({
  size = 14,
  syncDelay = 0,
  className = "",
}: ProgressSpinnerProps) {
  return (
    <div
      className={`ui-progress ui-progress-ring ui-progress-indeterminate size-[13px] ${className}`}
      role="progressbar"
      aria-valuenow={16}
      aria-valuemin={0}
      aria-valuemax={100}
      style={
        {
          "--cursor-spinner-sync-duration": "1000ms",
          "--cursor-spinner-sync-delay": `${syncDelay}ms`,
          width: size,
          height: size,
        } as React.CSSProperties
      }
    >
      <svg
        width={size + 2}
        height={size + 2}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
          className="ui-progress-ring-track"
        />
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
          className="ui-progress-ring-fill"
        />
      </svg>
    </div>
  );
}
