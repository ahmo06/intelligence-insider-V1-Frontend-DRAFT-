interface AssistantContentProps {
  html: string;
}

export function AssistantContent({ html }: AssistantContentProps) {
  if (!html) return null;

  return (
    <div
      className="portal-markdown-root prose prose-sm dark:prose-invert max-w-none break-words text-base text-primary [&_a]:text-accent [&_a]:hover:text-accent-secondary [&_code]:rounded [&_code]:bg-elevated [&_code]:px-1 [&_code]:py-0.5 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:my-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
