const LEVEL_HEIGHT = 64;
const LEAF_SPACING = 72;
const LEFT_PAD = 40;
const TOP_PAD = 64;
const SHAPE_SIZE = 30;

// Depth-first: every leaf gets the next integer x-slot; every internal
// node's x is the midpoint of its children's x — the same "balanced tree
// layout" approach used by, e.g., family-tree diagrams. Mutates nothing;
// returns a new positioned tree.
function assignPositions(node, depth, leafCounter) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  if (!hasChildren) {
    const x = leafCounter.value++;
    return { ...node, x, y: depth };
  }
  const children = node.children.map((child) => assignPositions(child, depth + 1, leafCounter));
  const xs = children.map((c) => c.x);
  const x = (Math.min(...xs) + Math.max(...xs)) / 2;
  return { ...node, x, y: depth, children };
}

// A node with children gets a horizontal "rod" halfway between its own
// level and its children's level, a vertical line down to that rod, and
// a vertical line from the rod down to each child.
function collectLines(node, lines) {
  if (!node.children) return;
  const rodY = node.y + 0.5;
  lines.push({ type: "v", x: node.x, y1: node.y, y2: rodY });
  const childXs = node.children.map((c) => c.x);
  lines.push({ type: "h", y: rodY, x1: Math.min(...childXs), x2: Math.max(...childXs) });
  for (const child of node.children) {
    lines.push({ type: "v", x: child.x, y1: rodY, y2: child.y });
    collectLines(child, lines);
  }
}

function collectShapes(node, shapes) {
  if (node.shape) shapes.push(node);
  if (node.children) for (const child of node.children) collectShapes(child, shapes);
}

function maxDepthOf(node) {
  if (!node.children) return node.y;
  return Math.max(...node.children.map(maxDepthOf));
}

function ShapeGlyph({ shape, color, x, y }) {
  const fill = color || "#888";
  const size = SHAPE_SIZE;
  switch (shape) {
    case "rect":
      return <rect x={x - size * 0.7} y={y - size * 0.4} width={size * 1.4} height={size * 0.8} fill={fill} />;
    case "square":
      return <rect x={x - size * 0.45} y={y - size * 0.45} width={size * 0.9} height={size * 0.9} fill={fill} />;
    case "oval":
      return <ellipse cx={x} cy={y} rx={size * 0.5} ry={size * 0.65} fill={fill} />;
    case "circle":
      return <circle cx={x} cy={y} r={size * 0.5} fill={fill} />;
    case "triangle": {
      const h = size * 0.9;
      return (
        <polygon
          points={`${x},${y - h * 0.6} ${x - h * 0.6},${y + h * 0.4} ${x + h * 0.6},${y + h * 0.4}`}
          fill={fill}
        />
      );
    }
    case "hexagon": {
      const r = size * 0.55;
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        return `${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`;
      }).join(" ");
      return <polygon points={points} fill={fill} />;
    }
    default:
      return <circle cx={x} cy={y} r={size * 0.5} fill={fill} />;
  }
}

// A `diagram` field: { caption?, totalMass?, massUnit?, root }. `root` (and
// every node under it) is { shape?, color?, label?, children? } — `shape`
// is one of rect/square/oval/circle/triangle/hexagon (omit for a plain
// junction where a rod just splits further with no weight of its own),
// `children` is the same shape recursively. The layout (spacing, rod
// lengths) is computed here — content only ever describes the tree.
export default function MobileDiagram({ diagram }) {
  if (!diagram?.root) return null;
  const { caption, totalMass, massUnit = "kg", root } = diagram;

  const counter = { value: 0 };
  const positioned = assignPositions(root, 0, counter);
  const leafCount = Math.max(1, counter.value);

  const lines = [];
  collectLines(positioned, lines);
  const shapes = [];
  collectShapes(positioned, shapes);

  const toPx = (x) => LEFT_PAD + x * LEAF_SPACING;
  const toPy = (y) => TOP_PAD + y * LEVEL_HEIGHT;

  const width = LEFT_PAD * 2 + (leafCount - 1) * LEAF_SPACING;
  const height = TOP_PAD + (maxDepthOf(positioned) + 0.5) * LEVEL_HEIGHT + SHAPE_SIZE;
  const rootPx = toPx(positioned.x);

  return (
    <div className="rounded-2xl border border-foreground/10 p-5">
      {caption && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{caption}</p>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={"mx-auto w-full max-w-md" + (caption ? " mt-2" : "")}
        role="img"
        aria-label={caption || "balance diagram"}
      >
        <line
          x1={rootPx}
          y1={10}
          x2={rootPx}
          y2={toPy(positioned.y)}
          stroke="currentColor"
          strokeOpacity={0.4}
        />
        <circle cx={rootPx} cy={7} r={4} fill="none" stroke="currentColor" strokeOpacity={0.6} />
        {totalMass != null && (
          <text x={rootPx + 10} y={11} fontSize="11" fill="currentColor" fillOpacity={0.7}>
            {totalMass} {massUnit}
          </text>
        )}

        {lines.map((line, i) =>
          line.type === "h" ? (
            <line
              key={i}
              x1={toPx(line.x1)}
              y1={toPy(line.y)}
              x2={toPx(line.x2)}
              y2={toPy(line.y)}
              stroke="currentColor"
              strokeOpacity={0.4}
            />
          ) : (
            <line
              key={i}
              x1={toPx(line.x)}
              y1={toPy(line.y1)}
              x2={toPx(line.x)}
              y2={toPy(line.y2)}
              stroke="currentColor"
              strokeOpacity={0.4}
            />
          )
        )}

        {shapes.map((s, i) => (
          <g key={i}>
            <ShapeGlyph shape={s.shape} color={s.color} x={toPx(s.x)} y={toPy(s.y)} />
            {s.label && (
              <text
                x={toPx(s.x)}
                y={toPy(s.y) + SHAPE_SIZE * 0.9}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                fillOpacity={0.6}
              >
                {s.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
