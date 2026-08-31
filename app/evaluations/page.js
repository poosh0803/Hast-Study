import { ABSTRACT_SETS } from "@/content/abstract/manifest";
import { MATH_SETS } from "@/content/math/manifest";
import { READ_SETS } from "@/content/read/manifest";
import { WRITE_PROMPTS } from "@/content/write/manifest";
import { getAllEvaluations } from "@/lib/evaluation-store";
import EvaluationsList from "@/components/EvaluationsList";

export const metadata = { title: "Evaluations — Hast Study" };

const SUBJECTS = {
  abstract: { label: "Abstract", basePath: "/abstract", sets: ABSTRACT_SETS },
  math: { label: "Math", basePath: "/math", sets: MATH_SETS },
  read: { label: "Read", basePath: "/read", sets: READ_SETS },
  write: { label: "Write", basePath: "/write", sets: WRITE_PROMPTS },
};

function findSet(subject, setId) {
  return SUBJECTS[subject]?.sets.find((s) => s.id === setId);
}

function findQuestion(set, questionId) {
  return set?.questions?.find((q) => q.id === questionId);
}

export default function EvaluationsPage() {
  const { batches, subjects } = getAllEvaluations();

  // Keep each batch's original array index — EvaluationsList needs it to
  // tell the delete API exactly which one(s) to remove, even though it
  // displays them newest-first (reversed).
  const preparedBatches = batches.map((batch, index) => ({ index, ...batch }));

  const preparedSubjects = Object.entries(subjects || {})
    .filter(([subject]) => SUBJECTS[subject])
    .map(([subject, sets]) => {
      const config = SUBJECTS[subject];
      return {
        subject,
        label: config.label,
        sets: Object.entries(sets).map(([setId, entries]) => {
          const set = findSet(subject, setId);
          const setLevel = entries._set;
          const questionEntries = Object.entries(entries)
            .filter(([key]) => key !== "_set")
            .map(([questionId, entry]) => ({
              questionId,
              prompt: findQuestion(set, questionId)?.prompt || null,
              evaluation: entry.evaluation,
            }));

          return {
            setId,
            title: set?.title || setId,
            href: `${config.basePath}/${setId}`,
            setLevelEvaluation: setLevel?.evaluation || null,
            questionEntries,
          };
        }),
      };
    });

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Evaluations</h1>
      <p className="mt-2 text-foreground/60">
        Feedback imported through Admin — an overall note per import, and specific notes on the
        question or piece they&apos;re about.
      </p>

      <div className="mt-8">
        <EvaluationsList batches={preparedBatches} subjects={preparedSubjects} />
      </div>
    </section>
  );
}
