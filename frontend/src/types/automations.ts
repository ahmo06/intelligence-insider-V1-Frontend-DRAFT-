export interface AutomationWorkflow {
  name: string;
  workflow: {
    model?: string;
    memoryEnabled?: boolean;
    prompts?: Array<{ prompt: string }>;
    triggers?: Array<Record<string, unknown>>;
    actions?: Array<Record<string, unknown>>;
    agentOptions?: Record<string, unknown>;
  };
  createdAt: string;
  updatedAt: string;
  automationId: string;
  scope: string;
  description?: string;
  templateId?: string;
}

export interface AutomationEntry {
  workflow: AutomationWorkflow;
  userId: number;
  ownerName: string;
}

export interface ListAutomationsResponse {
  workflows: AutomationEntry[];
}
