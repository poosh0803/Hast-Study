import ContentUploader from "@/components/ContentUploader";
import SetList from "@/components/SetList";
import { MATH_SETS } from "@/content/math/manifest";
import { getSubjectProgress } from "@/lib/progress-store";

export const metadata = { title: "Math — Hast Study" };

export default function MathPage() {
  const progress = getSubjectProgress("math");

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Math</h1>
          <p className="mt-2 text-foreground/60">Maths practice sets.</p>
        </div>
        <ContentUploader subject="math" />
      </div>

      <div className="mt-8">
        <SetList subject="Math" basePath="/math" items={MATH_SETS} progress={progress} />
      </div>
    </section>
  );
}
