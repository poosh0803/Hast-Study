import ContentUploader from "@/components/ContentUploader";
import SetList from "@/components/SetList";
import { ABSTRACT_SETS } from "@/content/abstract/manifest";
import { getSubjectProgress } from "@/lib/progress-store";

export const metadata = { title: "Abstract — Hast Study" };

export default function AbstractPage() {
  const progress = getSubjectProgress("abstract");

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Abstract</h1>
          <p className="mt-2 text-foreground/60">Abstract reasoning practice sets.</p>
        </div>
        <ContentUploader subject="abstract" />
      </div>

      <div className="mt-8">
        <SetList subject="Abstract" basePath="/abstract" items={ABSTRACT_SETS} progress={progress} />
      </div>
    </section>
  );
}
