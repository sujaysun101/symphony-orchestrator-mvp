import { fetchCandidateIssues } from "@/lib/adapters/mock-tracker";
import { loadWorkflow, toRuntimeConfig } from "@/lib/core/workflow";
import type { RuntimeState } from "@/lib/types";

const state: RuntimeState = {
  running: {},
  claimed: [],
  retries: {},
  lastTickAt: null
};

let started = false;
let timer: NodeJS.Timeout | null = null;

function shouldDispatch(issueId: string): boolean {
  return !state.claimed.includes(issueId);
}

function scheduleRetry(issueId: string, attempt: number, maxBackoffMs: number, error: string | null) {
  const delay = Math.min(10000 * 2 ** Math.max(0, attempt - 1), maxBackoffMs);
  state.retries[issueId] = { attempt, dueAtMs: Date.now() + delay, error };
  if (!state.claimed.includes(issueId)) state.claimed.push(issueId);
}

function dispatch(issue: Awaited<ReturnType<typeof fetchCandidateIssues>>[number]) {
  state.running[issue.id] = { issue, startedAt: new Date().toISOString(), attempt: null };
  if (!state.claimed.includes(issue.id)) state.claimed.push(issue.id);
}

async function tick() {
  const wf = loadWorkflow();
  const cfg = toRuntimeConfig(wf);
  state.lastTickAt = new Date().toISOString();

  const issues = await fetchCandidateIssues(cfg.activeStates);
  const slots = cfg.maxConcurrentAgents - Object.keys(state.running).length;
  for (const issue of issues.slice(0, Math.max(slots, 0))) {
    if (shouldDispatch(issue.id)) dispatch(issue);
  }

  for (const [issueId, entry] of Object.entries(state.running)) {
    if (Date.now() - new Date(entry.startedAt).getTime() > 15000) {
      delete state.running[issueId];
      scheduleRetry(issueId, 1, cfg.maxRetryBackoffMs, null);
    }
  }
}

export function startOrchestrator() {
  if (started) return;
  started = true;
  const cfg = toRuntimeConfig(loadWorkflow());
  timer = setInterval(() => {
    void tick();
  }, cfg.pollIntervalMs);
  void tick();
}

export function stopOrchestrator() {
  if (timer) clearInterval(timer);
  timer = null;
  started = false;
}

export function snapshot() {
  return { started, state };
}
