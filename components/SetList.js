import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import { groupByWeek } from "@/lib/group-by-week";

function progressLabel(item, progress) {
  const total = item.questions?.length ?? 0;
  if (total === 0) return null;

  const itemProgress = progress?.[item.id];
  const answers = itemProgress?.answers || {};
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter((a) => a.correct).length;

  if (answered === 0) return "Not started";
  if (answered < total) return `${correct} / ${answered} correct · in progress`;
  return `${correct} / ${total} correct`;
}

export default function SetList({ subject, basePath, items, progress }) {
  if (items.length === 0) {
    return <EmptyState subject={subject} />;
  }

  const groups = groupByWeek(items);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.week ?? "unsorted"}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
            {group.week !== null
              ? `Week ${group.week}${group.weekTitle ? ` — ${group.weekTitle}` : ""}`
              : "Unsorted"}
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => {
              const label = progressLabel(item, progress);
              return (
                <li key={item.id}>
                  <Link
                    href={`${basePath}/${item.id}`}
                    className="block rounded-xl border border-foreground/10 p-4 transition-colors hover:border-foreground/25"
                  >
                    <span>{item.title}</span>
                    {label && <span className="mt-1 block text-xs text-foreground/50">{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
