"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function keyOf(f) {
  return `${f.subject}/${f.filename}`;
}

export default function AdminImageList({ images }) {
  const [selected, setSelected] = useState(() => new Set());
  const [pending, setPending] = useState(() => new Set());
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const visibleImages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return images;
    return images.filter(
      (f) => f.filename.toLowerCase().includes(q) || f.subject.toLowerCase().includes(q)
    );
  }, [images, query]);

  const bySubject = useMemo(
    () =>
      visibleImages.reduce((acc, f) => {
        (acc[f.subject] ||= []).push(f);
        return acc;
      }, {}),
    [visibleImages]
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
    const label = items.length === 1 ? items[0].filename : `${items.length} images`;
    if (!window.confirm(`Remove ${label}? Any content still referencing it will show a broken image.`))
      return;

    const keys = items.map(keyOf);
    setPending((prev) => new Set([...prev, ...keys]));
    setError(null);
    try {
      const res = await fetch("/api/delete-image", {
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
      router.refresh();
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

  if (images.length === 0) {
    return <p className="text-sm text-foreground/60">No images uploaded yet.</p>;
  }

  const selectedItems = images.filter((f) => selected.has(keyOf(f)));
  const bulkBusy = selectedItems.some((f) => pending.has(keyOf(f)));

  return (
    <div className="space-y-8">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search images by name or subject…"
        className="w-full rounded-xl border border-foreground/15 bg-transparent px-4 py-2 text-sm placeholder:text-foreground/40 focus:border-foreground/40 focus:outline-none"
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      {query.trim() && visibleImages.length === 0 && (
        <p className="text-sm text-foreground/60">No images match &quot;{query.trim()}&quot;.</p>
      )}

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-700/30 bg-red-700/5 px-4 py-3">
          <p className="text-sm">{selectedItems.length} selected</p>
          <button
            type="button"
            onClick={() => performDelete(selectedItems)}
            disabled={bulkBusy}
            className="rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-background disabled:opacity-50"
          >
            {bulkBusy ? "Removing…" : "Delete selected"}
          </button>
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
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">{subject}</h2>
            </label>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((f) => {
                const key = keyOf(f);
                const busy = pending.has(key);
                return (
                  <li key={key} className="overflow-hidden rounded-xl border border-foreground/10">
                    <label className="flex cursor-pointer items-start gap-2 border-b border-foreground/10 p-2">
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => toggle(f)}
                        aria-label={`Select ${f.filename}`}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-foreground"
                      />
                      <span className="truncate font-mono text-xs" title={f.filename}>
                        {f.filename}
                      </span>
                    </label>
                    {/* eslint-disable-next-line @next/next/no-img-element -- runtime-uploaded thumbnail, not a build-time asset */}
                    <img src={f.url} alt={f.filename} className="h-24 w-full bg-foreground/5 object-cover" />
                    <button
                      type="button"
                      onClick={() => performDelete([f])}
                      disabled={busy}
                      className="w-full border-t border-foreground/10 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-700 hover:text-background disabled:opacity-50"
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
