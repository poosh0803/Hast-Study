import { NextResponse } from "next/server";
import { SUBJECTS } from "@/lib/content-manifest";
import { saveDraft } from "@/lib/progress-store";

export const runtime = "nodejs";

// Saving-only — clearing a draft reuses DELETE /api/progress (it removes
// the whole { answers/draft } record for a set, which is exactly "clear").
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const { subject, setId, text } = body || {};

  if (typeof subject !== "string" || !SUBJECTS[subject]) {
    return NextResponse.json({ error: "Unknown subject." }, { status: 400 });
  }
  if (typeof setId !== "string") {
    return NextResponse.json({ error: "Missing setId." }, { status: 400 });
  }
  if (typeof text !== "string") {
    return NextResponse.json({ error: "Missing text." }, { status: 400 });
  }

  const result = saveDraft({ subject, setId, text });
  return NextResponse.json({ ok: true, wordCount: result.draft.wordCount });
}
