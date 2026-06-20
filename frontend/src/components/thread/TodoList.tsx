import type { TodoStatus } from "@/types/agent";
import { ProgressSpinner } from "@/components/ui/ProgressSpinner";

export interface TodoItemData {
  id: string;
  content: string;
  status: TodoStatus;
}

interface TodoListProps {
  items: TodoItemData[];
}

function TodoStatusIcon({ status }: { status: TodoStatus }) {
  if (status === "TODO_STATUS_IN_PROGRESS") {
    return <ProgressSpinner size={12} syncDelay={-120} />;
  }
  if (status === "TODO_STATUS_COMPLETED") {
    return (
      <svg
        className="h-3.5 w-3.5 text-success"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  return (
    <span className="inline-block h-3.5 w-3.5 rounded-full border border-tertiary" />
  );
}

export function TodoList({ items }: TodoListProps) {
  return (
    <div className="my-2 rounded-lg border border-tertiary">
      <div className="flex items-center gap-2 border-b border-tertiary px-3 py-2 text-sm text-secondary">
        <span>Todos</span>
        <span className="text-tertiary">{items.length}</span>
      </div>
      <ul className="ui-todo-list divide-y divide-tertiary">
        {items.map((item) => (
          <li
            key={item.id}
            id={`todo-${item.id}`}
            className="ui-todo-item flex items-start gap-2 px-3 py-2 text-sm"
          >
            <span className="mt-0.5 shrink-0">
              <TodoStatusIcon status={item.status} />
            </span>
            <span
              className={
                item.status === "TODO_STATUS_COMPLETED"
                  ? "text-tertiary line-through"
                  : "text-primary"
              }
            >
              {item.content}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
