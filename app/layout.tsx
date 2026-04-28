import "./styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Symphony Orchestrator",
  description: "Spec-driven coding-agent orchestration service"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
