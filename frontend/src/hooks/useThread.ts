"use client";

import { useCallback } from "react";
import { getData } from "@/lib/data/dataProvider";
import type {
  DetailedComposerResponse,
  ListArtifactsResponse,
  ThreadData,
  ThreadTurnsResponse,
} from "@/types";
import { useApiQuery } from "./useApiQuery";

const PORTAL_THREAD_ID = "bc-773361b1-8875-4853-80fb-1540cd28b9ca";

interface UseThreadResult {
  thread: ThreadData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useThread(threadId: string): UseThreadResult {
  const queryFn = useCallback(async () => {
    if (!threadId) return null;

    const [detailed, artifacts] = await Promise.all([
      getData<DetailedComposerResponse>(
        "background-composer/get-detailed-composer",
      ),
      getData<ListArtifactsResponse>("background-composer/list-artifacts"),
    ]);

    const entry =
      detailed.composers.find((c) => c.composer.bcId === threadId) ??
      detailed.composers[0];

    if (!entry) return null;

    let turns: ThreadData["turns"] = [];
    if (threadId === PORTAL_THREAD_ID) {
      const turnsFixture = await getData<ThreadTurnsResponse>(
        "background-composer/thread-turns-portal",
      );
      turns = turnsFixture.turns;
    } else if (entry.originalConversationAction?.userMessageAction?.userMessage) {
      const msg =
        entry.originalConversationAction.userMessageAction.userMessage;
      turns = [
        {
          index: 0,
          humanMessage: msg.text,
          assistantHtml: "",
          workedFor: null,
          isWorking: entry.status === "BACKGROUND_COMPOSER_STATUS_RUNNING",
        },
      ];
    }

    return {
      composer: entry.composer,
      participants: detailed.participants,
      turns,
      artifacts: artifacts.artifacts ?? [],
    };
  }, [threadId]);

  const { data, isLoading, error, refetch } = useApiQuery<ThreadData | null>(
    queryFn,
    null,
    [queryFn, threadId],
  );

  return { thread: data, isLoading, error, refetch };
}
