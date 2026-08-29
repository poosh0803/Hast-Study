import { NextResponse } from "next/server";
import { ABSTRACT_SETS } from "@/content/abstract/manifest";
import { MATH_SETS } from "@/content/math/manifest";
import { READ_SETS } from "@/content/read/manifest";
import { WRITE_PROMPTS } from "@/content/write/manifest";
import { getSubjectProgress } from "@/lib/progress-store";

export const runtime = "nodejs";

const SUBJECT_SETS = {
  abstract: ABSTRACT_SETS,
  math: MATH_SETS,
  read: READ_SETS,
  write: WRITE_PROMPTS,
};

// Merges each set's questions with Tristan's saved answer for that
// question (if any), so the export is self-contained: an AI reading it
// sees the question, the correct answer, and what was actually picked —
// no need to cross-reference content files against data/progress.json.
function buildSubjectExport(subject, sets) {
  const progress = getSubjectProgress(subject);

  return sets.map((item) => {
    const savedAnswers = progress[item.id]?.answers || {};
    if (!Array.isArray(item.questions)) return item;

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
        };
      }),
    };
  });
}

export async function GET() {
  const exportedAt = new Date().toISOString();

  const subjects = {};
  for (const [subject, sets] of Object.entries(SUBJECT_SETS)) {
    subjects[subject] = buildSubjectExport(subject, sets);
  }

  const payload = { exportedAt, subjects };
  const filename = `hast-study-export-${exportedAt.slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
