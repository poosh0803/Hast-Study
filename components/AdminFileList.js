"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function keyOf(f) {
  return `${f.subject}/${f.filename}`;
}

export default function AdminFileList({ files }) {
  const [selected, setSelected] = useState(() => new Set());
  const [pending, setPending] = useState(() => new Set());
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const visibleFiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (f) => f.filename.toLowerCase().includes(q) || f.subject.toLowerCase().includes(q)
    );
  }, [files, query]);

  const bySubject = useMemo(
    () =>
      visibleFiles.reduce((acc, f) => {
        (acc[f.subject] ||= []).push(f);
        return acc;
      }, {}),
    [visibleFiles]
  );

  function toggle(f) {
    setSelected((prev) => {
      const next = new Set(prev);
      const key = keyOf(f);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleGroup(items, checked) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const f of items) {
        if (checked) next.add(keyOf(f));
        else next.delete(keyOf(f));
      }
      return next;
    });
  }

  async function performDelete(items) {
    if (items.length === 0) return;
    const label = items.length === 1 ? items[0].filename : `${items.length} files`;
    if (!window.confirm(`Remove ${label}? This can't be undone here.`)) return;

    const keys = items.map(keyOf);
    setPending((prev) => new Set([...prev, ...keys]));
    setError(null);
    try {
      const res = await fetch("/api/delete-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Remove failed.");

      const failed = (data.results || []).filter((r) => !r.ok);
      if (failed.length > 0) {
        setError(failed.map((r) => `${r.filename}: ${r.error}`).join("; "));
      }

      setSelected((prev) => {
        const next = new Set(prev);
        for (const key of keys) next.delete(key);
        return next;
      });
      setTimeout(() => router.refresh(), 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        for (const key of keys) next.delete(key);
        return next;
      });
    }
  }

  async function exportSelected(items) {
    if (items.length === 0) return;

    setExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((f) => ({ subject: f.subject, filename: f.filename })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Export failed.");
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : "hast-study-export.json";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  if (files.length === 0) {
    return <p className="text-sm text-foreground/60">No content files uploaded yet.</p>;
  }

  const selectedItems = files.filter((f) => selected.has(keyOf(f)));
  const bulkBusy = selectedItems.some((f) => pending.has(keyOf(f)));

  return (
    <div className="space-y-8">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search files by name or subject…"
        className="w-full rounded-xl border border-foreground/15 bg-transparent px-4 py-2 text-sm placeholder:text-foreground/40 focus:border-foreground/40 focus:outline-none"
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      {query.trim() && visibleFiles.length === 0 && (
        <p className="text-sm text-foreground/60">No files match &quot;{query.trim()}&quot;.</p>
      )}

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-700/30 bg-red-700/5 px-4 py-3">
          <p className="text-sm">{selectedItems.length} selected</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportSelected(selectedItems)}
              disabled={exporting}
              className="rounded-full border border-foreground/25 px-3 py-1 text-xs font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {exporting ? "Exporting…" : "Export selected"}
            </button>
            <button
              type="button"
              onClick={() => performDelete(selectedItems)}
              disabled={bulkBusy}
              className="rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
            >
              {bulkBusy ? "Removing…" : "Delete selected"}
            </button>
          </div>
        </div>
      )}

      {Object.entries(bySubject).map(([subject, items]) => {
        const allSelected = items.every((f) => selected.has(keyOf(f)));
        return (
          <section key={subject}>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => toggleGroup(items, e.target.checked)}
                className="h-5 w-5 accent-foreground"
              />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
                {subject}
              </h2>
            </label>
            <ul className="mt-3 divide-y divide-foreground/10 rounded-xl border border-foreground/10">
              {items.map((f) => {
                const key = keyOf(f);
                const busy = pending.has(key);
                return (
                  <li key={key} className="flex items-center gap-3 px-4 py-3">
                    <label className="flex flex-1 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => toggle(f)}
                        aria-label={`Select ${f.filename}`}
                        className="h-5 w-5 shrink-0 accent-foreground"
                      />
                      <span className="font-mono text-sm">{f.filename}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => performDelete([f])}
                      disabled={busy}
                      className="rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
                    >
                      {busy ? "Removing…" : "Remove"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
