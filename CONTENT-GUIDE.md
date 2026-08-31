# Content Guide

This documents the *internal* shape of a study-content file — what goes
inside the object(s) a `content/<subject>/*.js` file default-exports. For
the folder/upload mechanics (where files live, how manifests regenerate,
how weeks group), see the README's "Adding study content" section first;
this file only covers the payload itself.

## Output format — read this first

Your job is to output **one thing**: the raw text contents of a single
`.js` file, ready to save exactly as given and upload. Nothing else.

- It must start with `export default` (an object for a single set, or an
  array of such objects) — plain JavaScript, not JSON, not TypeScript.
- **Not HTML.** Never write `<table>`, `<svg>`, `<div>`, or any other
  markup tag anywhere in the output — not even for the `tables`/`charts`/
  `diagrams` fields below. Those fields are **plain data**: JS
  strings/numbers/arrays/objects describing a table's rows, a chart's
  values, a diagram's tree. This app's own React components turn that
  data into the actual visual — you never draw or mark up anything
  yourself. If you catch yourself writing an angle-bracket tag, stop —
  that's the wrong output.
- Don't produce a webpage, a preview, or a rendering of the content —
  only the data that describes it.
- Don't produce more than one file, and don't add a README, explanation
  file, or usage notes alongside it. If you want to explain your choices,
  do that as a short message *outside* the file, not inside it.
- It's fine to wrap the file in a single ```js code fence when replying
  in chat (that's just how chat displays code) — but everything inside
  that fence must be the literal file contents and nothing but the
  literal file contents: no HTML, no commentary mixed in, no truncation
  with "...". Copy-paste of that fenced block, saved as the `.js` file
  named per the rule below, must work unmodified.

Nothing here is enforced by code yet. `components/SetList.js` currently
just lists `title` — there's no quiz-taking UI built for any subject yet.
Treat the shapes below as the target schema so content written now and the
UI built later agree, rather than a contract the app currently checks.

## Filenames

Name the file `<subject>-week<N>-<topic-or-pack>.js` — the subject
(`math`, `abstract`, `read`, or `write`), the week number with no
separator between "week" and the digits, then a kebab-case topic or pack
label. Example: `math-week2-linear-pack-2.js`. That's the file to save
and upload via that subject's tab (see the README's "Adding study
content" for the upload mechanics) — this doesn't affect the `id` field
inside the file, which keeps its own short-code convention below.

## Shared fields (every subject)

Every set/prompt object — the default export itself, or each item of a
default-exported array — carries:

- `id` (string, required) — unique within the subject. Convention:
  `<Letter><n>`, matching the subject's initial — `M1`, `M2` for Math,
  `A1` for Abstract, `R1` for Read, `W1` for Write.
- `title` (string, required) — short label shown in the set list.
- `week` (number, optional) — see README "Weeks".
- `weekTitle` (string, optional) — same string for every item sharing a
  `week` number; the first one seen is what's displayed.

Everything else is subject-specific, described below.

## Visual data: tables, charts, diagrams

Available on any subject with `questions` (Math/Read/Abstract) — optional
arrays sitting alongside `passages`, rendered above the questions in the
order tables, then charts, then diagrams. These exist because the real
ACER HAST sample booklet uses this kind of thing constantly (flower
availability calendars, tournament tables, energy-consumption graphs, a
weighing-balance mobile) — **all of it is structured data, never an
actual image file, and never HTML/SVG markup either** (see "Output
format" above) — which is exactly what makes it something you (an AI
writing this JS file) can generate directly, the same way you'd write a
`questions` array. Don't reference an uploaded image anywhere in this
app — there's no image-upload mechanism, only these three.

### `tables`

```js
tables: [
  {
    caption: "Flower availability", // optional
    columns: ["Flower", "Jan", "Feb", "Mar"],
    rows: [
      ["R1", { text: "", color: "red" }, { text: "", color: "red" }, ""],
      ["O1", "", { text: "", color: "orange" }, ""],
    ],
  },
],
```

Each row is an array of cells, one per column. A cell is either a plain
string/number, or `{ text, color }` to highlight it — `color` is one of
`red`/`orange`/`yellow`/`green`/`blue`/`pink`/`purple`/`gray`.

### `charts`

Two shapes, picked by `type`:

```js
charts: [
  {
    type: "bar", // or "line"
    caption: "Energy consumption 1973–2014", // optional
    categories: ["1973–74", "1978–79", "1983–84"], // x-axis labels
    series: [
      { name: "Black coal", color: "#2f2b24", values: [10, 15, 12] },
      { name: "Oil", color: "#d97706", values: [20, 18, 22] },
    ],
  },
],
```

`values` line up index-for-index with `categories`. Only `bar` and
`line` are supported here — no stacked-area or pie yet.

```js
charts: [
  {
    type: "scatter",
    caption: "Bark smoothness vs trunk diameter", // optional
    xLabel: "Trunk diameter (cm)", // optional, shown under the x-axis
    yLabel: "Percentage of smooth bark", // optional, shown beside the y-axis
    series: [
      {
        name: "Trees", // only shown in a legend if there's more than one series
        color: "#92400e",
        points: [
          { x: 2, y: 98 },
          { x: 13, y: 22 },
          { x: 48, y: 0 },
        ],
      },
    ],
  },
],
```

For `scatter`, each series has `points` (an array of `{ x, y }`) instead
of `values` — there's no shared `categories` axis, since each point
carries its own x and y. Use this for correlation-style plots (e.g. "as
X increases, does Y increase or decrease" — this is exactly the
ACER-style scatter plot with two loose axis labels and a cloud of dots,
not a bar/line chart with named categories). Both axes start at 0 and
scale to fit the data automatically — you only supply the raw x/y
numbers. `color` (on either shape) is any valid CSS colour (a hex code,
or a keyword like `"blue"`).

### `diagrams`

For a weighing-balance / mobile puzzle — rods branching into shapes,
some of which branch further:

```js
diagrams: [
  {
    caption: "Balance", // optional
    totalMass: 20, // optional, shown at the top hook
    massUnit: "kg", // optional, defaults to "kg"
    root: {
      children: [
        {
          shape: "rect", color: "#3b82f6",
          children: [
            { shape: "oval", color: "#10b981" },
            { shape: "oval", color: "#10b981" },
          ],
        },
        {
          children: [
            { shape: "triangle", color: "#eab308" },
            {
              shape: "hexagon", color: "#9333ea",
              children: [
                { shape: "square", color: "#ec4899" },
                { shape: "square", color: "#ec4899" },
                { shape: "square", color: "#ec4899" },
              ],
            },
          ],
        },
      ],
    },
  },
],
```

Every node (including `root`) is `{ shape?, color?, label?, children? }`.
`shape` is one of `rect`/`square`/`oval`/`circle`/`triangle`/`hexagon` —
omit it for a plain junction where a rod just splits further with no
weight of its own (like `root`, and the unlabelled node splitting into
the triangle and hexagon above). `label` is an optional short string
drawn under a shape (e.g. `"3 kg"`) once you know/want to reveal a mass.
**You only ever describe the tree** — spacing, rod lengths, and the
actual drawing are computed by the app; don't try to specify coordinates.

## Math

- `topic` (string, optional) — short tag, e.g. `"Number & Pattern"`,
  `"Algebra"`, `"Measurement"`. Not used by any UI yet; kept for future
  filtering.
- `questions` (array, required) — multiple-choice questions:
  - `id` (string) — unique within the set, convention `<setId>-Q<n>`
    (e.g. `M1-Q1`).
  - `prompt` (string) — the question text.
  - `choices` (array of strings) — answer options, 4 by convention.
  - `answer` (number) — 0-based index into `choices` for the correct one.
  - `explanation` (string, optional but recommended) — shown on review;
    say *why* the answer is correct, not just restate it.

Plain text only — there's no LaTeX/MathML renderer in this app, so write
fractions/exponents/roots as Unicode or words (`¾`, `x²`, `√16`, "the
square root of 16") rather than markup.

Example (see `content/math/sets-M1.js` for the first real one):

```js
export default {
  id: "M1",
  week: 1,
  weekTitle: "Number & Pattern",
  title: "Fractions warm-up",
  topic: "Number & Pattern",
  questions: [
    {
      id: "M1-Q1",
      prompt: "What is ¾ + ⅛?",
      choices: ["⅞", "4/12", "1", "⅝"],
      answer: 0,
      explanation: "¾ = 6/8, so 6/8 + ⅛ = ⅞.",
    },
  ],
};
```

## Read & Abstract

Same shape as Math (`questions` with `id`/`prompt`/`choices`/`answer`/
`explanation`), plus:

- `description` (string, optional) — short framing blurb for the set
  (what to watch for), shown above the questions.
- `timeMinutes` (number, optional) — suggested time limit for the set.
- `passages` (array of `{label, text}`, optional) — the reading
  passage(s) or a short reasoning-method note the questions refer to. Read
  sets almost always have one; Abstract sets sometimes carry a short
  "method" passage instead of an image.
- Each question may also carry `skill` (string, optional) — a short
  question-type tag (e.g. `"infer"`, `"tone"`, `"word"` for Read;
  `"a-next"`, `"a-mid"`, `"a-grid"` for Abstract), for future filtering by
  skill rather than by topic.

Abstract reasoning here is mostly still **text-described**, not
image-based — e.g. "A counter shows 3, then 5, then 7. Next is" with text
choices like `"9"`. The `tables`/`charts`/`diagrams` fields above cover
some real Abstract-style visual content (e.g. a family-tree or
weighing-style logic puzzle, which is just a `diagrams` mobile without
the mass numbers), but **not** classic rotating/shifting-shape "next in
sequence" items (a shape spinning 45° each frame, a dot moving around a
pentagon) — there's no renderer for that yet. If a question depends on
one of those, keep it text-described instead; don't invent a figure this
app can't draw.

## Write

Different shape — not multiple-choice:

- `kind` (string) — prompt type, e.g. `"Discursive"`, `"Creative"`,
  `"Scene"`, `"Open"`, `"Persuasive"`, `"Reflective"`, `"Advice"`.
- `minutes` (number) — the timed limit (25 is standard).
- `stimulus` (string) — the prompt text itself. Also used as `title` for
  the set list, since there's no separate short title.
- `plan` (array of strings) — a few planning questions/prompts to
  consider before writing.
- `shape` (string) — one line describing the structural arc to aim for.

## Where this content came from

The first real Read/Abstract/Write content (and a second maths batch)
was ported from the earlier `hast-coach` static-page project's `data/`
files — see that repo's README for its own (different, code-based)
content format. Porting notes:

- Its per-option `whyWrong` feedback and `trap` (common-mistake) notes got
  folded into this schema's single `explanation` string rather than kept
  as separate per-choice fields — that's a real loss of granularity if a
  future UI wants to show *why each wrong choice is wrong*, not just why
  the right one is right. Revisit `explanation`'s shape then if so.
- `week`/`weekTitle` on the ported sets come from hast-coach's old
  `data/plan.js` 4-week schedule, mapped by set id. Where an id appeared
  in more than one week of that plan (a deliberate spaced-repetition
  revisit), only the later week was kept — so the mapping is approximate,
  not authoritative.
- hast-coach's few seed sets (ids `A`, `B`, `C` in its `data/core.js`,
  referenced by `plan.js` but never pushed to its content bank the same
  way) were not ported.
