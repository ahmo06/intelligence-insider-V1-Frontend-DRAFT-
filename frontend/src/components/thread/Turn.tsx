import type { ThreadTurnFixture } from "@/types";
import { HumanMessageCard } from "./HumanMessageCard";
import { AssistantContent } from "./AssistantContent";
import { TurnFooter } from "./TurnFooter";
import { ThinkingBlock } from "./ThinkingBlock";
import { ToolCallCard } from "./ToolCallCard";

interface TurnProps {
  turn: ThreadTurnFixture;
}

export function Turn({ turn }: TurnProps) {
  return (
    <div data-agent-turn={turn.index} className="w-full">
      <div aria-hidden="true" className="-mb-px h-px overflow-hidden" />
      <div
        className="sticky top-0 z-30 mb-3 bg-chrome"
        data-agent-turn-human={turn.index}
      >
        <div className="h-0 w-full bg-chrome" />
        <div className="flex flex-col gap-1">
          <HumanMessageCard
            message={turn.humanMessage}
            collapsed={turn.humanMessage.length > 200}
          />
        </div>
      </div>

      <div className="mb-4">
        {turn.thinking && <ThinkingBlock {...turn.thinking} />}
        {turn.toolCalls?.map((tool, i) => (
          <ToolCallCard key={i} {...tool} />
        ))}
        <AssistantContent html={turn.assistantHtml} />
      </div>

      {turn.workedFor && (
        <div className="mb-6">
          <TurnFooter duration={turn.workedFor} isRunning={turn.isWorking} />
        </div>
      )}

      <div data-agent-turn-end={turn.index} />
    </div>
  );
}
