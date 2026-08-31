"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ClearEvaluationsButton from "@/components/ClearEvaluationsButton";

function batchKey(index) {
  return `batch:${index}`;
}

function entryKey(subject, setId, questionId) {
  return `entry:${subject}:${setId}:${questionId}`;
}

function parseKeys(keys) {
  const batchIndexes = [];
  const entries = [];
  for (const key of keys) {
    if (key.startsWith("batch:")) {
      batchIndexes.push(Number(key.slice("batch:".length)));
    } else if (key.startsWith("entry:")) {
      const [, subject, setId, questionId] = key.split(":");
      entries.push({ subject, setId, questionId });
    }
  }
  return { batchIndexes, entries };
}

export default function EvaluationsList({ batches, subjects }) {
  const [selected, setSelected] = useState(() => new Set());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const isEmpty = batches.length === 0 && subjects.length === 0;

  function toggle(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function performDelete(keys) {
    if (keys.length === 0) return;
    const label = keys.length === 1 ? "this note" : `${keys.length} notes`;
    if (!window.confirm(`Delete ${label}? This can't be undone.`)) return;

    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/import-evaluation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parseKeys(keys)),
      });
      if (!res.ok) throw new Error("Delete failed.");
      setSelected((prev) => {
        const next = new Set(prev);
        for (const key of keys) next.delete(key);
        return next;
      });
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  if (isEmpty) {
    return (
      <p className="text-sm text-foreground/60">
        Nothing imported yet. On Admin, select some files, Export selected, fill in the
        evaluation fields, and Import evaluation file to bring them back.
      </p>
    );
  }

  const selectedKeys = [...selected];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ClearEvaluationsButton />
      </div>

      {selectedKeys.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-700/30 bg-red-700/5 px-4 py-3">
          <p className="text-sm">{selectedKeys.length} selected</p>
          <button
            type="button"
            onClick={() => performDelete(selectedKeys)}
            disabled={pending}
            className="rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Delete selected"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="space-y-8">
        {batches.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Overall notes
            </h2>
            <div className="mt-3 space-y-3">
              {[...batches].reverse().map((batch) => {
                const key = batchKey(batch.index);
                return (
                  <div key={key} className="rounded-2xl border border-foreground/10 p-5">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => toggle(key)}
                        className="mt-1 h-5 w-5 shrink-0 accent-foreground"
                        aria-label="Select this overall note"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-foreground/40">
                            {new Date(batch.importedAt).toLocaleString("en-AU", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                          <button
                            type="button"
                            onClick={() => performDelete([key])}
                            disabled={pending}
                            className="shrink-0 rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                          {batch.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {subjects.map(({ subject, label, sets }) => (
          <div key={subject}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              {label}
            </h2>
            <div className="mt-3 space-y-4">
              {sets.map((set) => (
                <div key={set.setId} className="rounded-2xl border border-foreground/10 p-5">
                  <Link href={set.href} className="text-sm font-medium hover:underline">
                    {set.title}
                  </Link>

                  {set.setLevelEvaluation && (
                    <div className="mt-2 flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(entryKey(subject, set.setId, "_set"))}
                        onChange={() => toggle(entryKey(subject, set.setId, "_set"))}
                        className="mt-1 h-5 w-5 shrink-0 accent-foreground"
                        aria-label="Select this evaluation"
                      />
                      <p className="min-w-0 flex-1 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                        {set.setLevelEvaluation}
                      </p>
                      <button
                        type="button"
                        onClick={() => performDelete([entryKey(subject, set.setId, "_set")])}
                        disabled={pending}
                        className="shrink-0 rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {set.questionEntries.length > 0 && (
                    <ul className="mt-3 space-y-3">
                      {set.questionEntries.map((q) => {
                        const key = entryKey(subject, set.setId, q.questionId);
                        return (
                          <li key={q.questionId} className="border-t border-foreground/10 pt-3">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selected.has(key)}
                                onChange={() => toggle(key)}
                                className="mt-1 h-5 w-5 shrink-0 accent-foreground"
                                aria-label="Select this note"
                              />
                              <div className="min-w-0 flex-1 text-sm">
                                {q.prompt && <p className="text-foreground/50">{q.prompt}</p>}
                                <p className="mt-1 text-foreground/80">{q.evaluation}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => performDelete([key])}
                                disabled={pending}
                                className="shrink-0 rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
