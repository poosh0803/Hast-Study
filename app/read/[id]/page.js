import Link from "next/link";
import { notFound } from "next/navigation";
import QuizSet from "@/components/QuizSet";
import PromptView from "@/components/PromptView";
import { READ_SETS } from "@/content/read/manifest";
import { getSetProgress } from "@/lib/progress-store";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const set = READ_SETS.find((s) => s.id === id);
  return { title: set ? `${set.title} — Hast Study` : "Not found — Hast Study" };
}

export default async function ReadSetPage({ params }) {
  const { id } = await params;
  const set = READ_SETS.find((s) => s.id === id);
  if (!set) notFound();

  const progress = getSetProgress("read", id);

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/read" className="text-sm text-foreground/50 hover:text-foreground">
        ← Back to Read
      </Link>
      <div className="mt-4">
        {set.questions ? (
          <QuizSet set={set} subject="read" initialAnswers={progress?.answers} />
        ) : (
          <PromptView item={set} />
        )}
      </div>
    </section>
  );
}
