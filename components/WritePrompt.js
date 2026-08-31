"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function wordCount(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function WritePrompt({ prompt, subject, initialDraft, evaluation }) {
  const totalSeconds = (prompt.minutes || 25) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [text, setText] = useState(initialDraft?.text || "");
  const [status, setStatus] = useState(
    initialDraft?.text ? { type: "ok", message: `Loaded your saved draft · ${initialDraft.wordCount} words` } : null
  );
  const [clearing, setClearing] = useState(false);
  const saveTimer = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  async function saveDraft(value) {
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, setId: prompt.id, text: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "save failed");
      setStatus({ type: "ok", message: `Saved · ${data.wordCount} words` });
    } catch {
      setStatus({ type: "error", message: "Couldn't save — it'll retry on your next change." });
    }
  }

  function handleTextChange(event) {
    const value = event.target.value;
    setText(value);
    setStatus({ type: "saving", message: "Saving…" });
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(value), 1000);
  }

  function flushSave() {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
      saveDraft(text);
    }
  }

  async function clearDraft() {
    if (!window.confirm(`Clear your draft for "${prompt.title}"? This can't be undone here.`)) return;

    setClearing(true);
    try {
      const res = await fetch("/api/progress", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, setId: prompt.id }),
      });
      if (!res.ok) throw new Error("clear failed");
      setText("");
      setStatus(null);
      router.refresh();
    } catch {
      setStatus({ type: "error", message: "Couldn't clear on the server — try again." });
    } finally {
      setClearing(false);
    }
  }

  const timeUp = running === false && secondsLeft === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{prompt.title}</h1>
          {(prompt.kind || prompt.minutes) && (
            <p className="mt-1 text-sm text-foreground/50">
              {[prompt.kind, prompt.minutes ? `${prompt.minutes} min` : null].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className={
              "font-mono text-lg tabular-nums " + (timeUp ? "text-red-700" : "text-foreground")
            }
          >
            {formatTime(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            disabled={secondsLeft === 0}
            className="rounded-full border border-foreground/25 px-3 py-1 text-xs font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {running ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setSecondsLeft(totalSeconds);
            }}
            className="rounded-full border border-foreground/25 px-3 py-1 text-xs font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            Reset
          </button>
        </div>
      </div>

      {prompt.stimulus && prompt.stimulus !== prompt.title && (
        <p className="mt-4 rounded-2xl border border-foreground/10 p-5 text-sm leading-relaxed">
          {prompt.stimulus}
        </p>
      )}

      {Array.isArray(prompt.plan) && prompt.plan.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Plan</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/70">
            {prompt.plan.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {prompt.shape && (
        <p className="mt-4 text-sm text-foreground/70">
          <span className="font-medium text-foreground">Shape: </span>
          {prompt.shape}
        </p>
      )}

      {evaluation && (
        <div className="mt-4 rounded-lg bg-foreground/5 p-3 text-sm text-foreground/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Evaluation
          </p>
          <p className="mt-1 whitespace-pre-line">{evaluation}</p>
        </div>
      )}

      <div className="mt-6">
        <textarea
          value={text}
          onChange={handleTextChange}
          onBlur={flushSave}
          rows={16}
          placeholder="Write here…"
          className="w-full rounded-2xl border border-foreground/15 bg-transparent p-4 text-sm leading-relaxed focus:border-foreground/40 focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-foreground/50">{wordCount(text)} words</p>
          <div className="flex items-center gap-3">
            {status && (
              <p
                className={
                  "text-sm " + (status.type === "error" ? "text-red-700" : "text-foreground/50")
                }
              >
                {status.message}
              </p>
            )}
            {text && (
              <button
                type="button"
                onClick={clearDraft}
                disabled={clearing}
                className="rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
              >
                {clearing ? "Clearing…" : "Clear draft"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
