import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "zod";
import type { RuntimeConfig, WorkflowDefinition } from "@/lib/types";

const schema = z.object({
  tracker: z
    .object({
      active_states: z.array(z.string()).default(["Todo", "In Progress"]),
      terminal_states: z.array(z.string()).default(["Closed", "Cancelled", "Canceled", "Duplicate", "Done"])
    })
    .default({ active_states: ["Todo", "In Progress"], terminal_states: ["Closed", "Cancelled", "Canceled", "Duplicate", "Done"] }),
  polling: z.object({ interval_ms: z.number().int().positive().default(30000) }).default({ interval_ms: 30000 }),
  agent: z
    .object({
      max_concurrent_agents: z.number().int().positive().default(10),
      max_retry_backoff_ms: z.number().int().positive().default(300000)
    })
    .default({ max_concurrent_agents: 10, max_retry_backoff_ms: 300000 })
});

export function loadWorkflow(filePath = path.resolve(process.cwd(), "WORKFLOW.md")): WorkflowDefinition {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");
  if (!lines[0]?.startsWith("---")) {
    return { config: {}, promptTemplate: raw.trim() };
  }

  const end = lines.findIndex((l, i) => i > 0 && l.startsWith("---"));
  if (end === -1) throw new Error("workflow_parse_error");
  const frontMatter = lines.slice(1, end).join("\n");
  const parsed = yaml.load(frontMatter);
  if (parsed && typeof parsed !== "object") throw new Error("workflow_front_matter_not_a_map");

  return {
    config: (parsed ?? {}) as Record<string, unknown>,
    promptTemplate: lines.slice(end + 1).join("\n").trim()
  };
}

export function toRuntimeConfig(def: WorkflowDefinition): RuntimeConfig {
  const parsed = schema.parse(def.config);
  return {
    activeStates: parsed.tracker.active_states.map((s) => s.toLowerCase()),
    terminalStates: parsed.tracker.terminal_states.map((s) => s.toLowerCase()),
    pollIntervalMs: parsed.polling.interval_ms,
    maxConcurrentAgents: parsed.agent.max_concurrent_agents,
    maxRetryBackoffMs: parsed.agent.max_retry_backoff_ms
  };
}
