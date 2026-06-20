export type AgentStatus =
  | "running"
  | "finished"
  | "failed"
  | "cancelled"
  | "pending";

export type TodoStatus =
  | "TODO_STATUS_UNSPECIFIED"
  | "TODO_STATUS_PENDING"
  | "TODO_STATUS_IN_PROGRESS"
  | "TODO_STATUS_COMPLETED"
  | "TODO_STATUS_CANCELLED";

export interface AgentThread {
  id: string;
  title: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
  branch?: string;
  repo?: string;
}

export interface AgentTurn {
  id: string;
  role: "human" | "assistant";
  content?: string;
  workedForMs?: number;
  isRunning?: boolean;
}

export interface TodoItem {
  id: string;
  content: string;
  status: TodoStatus;
}
