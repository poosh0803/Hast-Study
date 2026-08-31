import Link from "next/link";
import { ABSTRACT_SETS } from "@/content/abstract/manifest";
import { MATH_SETS } from "@/content/math/manifest";
import { READ_SETS } from "@/content/read/manifest";
import { WRITE_PROMPTS } from "@/content/write/manifest";
import { getAllEvaluations } from "@/lib/evaluation-store";

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
  const subjectEntries = Object.entries(subjects || {}).filter(([subject]) => SUBJECTS[subject]);
  const isEmpty = batches.length === 0 && subjectEntries.length === 0;

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Evaluations</h1>
      <p className="mt-2 text-foreground/60">
        Feedback imported through Admin — an overall note per import, and specific notes on the
        question or piece they&apos;re about.
      </p>

      {isEmpty ? (
        <p className="mt-8 text-sm text-foreground/60">
          Nothing imported yet. On Admin, select some files, Export selected, fill in the
          evaluation fields, and Import evaluation file to bring them back.
        </p>
      ) : (
        <>
          {batches.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
                Overall notes
              </h2>
              {[...batches].reverse().map((batch, i) => (
                <div key={i} className="rounded-2xl border border-foreground/10 p-5">
                  <p className="text-xs text-foreground/40">
                    {new Date(batch.importedAt).toLocaleString()}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{batch.text}</p>
                </div>
              ))}
            </div>
          )}

          {subjectEntries.map(([subject, sets]) => {
            const config = SUBJECTS[subject];
            return (
              <div key={subject} className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
                  {config.label}
                </h2>
                <div className="mt-3 space-y-4">
                  {Object.entries(sets).map(([setId, entries]) => {
                    const set = findSet(subject, setId);
                    const setLevel = entries._set;
                    const questionEntries = Object.entries(entries).filter(([k]) => k !== "_set");

                    return (
                      <div key={setId} className="rounded-2xl border border-foreground/10 p-5">
                        <Link
                          href={`${config.basePath}/${setId}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {set?.title || setId}
                        </Link>

                        {setLevel && (
                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                            {setLevel.evaluation}
                          </p>
                        )}

                        {questionEntries.length > 0 && (
                          <ul className="mt-3 space-y-3">
                            {questionEntries.map(([questionId, entry]) => {
                              const question = findQuestion(set, questionId);
                              return (
                                <li key={questionId} className="border-t border-foreground/10 pt-3 text-sm">
                                  {question?.prompt && (
                                    <p className="text-foreground/50">{question.prompt}</p>
                                  )}
                                  <p className="mt-1 text-foreground/80">{entry.evaluation}</p>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}
