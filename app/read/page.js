import ContentUploader from "@/components/ContentUploader";
import SetList from "@/components/SetList";
import { READ_SETS } from "@/content/read/manifest";
import { getSubjectProgress } from "@/lib/progress-store";

export const metadata = { title: "Read — Hast Study" };

export default function ReadPage() {
  const progress = getSubjectProgress("read");

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Read</h1>
          <p className="mt-2 text-foreground/60">Reading comprehension practice sets.</p>
        </div>
        <ContentUploader subject="read" />
      </div>

      <div className="mt-8">
        <SetList subject="Read" basePath="/read" items={READ_SETS} progress={progress} />
      </div>
    </section>
  );
}
