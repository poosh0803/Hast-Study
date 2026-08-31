import { NextResponse } from "next/server";
import { SUBJECTS, loadFileDefaultExport } from "@/lib/content-manifest";
import { getSubjectProgress } from "@/lib/progress-store";

export const runtime = "nodejs";

// Merges one set with its saved answers (or, for a Write prompt with no
// `questions`, its saved draft) and adds a blank `evaluation` slot — the
// file is meant to be handed to an AI or a human, who fills those in and
// hands the modified file back through Admin's Import evaluation file
// button. A quiz set gets `evaluation` per question; a Write prompt gets
// one `evaluation` for the whole piece, next to its `draft`.
function mergeSetWithProgress(item, progress) {
  const itemProgress = progress[item.id];

  if (!Array.isArray(item.questions)) {
    return {
      ...item,
      draft: itemProgress?.draft || null,
      evaluation: "",
    };
  }

  const savedAnswers = itemProgress?.answers || {};
  return {
    ...item,
    questions: item.questions.map((q) => {
      const saved = savedAnswers[q.id];
      return {
        ...q,
        yourAnswer: saved
          ? {
              chosenIndex: saved.chosen,
              chosenText: q.choices?.[saved.chosen] ?? null,
              correct: saved.correct,
              answeredAt: saved.answeredAt,
            }
          : null,
        evaluation: "",
      };
    }),
  };
}

// Body: { items: [{ subject, filename }, ...] } — the same selection
// shape as app/api/delete-content/route.js, so Admin's checkboxes drive
// both. Only the selected files are exported, not every set in a subject.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : [];

  if (items.length === 0) {
    return NextResponse.json({ error: "No files selected." }, { status: 400 });
  }

  const subjects = {};
  const progressCache = {};

  for (const item of items) {
    const subject = item?.subject;
    const filename = item?.filename;
    if (typeof subject !== "string" || !SUBJECTS[subject]) continue;
    if (typeof filename !== "string") continue;

    let sets;
    try {
      sets = loadFileDefaultExport(subject, filename);
    } catch {
      continue; // skip an unreadable file rather than fail the whole export
    }

    if (!progressCache[subject]) progressCache[subject] = getSubjectProgress(subject);
    if (!subjects[subject]) subjects[subject] = [];

    for (const set of sets) {
      subjects[subject].push(mergeSetWithProgress(set, progressCache[subject]));
    }
  }

  const exportedAt = new Date().toISOString();
  const payload = { exportedAt, evaluation: "", subjects };
  const filename = `hast-study-export-${exportedAt.slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
