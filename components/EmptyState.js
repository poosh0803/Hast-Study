export default function EmptyState({ subject }) {
  return (
    <div className="rounded-2xl border border-dashed border-foreground/15 px-6 py-16 text-center">
      <p className="text-base font-medium">No {subject} sets yet</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/60">
        Use Upload above to add one, or drop a file straight into{" "}
        <code className="rounded bg-foreground/[.06] px-1 py-0.5 font-mono text-[0.85em]">
          content/{subject.toLowerCase()}/
        </code>{" "}
        — either way this page picks it up automatically.
      </p>
    </div>
  );
}
