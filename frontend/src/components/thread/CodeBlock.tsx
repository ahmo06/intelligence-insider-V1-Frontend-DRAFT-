interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="ui-code-block my-2 overflow-hidden rounded-lg border border-tertiary">
      <div className="ui-code-block-content relative">
        {language && (
          <div className="border-b border-tertiary px-3 py-1 text-xs text-tertiary">
            {language}
          </div>
        )}
        <pre className="overflow-x-auto p-3 text-sm text-primary">
          <code>{code}</code>
        </pre>
        <div className="ui-code-block-copy-overlay absolute right-2 top-2">
          <button
            type="button"
            className="ui-icon-button rounded-md border border-tertiary bg-elevated px-2 py-1 text-xs text-secondary hover:text-primary"
            aria-label="Copy code"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
