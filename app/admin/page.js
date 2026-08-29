import AdminFileList from "@/components/AdminFileList";
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
            Remove uploaded content files. Removing a file also drops it from that subject&apos;s
            manifest.
          </p>
        </div>
        <a
          href="/api/export"
          className="rounded-full border border-foreground/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          Export questions &amp; answers
        </a>
      </div>

      <div className="mt-8">
        <AdminFileList files={files} />
      </div>
    </section>
  );
}
