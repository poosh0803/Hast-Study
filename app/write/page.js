import ContentUploader from "@/components/ContentUploader";
import SetList from "@/components/SetList";
import { WRITE_PROMPTS } from "@/content/write/manifest";
import { getSubjectProgress } from "@/lib/progress-store";

export const metadata = { title: "Write — Hast Study" };

export default function WritePage() {
  const progress = getSubjectProgress("write");

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Write</h1>
          <p className="mt-2 text-foreground/60">Timed writing prompts.</p>
        </div>
        <ContentUploader subject="write" />
      </div>

      <div className="mt-8">
        <SetList subject="Write" basePath="/write" items={WRITE_PROMPTS} progress={progress} />
      </div>
    </section>
  );
}
