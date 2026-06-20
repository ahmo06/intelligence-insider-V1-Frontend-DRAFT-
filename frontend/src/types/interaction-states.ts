import type { ThinkingBlockData } from "@/components/thread/ThinkingBlock";
import type { ToolCallCardData } from "@/components/thread/ToolCallCard";

export interface TurnFooterState {
  duration: string;
  isRunning: boolean;
  hiddenSteps?: number;
}

export interface InteractionStatesFixture {
  thinking: {
    running: ThinkingBlockData;
    doneCollapsed: ThinkingBlockData;
    doneExpanded: ThinkingBlockData;
  };
  toolCards: {
    expanded: ToolCallCardData;
    collapsed: ToolCallCardData;
    running: ToolCallCardData;
  };
  turnFooter: {
    working: TurnFooterState;
    worked: TurnFooterState;
  };
}
