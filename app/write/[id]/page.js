import Link from "next/link";
import { notFound } from "next/navigation";
import WritePrompt from "@/components/WritePrompt";
import PromptView from "@/components/PromptView";
import { WRITE_PROMPTS } from "@/content/write/manifest";
import { getSetProgress } from "@/lib/progress-store";
import { getSetEvaluations } from "@/lib/evaluation-store";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const prompt = WRITE_PROMPTS.find((p) => p.id === id);
  return { title: prompt ? `${prompt.title} — Hast Study` : "Not found — Hast Study" };
}

export default async function WritePromptPage({ params }) {
  const { id } = await params;
  const prompt = WRITE_PROMPTS.find((p) => p.id === id);
  if (!prompt) notFound();

  const progress = getSetProgress("write", id);
  const evaluations = getSetEvaluations("write", id);

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/write" className="text-sm text-foreground/50 hover:text-foreground">
        ← Back to Write
      </Link>
      <div className="mt-4">
        {prompt.stimulus || prompt.kind ? (
          <WritePrompt
            prompt={prompt}
            subject="write"
            initialDraft={progress?.draft}
            evaluation={evaluations._set?.evaluation}
          />
        ) : (
          <PromptView item={prompt} />
        )}
      </div>
    </section>
  );
}
