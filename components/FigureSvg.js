const SCRIPT_TAG_RE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const EVENT_ATTR_RE = /\s+on[a-z]+\s*=\s*"[^"]*"/gi;
const EVENT_ATTR_RE2 = /\s+on[a-z]+\s*=\s*'[^']*'/gi;

// Content files are author-controlled — same trust level as any other
// uploaded content file (see lib/content-manifest.js's loadFileDefaultExport
// comment) — but this is the one field that renders raw markup instead of
// data, so strip the obvious injection vectors as a defense-in-depth net
// rather than trusting that blindly.
function sanitize(svg) {
  return svg.replace(SCRIPT_TAG_RE, "").replace(EVENT_ATTR_RE, "").replace(EVENT_ATTR_RE2, "");
}

// A `figures` entry: { caption?, svg } — raw hand-authored SVG markup, for a
// figure that doesn't fit the tables/charts/diagrams data shapes (see
// CONTENT-GUIDE.md "figures"). Deliberately the one place in this app a
// content file is allowed to contain markup instead of plain data.
export default function FigureSvg({ figure }) {
  if (!figure?.svg) return null;
  const clean = sanitize(figure.svg);
  return (
    <div className="rounded-2xl border border-foreground/10 p-5">
      {figure.caption && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{figure.caption}</p>
      )}
      <div
        className={"mx-auto max-w-md [&>svg]:h-auto [&>svg]:w-full" + (figure.caption ? " mt-2" : "")}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </div>
  );
}
