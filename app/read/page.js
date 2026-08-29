import EmptyState from "@/components/EmptyState";
import { READ_SETS } from "@/content/read/manifest";

export const metadata = { title: "Read — Hast Study" };

export default function ReadPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Read</h1>
      <p className="mt-2 text-foreground/60">Reading comprehension practice sets.</p>

      <div className="mt-8">
        {READ_SETS.length === 0 ? (
          <EmptyState subject="Read" />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {READ_SETS.map((set) => (
              <li key={set.id} className="rounded-xl border border-foreground/10 p-4">
                {set.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
