export type AgentType = "prospecting" | "engagement";
export type AgentStatus = "idle" | "running" | "queued" | "error";
export type RunStatus = "pending" | "running" | "completed" | "failed";

export interface AgentRun {
  id: string;
  agentType: AgentType;
  status: RunStatus;
  conversationId?: string | null;
  inputPayload?: unknown;
  outputPayload?: unknown;
  errorMessage?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
}

export interface AgentInfo {
  type: AgentType;
  name: string;
  description: string;
  status: AgentStatus;
  currentTask?: string;
  progress?: number;
  logLines?: string[];
}

export type WorkflowEvent =
  | { type: "step_start"; step: string; runId: string }
  | { type: "step_done"; step: string; runId: string; result?: unknown }
  | { type: "step_error"; step: string; runId: string; error: string }
  | { type: "progress"; step: string; message: string; runId: string }
  | { type: "done"; runId: string; output?: unknown };

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "queued" | "error";
  lastRun?: string;
  metrics?: Record<string, number>;
  config?: Record<string, string | number | boolean>;
}
