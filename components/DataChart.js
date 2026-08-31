"use client";

import { useState } from "react";

const WIDTH = 640;
const HEIGHT = 320;
const PAD = { top: 16, right: 16, bottom: 36, left: 44 };

function niceMaxOf(series) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / magnitude) * magnitude;
}

function Tooltip({ hovered }) {
  if (!hovered) return null;
  const width = Math.max(40, hovered.text.length * 6.5 + 14);
  const height = 22;
  const x = Math.min(Math.max(hovered.x - width / 2, 4), WIDTH - width - 4);
  const y = Math.max(hovered.y - 14 - height, 4);
  return (
    <g pointerEvents="none">
      <rect x={x} y={y} width={width} height={height} rx={5} fill="#1f2937" opacity={0.92} />
      <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fontSize="11" fill="#fff">
        {hovered.text}
      </text>
    </g>
  );
}

// A `chart` field: { type: "bar"|"line", caption?, categories: string[],
// series: [{ name, color?, values: number[] }] } — values line up
// index-for-index with categories. `color` is any valid CSS colour
// (a hex code, or a keyword like "blue"/"green"/etc — SVG understands
// those directly, no lookup table needed here unlike DataTable's classes).
export default function DataChart({ chart }) {
  const [hovered, setHovered] = useState(null);
  if (!chart) return null;
  const { type = "bar", caption, categories, series } = chart;

  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const maxValue = niceMaxOf(series);
  const categoryWidth = innerWidth / categories.length;

  const px = (categoryIndex, offset = 0.5) => PAD.left + categoryWidth * (categoryIndex + offset);
  const py = (value) => PAD.top + innerHeight - (value / maxValue) * innerHeight;

  const labelFor = (categoryIndex, s, value) =>
    series.length > 1 ? `${categories[categoryIndex]} · ${s.name}: ${value}` : `${categories[categoryIndex]}: ${value}`;

  return (
    <div className="rounded-2xl border border-foreground/10 p-5">
      {caption && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{caption}</p>
      )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={"w-full" + (caption ? " mt-2" : "")}
        role="img"
        aria-label={caption || "chart"}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD.top + innerHeight * (1 - t);
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + innerWidth}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
              />
              <text x={PAD.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity={0.5}>
                {Math.round(maxValue * t)}
              </text>
            </g>
          );
        })}

        {categories.map((cat, i) => (
          <text
            key={cat}
            x={px(i)}
            y={HEIGHT - PAD.bottom + 16}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            fillOpacity={0.6}
          >
            {cat}
          </text>
        ))}

        {type === "bar" &&
          series.map((s, si) => {
            const barGroupWidth = categoryWidth * 0.7;
            const barWidth = barGroupWidth / series.length;
            return s.values.map((v, i) => {
              const barHeight = (v / maxValue) * innerHeight;
              const x = PAD.left + categoryWidth * i + categoryWidth * 0.15 + barWidth * si;
              return (
                <rect
                  key={`${si}-${i}`}
                  x={x}
                  y={py(v)}
                  width={Math.max(1, barWidth - 2)}
                  height={barHeight}
                  fill={s.color || "currentColor"}
                  className="cursor-default"
                  onMouseEnter={() =>
                    setHovered({ x: x + Math.max(1, barWidth - 2) / 2, y: py(v), text: labelFor(i, s, v) })
                  }
                  onMouseLeave={() => setHovered(null)}
                />
              );
            });
          })}

        {type === "line" &&
          series.map((s, si) => (
            <g key={si}>
              <polyline
                points={s.values.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                fill="none"
                stroke={s.color || "currentColor"}
                strokeWidth={2}
              />
              {s.values.map((v, i) => (
                <g key={i}>
                  <circle
                    cx={px(i)}
                    cy={py(v)}
                    r={8}
                    fill="transparent"
                    className="cursor-default"
                    onMouseEnter={() => setHovered({ x: px(i), y: py(v), text: labelFor(i, s, v) })}
                    onMouseLeave={() => setHovered(null)}
                  />
                  <circle cx={px(i)} cy={py(v)} r={3} fill={s.color || "currentColor"} pointerEvents="none" />
                </g>
              ))}
            </g>
          ))}

        <Tooltip hovered={hovered} />
      </svg>

      {series.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-foreground/60">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color || "currentColor" }} />
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
