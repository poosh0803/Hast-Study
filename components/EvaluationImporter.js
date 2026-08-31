"use client";

import { useRef, useState } from "react";

export default function EvaluationImporter() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setStatus(null);
    try {
      const text = await file.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("That file isn't valid JSON.");
      }

      const res = await fetch("/api/import-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed.");

      const parts = [];
      if (data.questionCount > 0) {
        parts.push(`${data.questionCount} question note${data.questionCount === 1 ? "" : "s"}`);
      }
      if (data.overallSaved) parts.push("an overall evaluation");

      setStatus({
        type: parts.length ? "ok" : "error",
        message: parts.length
          ? `Imported ${parts.join(" and ")}.`
          : "Nothing to import — every evaluation field in that file was blank.",
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-full border border-foreground/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {busy ? "Importing…" : "Import evaluation file"}
      </button>
      <input ref={inputRef} type="file" accept=".json" onChange={handleChange} className="hidden" />
      {status && (
        <p
          className={
            "text-sm " + (status.type === "error" ? "text-red-700" : "text-foreground/60")
          }
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
