"use client";

export function Composer() {
  return (
    <div className="shrink-0 border-t border-tertiary bg-chrome p-4">
      <div className="mx-auto max-w-[720px]">
        <div className="rounded-xl border border-tertiary bg-elevated">
          <div
            className="min-h-[44px] px-4 py-3 text-base text-tertiary"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Message composer"
            data-lexical-editor="true"
          >
            Ask Cursor to build, fix bugs, explore
          </div>
          <div className="flex items-center justify-between border-t border-tertiary px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-tertiary">
              <span>default</span>
            </div>
            <button
              type="button"
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-inverted hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
