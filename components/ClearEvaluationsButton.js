"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearEvaluationsButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleClear() {
    if (!window.confirm("Clear every imported evaluation? This can't be undone.")) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/import-evaluation", { method: "DELETE" });
      if (!res.ok) throw new Error("Clear failed.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClear}
        disabled={busy}
        className="rounded-full border border-red-700/30 px-4 py-1.5 text-sm font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
      >
        {busy ? "Clearing…" : "Clear all evaluations"}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
