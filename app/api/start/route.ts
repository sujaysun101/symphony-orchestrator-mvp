import { NextResponse } from "next/server";
import { startOrchestrator, snapshot } from "@/lib/core/orchestrator";

export async function POST() {
  startOrchestrator();
  return NextResponse.json(snapshot());
}
