---
tracker:
  kind: linear
  active_states: ["Todo", "In Progress"]
  terminal_states: ["Done", "Closed", "Canceled", "Cancelled", "Duplicate"]
polling:
  interval_ms: 30000
agent:
  max_concurrent_agents: 10
  max_retry_backoff_ms: 300000
---

You are working on an issue from Linear.
