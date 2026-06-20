"use client";

import { useCallback } from "react";
import { getData } from "@/lib/data/dataProvider";
import type { InteractionStatesFixture } from "@/types/interaction-states";
import { useApiQuery } from "./useApiQuery";

export function useInteractionStates() {
  const queryFn = useCallback(
    () =>
      getData<InteractionStatesFixture>(
        "background-composer/interaction-states",
      ),
    [],
  );

  return useApiQuery<InteractionStatesFixture | null>(queryFn, null, [queryFn]);
}
