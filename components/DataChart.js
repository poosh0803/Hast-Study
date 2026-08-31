"use client";

import { useState } from "react";

const WIDTH = 640;
const HEIGHT = 320;
const BASE_PAD = { top: 16, right: 16, bottom: 36, left: 44 };

function niceMax(values) {
  const max = Math.max(1, ...values);
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

function Legend({ series }) {
  if (series.length <= 1) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
      {series.map((s) => (
        <div key={s.name} className="flex items-center gap-1.5 text-xs text-foreground/60">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color || "currentColor" }} />
          {s.name}
        </div>
      ))}
    </div>
  );
}

// A `chart` field is one of:
// - { type: "bar"|"line", caption?, categories: string[],
//     series: [{ name, color?, values: number[] }] } — values line up
//     index-for-index with categories.
// - { type: "scatter", caption?, xLabel?, yLabel?,
//     series: [{ name, color?, points: [{ x, y }, ...] }] } — for
//     correlation-style plots (no shared category axis, each point has its
//     own x/y). Multiple series overlay as different-coloured point groups.
// `color` is any valid CSS colour (a hex code, or a keyword like
// "blue"/"green"/etc — SVG understands those directly, no lookup table
// needed here unlike DataTable's classes).
export default function DataChart({ chart }) {
  const [hovered, setHovered] = useState(null);
  if (!chart) return null;
  const { type = "bar", caption, series, xLabel, yLabel } = chart;

  const PAD = {
    ...BASE_PAD,
    left: BASE_PAD.left + (yLabel ? 16 : 0),
    bottom: BASE_PAD.bottom + (xLabel ? 16 : 0),
  };
  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;

  if (type === "scatter") {
    const xMax = niceMax(series.flatMap((s) => s.points.map((p) => p.x)));
    const yMax = niceMax(series.flatMap((s) => s.points.map((p) => p.y)));
    const scx = (x) => PAD.left + (x / xMax) * innerWidth;
    const scy = (y) => PAD.top + innerHeight - (y / yMax) * innerHeight;

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
              <g key={`y-${t}`}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={PAD.left + innerWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text x={PAD.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity={0.5}>
                  {Math.round(yMax * t)}
                </text>
              </g>
            );
          })}

          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const x = PAD.left + innerWidth * t;
            return (
              <text
                key={`x-${t}`}
                x={x}
                y={PAD.top + innerHeight + 16}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                fillOpacity={0.5}
              >
                {Math.round(xMax * t)}
              </text>
            );
          })}

          {xLabel && (
            <text
              x={PAD.left + innerWidth / 2}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              fillOpacity={0.6}
            >
              {xLabel}
            </text>
          )}
          {yLabel && (
            <text
              x={12}
              y={PAD.top + innerHeight / 2}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              fillOpacity={0.6}
              transform={`rotate(-90 12 ${PAD.top + innerHeight / 2})`}
            >
              {yLabel}
            </text>
          )}

          {series.map((s, si) =>
            s.points.map((p, pi) => (
              <g key={`${si}-${pi}`}>
                <circle
                  cx={scx(p.x)}
                  cy={scy(p.y)}
                  r={8}
                  fill="transparent"
                  className="cursor-default"
                  onMouseEnter={() =>
                    setHovered({
                      x: scx(p.x),
                      y: scy(p.y),
                      text:
                        (series.length > 1 ? `${s.name} · ` : "") +
                        `${xLabel || "x"}: ${p.x}, ${yLabel || "y"}: ${p.y}`,
                    })
                  }
                  onMouseLeave={() => setHovered(null)}
                />
                <circle cx={scx(p.x)} cy={scy(p.y)} r={4} fill={s.color || "currentColor"} fillOpacity={0.8} pointerEvents="none" />
              </g>
            ))
          )}

          <Tooltip hovered={hovered} />
        </svg>

        <Legend series={series} />
      </div>
    );
  }

  const { categories } = chart;
  const maxValue = niceMax(series.flatMap((s) => s.values));
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
            y={PAD.top + innerHeight + 16}
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

      <Legend series={series} />
    </div>
  );
}
