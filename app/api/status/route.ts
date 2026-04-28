import { NextResponse } from "next/server";
import { snapshot } from "@/lib/core/orchestrator";

export async function GET() {
  return NextResponse.json(snapshot());
}
