import fs from "node:fs";
import path from "node:path";
import CopyGuideButton from "@/components/CopyGuideButton";

export const metadata = { title: "Guides — Hast Study" };

function readGuide(filename) {
  return fs.readFileSync(path.join(process.cwd(), filename), "utf8");
}

export default function GuidePage() {
  const contentGuideText = readGuide("CONTENT-GUIDE.md");
  const evaluationGuideText = readGuide("EVALUATION-GUIDE.md");

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Guides</h1>
      <p className="mt-2 text-foreground/60">
        Two different jobs, two different guides — copy whichever one matches what you&apos;re
        asking an AI to do.
      </p>

      <div className="mt-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Content Guide</h2>
            <p className="mt-1 text-sm text-foreground/60">
              For generating new study content. Copy this along with the subject/topic you want;
              save the output as a <code className="font-mono text-[0.85em]">.js</code> file and
              upload it from that subject&apos;s tab.
            </p>
          </div>
          <CopyGuideButton text={contentGuideText} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-foreground/10 bg-foreground/[.03] p-5 text-sm leading-relaxed">
          {contentGuideText}
        </pre>
      </div>

      <div className="mt-12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Evaluation Guide</h2>
            <p className="mt-1 text-sm text-foreground/60">
              For reviewing an exported set of questions and answers (Admin → Export selected).
              Copy this along with the exported JSON file; import the filled-in result back
              through Admin&apos;s Import evaluation file button.
            </p>
          </div>
          <CopyGuideButton text={evaluationGuideText} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-foreground/10 bg-foreground/[.03] p-5 text-sm leading-relaxed">
          {evaluationGuideText}
        </pre>
      </div>
    </section>
  );
}
