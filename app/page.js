import Link from "next/link";

const SECTIONS = [
  { href: "/abstract", label: "Abstract", blurb: "Abstract reasoning practice sets." },
  { href: "/math", label: "Math", blurb: "Maths practice sets." },
  { href: "/read", label: "Read", blurb: "Reading comprehension practice sets." },
  { href: "/write", label: "Write", blurb: "Timed writing prompts." },
];

export default function Home() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Hast Study</h1>
      <p className="mt-2 text-foreground/60">
        Tristan&apos;s study space. Pick a section below — content gets added over time as
        drop-in files, no rebuild of the site required.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-2xl border border-foreground/10 p-5 transition-colors hover:border-foreground/25"
          >
            <p className="text-lg font-medium">{s.label}</p>
            <p className="mt-1 text-sm text-foreground/60">{s.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
