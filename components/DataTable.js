// Soft background tints for highlighted cells (e.g. a colour-coded
// availability calendar) — named colours an AI can pick from directly,
// mapped to light-theme-appropriate Tailwind shades.
const CELL_COLORS = {
  red: "bg-red-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  blue: "bg-blue-100",
  pink: "bg-pink-100",
  purple: "bg-purple-100",
  gray: "bg-gray-200",
};

function Cell({ as: As, cell }) {
  if (cell && typeof cell === "object") {
    const colorClass = CELL_COLORS[cell.color] || "";
    return (
      <As className={`border border-foreground/10 px-3 py-2 text-sm ${colorClass}`}>
        {cell.text ?? ""}
      </As>
    );
  }
  return <As className="border border-foreground/10 px-3 py-2 text-sm">{cell ?? ""}</As>;
}

// A `table` field: { caption?, columns: string[], rows: Cell[][] } where a
// Cell is either a plain string/number or { text, color } for a
// highlighted cell (color is one of the CELL_COLORS keys above).
export default function DataTable({ table }) {
  if (!table) return null;
  const { caption, columns, rows } = table;

  return (
    <div className="rounded-2xl border border-foreground/10 p-5">
      {caption && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{caption}</p>
      )}
      <div className={"overflow-x-auto" + (caption ? " mt-2" : "")}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="border border-foreground/10 bg-foreground/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground/60"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <Cell key={ci} as="td" cell={cell} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
