"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/abstract", label: "Abstract" },
  { href: "/math", label: "Math" },
  { href: "/read", label: "Read" },
  { href: "/write", label: "Write" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-foreground/10">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Hast Study
        </Link>
        <nav className="flex flex-wrap gap-1">
          {TABS.map((tab) => {
            const active =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground")
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/admin"
          aria-current={pathname === "/admin" ? "page" : undefined}
          className={
            "ml-auto rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
            (pathname === "/admin"
              ? "bg-foreground text-background"
              : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground")
          }
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
