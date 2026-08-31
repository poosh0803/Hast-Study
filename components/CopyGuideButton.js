"use client";

import { useState } from "react";

export default function CopyGuideButton({ text }) {
  const [status, setStatus] = useState(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-foreground/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
      >
        {status === "copied" ? "Copied!" : "Copy guide"}
      </button>
      {status === "failed" && (
        <p className="text-sm text-red-700">
          Couldn&apos;t copy automatically — select the text below and copy it by hand.
        </p>
      )}
    </div>
  );
}
