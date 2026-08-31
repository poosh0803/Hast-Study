import AdminFileList from "@/components/AdminFileList";
import AdminImageList from "@/components/AdminImageList";
import ImageUploader from "@/components/ImageUploader";
import EvaluationImporter from "@/components/EvaluationImporter";
import { listContentFiles, SUBJECTS } from "@/lib/content-manifest";
import { listContentImages } from "@/lib/content-images";

export const metadata = { title: "Admin — Hast Study" };

export default function AdminPage() {
  const files = listContentFiles();
  const images = listContentImages();

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

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Images</h2>
          <p className="mt-1 text-sm text-foreground/60">
            Real picture files a content set&apos;s{" "}
            <code className="font-mono text-[0.85em]">images</code> field can reference by
            filename (see the Content Guide&apos;s &quot;images&quot; section) — upload one
            here, then use its exact filename in the content file.
          </p>
        </div>
        <ImageUploader subjects={Object.keys(SUBJECTS)} />
      </div>

      <div className="mt-6">
        <AdminImageList images={images} />
      </div>
    </section>
  );
}
