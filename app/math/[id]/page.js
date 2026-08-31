import Link from "next/link";
import { notFound } from "next/navigation";
import QuizSet from "@/components/QuizSet";
import PromptView from "@/components/PromptView";
import { MATH_SETS } from "@/content/math/manifest";
import { getSetProgress } from "@/lib/progress-store";
import { getSetEvaluations } from "@/lib/evaluation-store";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const set = MATH_SETS.find((s) => s.id === id);
  return { title: set ? `${set.title} — Hast Study` : "Not found — Hast Study" };
}

export default async function MathSetPage({ params }) {
  const { id } = await params;
  const set = MATH_SETS.find((s) => s.id === id);
  if (!set) notFound();

  const progress = getSetProgress("math", id);
  const evaluations = getSetEvaluations("math", id);

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/math" className="text-sm text-foreground/50 hover:text-foreground">
        ← Back to Math
      </Link>
      <div className="mt-4">
        {set.questions ? (
          <QuizSet
            set={set}
            subject="math"
            initialAnswers={progress?.answers}
            evaluations={evaluations}
          />
        ) : (
          <PromptView item={set} />
        )}
      </div>
    </section>
  );
}
