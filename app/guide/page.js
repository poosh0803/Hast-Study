import fs from "node:fs";
import path from "node:path";
import CopyGuideButton from "@/components/CopyGuideButton";

export const metadata = { title: "Content Guide — Hast Study" };

export default function GuidePage() {
  const guideText = fs.readFileSync(path.join(process.cwd(), "CONTENT-GUIDE.md"), "utf8");

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Guide</h1>
          <p className="mt-2 text-foreground/60">
            The schema new study content needs to follow. Copy this, paste it into any AI chat
            along with what subject/topic you want, and it can write a ready-to-upload set. Save
            its output as a <code className="font-mono text-[0.85em]">.js</code> file and upload
            it from that subject&apos;s tab.
          </p>
        </div>
        <CopyGuideButton text={guideText} />
      </div>

      <pre className="mt-8 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-foreground/10 bg-foreground/[.03] p-5 text-sm leading-relaxed">
        {guideText}
      </pre>
    </section>
  );
}
