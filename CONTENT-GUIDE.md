# Content Guide

This documents the *internal* shape of a study-content file — what goes
inside the object(s) a `content/<subject>/*.js` file default-exports. For
the folder/upload mechanics (where files live, how manifests regenerate,
how weeks group), see the README's "Adding study content" section first;
this file only covers the payload itself.

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

Abstract reasoning here is **text-described**, not image-based — e.g. "A
counter shows 3, then 5, then 7. Next is" with text choices like `"9"`.
There's no diagram renderer in this app, so don't reference a figure/image
a question depends on; keep every abstract question answerable from the
prompt text alone.

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
