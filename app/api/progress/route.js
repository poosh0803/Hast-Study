import { NextResponse } from "next/server";
import { SUBJECTS } from "@/lib/content-manifest";
import { recordAnswer, resetSetProgress } from "@/lib/progress-store";

export const runtime = "nodejs";

function validSubject(subject) {
  return typeof subject === "string" && Object.prototype.hasOwnProperty.call(SUBJECTS, subject);
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const { subject, setId, questionId, chosen, correct } = body || {};

  if (!validSubject(subject)) {
    return NextResponse.json({ error: "Unknown subject." }, { status: 400 });
  }
  if (typeof setId !== "string" || typeof questionId !== "string") {
    return NextResponse.json({ error: "Missing setId or questionId." }, { status: 400 });
  }
  if (typeof chosen !== "number" || typeof correct !== "boolean") {
    return NextResponse.json({ error: "Missing chosen or correct." }, { status: 400 });
  }

  const progress = recordAnswer({ subject, setId, questionId, chosen, correct });
  return NextResponse.json({ ok: true, progress });
}

export async function DELETE(request) {
  const body = await request.json().catch(() => null);
  const { subject, setId } = body || {};

  if (!validSubject(subject)) {
    return NextResponse.json({ error: "Unknown subject." }, { status: 400 });
  }
  if (typeof setId !== "string") {
    return NextResponse.json({ error: "Missing setId." }, { status: 400 });
  }

  resetSetProgress(subject, setId);
  return NextResponse.json({ ok: true });
}
