"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import DataChart from "@/components/DataChart";
import MobileDiagram from "@/components/MobileDiagram";
import FigureSvg from "@/components/FigureSvg";
import FigureImage from "@/components/FigureImage";

export default function QuizSet({ set, subject, initialAnswers, evaluations }) {
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    for (const [questionId, record] of Object.entries(initialAnswers || {})) {
      initial[questionId] = record.chosen;
    }
    return initial;
  });
  const [saveError, setSaveError] = useState(null);
  const [resetting, setResetting] = useState(false);
  const router = useRouter();

  const questions = set.questions || [];
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((q) => answers[q.id] === q.answer).length;

  async function choose(question, index) {
    if (answers[question.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [question.id]: index }));
    setSaveError(null);

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          setId: set.id,
          questionId: question.id,
          chosen: index,
          correct: index === question.answer,
        }),
      });
      if (!res.ok) throw new Error("save failed");
    } catch {
      setSaveError("Couldn't save that answer to the server — it'll still show for this visit.");
    }
  }

  async function resetAttempt() {
    if (!window.confirm(`Reset "${set.title}"? Your saved answers for it will be cleared.`)) return;

    setResetting(true);
    try {
      const res = await fetch("/api/progress", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, setId: set.id }),
      });
      if (!res.ok) throw new Error("reset failed");
      setAnswers({});
      router.refresh();
    } catch {
      setSaveError("Couldn't reset on the server — try again.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{set.title}</h1>
          {(set.topic || set.timeMinutes) && (
            <p className="mt-1 text-sm text-foreground/50">
              {[set.topic, set.timeMinutes ? `${set.timeMinutes} min` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        {questions.length > 0 && (
          <div className="flex items-center gap-3">
            <p className="whitespace-nowrap text-sm text-foreground/60">
              {correctCount} / {answeredCount} correct
              {answeredCount < questions.length ? ` · ${questions.length - answeredCount} left` : ""}
            </p>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={resetAttempt}
                disabled={resetting}
                className="rounded-full border border-foreground/20 px-3 py-1 text-xs font-medium text-foreground/60 transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
              >
                {resetting ? "Resetting…" : "Reset"}
              </button>
            )}
          </div>
        )}
      </div>
      {saveError && <p className="mt-2 text-sm text-red-700">{saveError}</p>}

      {set.description && <p className="mt-4 text-sm text-foreground/70">{set.description}</p>}

      {Array.isArray(set.passages) && set.passages.length > 0 && (
        <div className="mt-6 space-y-4">
          {set.passages.map((passage, pi) => (
            <div key={passage.label ?? pi} className="rounded-2xl border border-foreground/10 p-5">
              {passage.label && (
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  {passage.label}
                </p>
              )}
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{passage.text}</p>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(set.tables) && set.tables.length > 0 && (
        <div className="mt-6 space-y-4">
          {set.tables.map((table, ti) => (
            <DataTable key={table.caption ?? ti} table={table} />
          ))}
        </div>
      )}

      {Array.isArray(set.charts) && set.charts.length > 0 && (
        <div className="mt-6 space-y-4">
          {set.charts.map((chart, ci) => (
            <DataChart key={chart.caption ?? ci} chart={chart} />
          ))}
        </div>
      )}

      {Array.isArray(set.diagrams) && set.diagrams.length > 0 && (
        <div className="mt-6 space-y-4">
          {set.diagrams.map((diagram, di) => (
            <MobileDiagram key={diagram.caption ?? di} diagram={diagram} />
          ))}
        </div>
      )}

      {Array.isArray(set.figures) && set.figures.length > 0 && (
        <div className="mt-6 space-y-4">
          {set.figures.map((figure, fi) => (
            <FigureSvg key={figure.caption ?? fi} figure={figure} />
          ))}
        </div>
      )}

      {Array.isArray(set.images) && set.images.length > 0 && (
        <div className="mt-6 space-y-4">
          {set.images.map((image, ii) => (
            <FigureImage key={image.src ?? ii} image={image} subject={subject} />
          ))}
        </div>
      )}

      <ol className="mt-8 space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[q.id];
          const answered = chosen !== undefined;

          return (
            <li key={q.id} className="rounded-2xl border border-foreground/10 p-5">
              <p className="font-medium">
                {qi + 1}. {q.prompt}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {q.choices.map((choice, ci) => {
                  const isChosen = chosen === ci;
                  const isCorrect = ci === q.answer;

                  let style = "border-foreground/15 hover:border-foreground/30";
                  if (answered && isCorrect) style = "border-green-700 bg-green-700/10";
                  else if (answered && isChosen && !isCorrect) style = "border-red-700 bg-red-700/10";

                  return (
                    <button
                      key={ci}
                      type="button"
                      onClick={() => choose(q, ci)}
                      disabled={answered}
                      className={
                        "rounded-xl border px-4 py-2 text-left text-sm transition-colors disabled:cursor-default " +
                        style
                      }
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {answered && q.explanation && (
                <p className="mt-3 text-sm text-foreground/60">{q.explanation}</p>
              )}
              {answered && evaluations?.[q.id]?.evaluation && (
                <div className="mt-3 rounded-lg bg-foreground/5 p-3 text-sm text-foreground/80">
                  <span className="font-medium text-foreground">Evaluation: </span>
                  {evaluations[q.id].evaluation}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
