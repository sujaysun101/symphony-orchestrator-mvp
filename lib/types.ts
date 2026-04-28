export type Issue = {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  priority: number | null;
  state: string;
  created_at: string | null;
};

export type WorkflowDefinition = {
  config: Record<string, unknown>;
  promptTemplate: string;
};

export type RuntimeConfig = {
  activeStates: string[];
  terminalStates: string[];
  pollIntervalMs: number;
  maxConcurrentAgents: number;
  maxRetryBackoffMs: number;
};

export type RuntimeState = {
  running: Record<string, { issue: Issue; startedAt: string; attempt: number | null }>;
  claimed: string[];
  retries: Record<string, { attempt: number; dueAtMs: number; error: string | null }>;
  lastTickAt: string | null;
};
