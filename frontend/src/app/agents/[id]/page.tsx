"use client";

import { useParams } from "next/navigation";
import { AgentsPage } from "@/components/shell";
import { useThread } from "@/hooks";

export default function ThreadRoutePage() {
  const params = useParams<{ id: string }>();
  const threadId = params.id ?? "";
  const { thread, isLoading, error } = useThread(threadId);

  if (isLoading) {
    return (
      <div className="agents-page flex h-dvh items-center justify-center bg-theme-bg text-secondary">
        Loading thread…
      </div>
    );
  }

  if (error) {
    return (
      <div className="agents-page flex h-dvh items-center justify-center bg-theme-bg text-danger">
        Error: {error.message}
      </div>
    );
  }

  return (
    <AgentsPage
      activeThreadId={threadId}
      threadTitle={thread?.composer.name}
      turns={thread?.turns ?? []}
      composer={thread?.composer}
    />
  );
}
