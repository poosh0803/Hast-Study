import EmptyState from "@/components/EmptyState";
import { MATH_SETS } from "@/content/math/manifest";

export const metadata = { title: "Math — Hast Study" };

export default function MathPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Math</h1>
      <p className="mt-2 text-foreground/60">Maths practice sets.</p>

      <div className="mt-8">
        {MATH_SETS.length === 0 ? (
          <EmptyState subject="Math" />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {MATH_SETS.map((set) => (
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
