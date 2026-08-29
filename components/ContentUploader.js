"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function summarize(results) {
  const succeeded = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  if (failed.length === 0) {
    return { type: "ok", message: `Added ${succeeded.length} file${succeeded.length === 1 ? "" : "s"}.` };
  }

  const failText = failed.map((f) => `${f.filename}: ${f.error}`).join("; ");
  if (succeeded.length === 0) {
    return { type: "error", message: failText };
  }
  return {
    type: "error",
    message: `Added ${succeeded.length}, ${failed.length} failed — ${failText}`,
  };
}

export default function ContentUploader({ subject }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setBusy(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      for (const file of files) {
        formData.append("file", file);
      }

      const res = await fetch("/api/upload-content", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      setStatus(summarize(data.results));
      // The dev server needs a moment to pick up the regenerated manifest
      // and recompile before a refresh will see the new content.
      setTimeout(() => router.refresh(), 300);
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
        className="rounded-full border border-foreground/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50 disabled:hover:border-foreground/25 disabled:hover:bg-transparent disabled:hover:text-foreground"
      >
        {busy ? "Uploading…" : "Upload content files"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".js"
        multiple
        onChange={handleChange}
        className="hidden"
      />
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
