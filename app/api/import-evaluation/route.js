import { NextResponse } from "next/server";
import { SUBJECTS } from "@/lib/content-manifest";
import { importEvaluations, clearAllEvaluations } from "@/lib/evaluation-store";

export const runtime = "nodejs";

// Body is the export file itself (same shape /api/export produces), with
// `evaluation` fields filled in. Unknown subjects are dropped rather than
// rejecting the whole file — the export's own shape is trusted, but this
// still only accepts the subjects the app actually knows about.
export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || typeof body.subjects !== "object" || body.subjects === null) {
    return NextResponse.json({ error: "Not a valid evaluation export file." }, { status: 400 });
  }

  const subjects = {};
  for (const [subject, sets] of Object.entries(body.subjects)) {
    if (SUBJECTS[subject] && Array.isArray(sets)) {
      subjects[subject] = sets;
    }
  }

  const overallEvaluation = typeof body.evaluation === "string" ? body.evaluation.trim() : "";
  const { overallSaved, questionCount } = importEvaluations({ overallEvaluation, subjects });

  return NextResponse.json({ ok: true, overallSaved, questionCount });
}

// Clears every imported evaluation — all-or-nothing, see clearAllEvaluations().
export async function DELETE() {
  clearAllEvaluations();
  return NextResponse.json({ ok: true });
}
