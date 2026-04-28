"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [status, setStatus] = useState<unknown>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ error: "status_unavailable" }));
  }, []);

  return (
    <main className="container">
      <h1>Symphony Orchestrator</h1>
      <p>Spec-aligned MVP with workflow parsing, validation, scheduling, retries, and status visibility.</p>
      <section className="panel">
        <h2>Runtime</h2>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </section>
    </main>
  );
}
