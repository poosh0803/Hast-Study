import EmptyState from "@/components/EmptyState";
import { WRITE_PROMPTS } from "@/content/write/manifest";

export const metadata = { title: "Write — Hast Study" };

export default function WritePage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Write</h1>
      <p className="mt-2 text-foreground/60">Timed writing prompts.</p>

      <div className="mt-8">
        {WRITE_PROMPTS.length === 0 ? (
          <EmptyState subject="Write" />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {WRITE_PROMPTS.map((prompt) => (
              <li key={prompt.id} className="rounded-xl border border-foreground/10 p-4">
                {prompt.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
