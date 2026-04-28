import type { Issue } from "@/lib/types";

const issues: Issue[] = [
  {
    id: "1",
    identifier: "SYM-1",
    title: "Bootstrap orchestrator",
    description: null,
    priority: 1,
    state: "Todo",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    identifier: "SYM-2",
    title: "Add status visibility",
    description: null,
    priority: 2,
    state: "In Progress",
    created_at: new Date().toISOString()
  }
];

export async function fetchCandidateIssues(activeStates: string[]): Promise<Issue[]> {
  return issues.filter((i) => activeStates.includes(i.state.toLowerCase()));
}
