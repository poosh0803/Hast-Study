import AdminFileList from "@/components/AdminFileList";
import EvaluationImporter from "@/components/EvaluationImporter";
import { listContentFiles } from "@/lib/content-manifest";

export const metadata = { title: "Admin — Hast Study" };

export default function AdminPage() {
  const files = listContentFiles();

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-2 text-foreground/60">
            Remove uploaded content files, or select some and export just those — the file
            comes with a blank evaluation field per question for an AI or human to fill in
            and hand back through Import.
          </p>
        </div>
        <EvaluationImporter />
      </div>

      <div className="mt-8">
        <AdminFileList files={files} />
      </div>
    </section>
  );
}
