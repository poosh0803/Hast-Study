"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function summarize(results) {
  const succeeded = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  if (failed.length === 0) {
    return { type: "ok", message: `Added ${succeeded.length} image${succeeded.length === 1 ? "" : "s"}.` };
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

export default function ImageUploader({ subjects }) {
  const inputRef = useRef(null);
  const [subject, setSubject] = useState(subjects[0]);
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

      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      setStatus(summarize(data.results));
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        aria-label="Subject to upload images into"
        className="rounded-full border border-foreground/25 bg-transparent px-3 py-1.5 text-sm capitalize"
      >
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-full border border-foreground/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50 disabled:hover:border-foreground/25 disabled:hover:bg-transparent disabled:hover:text-foreground"
      >
        {busy ? "Uploading…" : "Upload images"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      {status && (
        <p className={"text-sm " + (status.type === "error" ? "text-red-700" : "text-foreground/60")}>
          {status.message}
        </p>
      )}
    </div>
  );
}
