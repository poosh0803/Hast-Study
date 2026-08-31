# Hast Study — Tristan

A study site for Tristan's HAST prep, built as a server-hosted Next.js app
(as opposed to the earlier `hast-coach` static-page prototype). The app
itself — framework, architecture, every file under `app/`, `components/`,
`lib/` — is a fresh build on a different stack, no code shared with
`hast-coach`. The study content is a different story: a chunk of it
(Read/Abstract/Write, plus a second Math batch) was ported over from
`hast-coach`'s `data/` files and adapted to this project's content shape —
see `CONTENT-GUIDE.md`'s "Where this content came from" for the specifics
and what was lost/changed in the port.

Nav, tab pages, the drop-in content convention, and a click-through
multiple-choice quiz view are in place, with real content across all four
subjects (currently 24 Abstract sets, 8 Math sets, 19 Read sets, 28 Write
prompts — check `content/<subject>/` for the live count). More gets added
the same way: plain data files dropped into `content/`, without touching
the pages that render them.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3333. Because it's a real Next.js server (not a
static page like `hast-coach`), it can be deployed to a host and reached
from any device — that's the point of moving off the old localStorage-only
prototype.

```bash
npm run build
npm run start
```

## Tabs

- **Home** — landing page, links into each section.
- **Abstract** — abstract reasoning practice sets.
- **Math** — maths practice sets.
- **Read** — reading comprehension practice sets.
- **Write** — timed writing prompts.
- **Evaluations** — every note imported through Admin (see "Export &
  evaluation" below): overall notes from each import at the top, then
  per-subject, per-set specific notes with a link back to the set. Empty
  until something's actually been imported.

Plus **Admin**, set apart on the right of the nav (not one of the study
tabs) — lists every uploaded content file across all four subjects with a
checkbox per file (and a select-all per subject). Selecting any files
reveals **Export selected** and **Delete selected**: Export downloads one
JSON file of just those files' questions merged with Tristan's saved
answers, each question carrying a blank `evaluation` field (see "Export &
evaluation" below); Delete removes them. Either action regenerates the
affected subject's manifest once at the end, the same way an upload does.
Admin also has an **Import evaluation file** button — hands a filled-in
export back to the app (see "Export & evaluation"). No login on this
page — fine for personal/LAN use, but worth knowing before this is ever
exposed beyond localhost.

## Folder layout

```
app/
  layout.js          root layout — renders <NavBar/> and page content
  page.js             Home
  abstract/page.js    Abstract tab
  abstract/[id]/page.js  one set's detail/quiz page
  math/page.js        Math tab
  math/[id]/page.js      one set's detail/quiz page
  read/page.js        Read tab
  read/[id]/page.js      one set's detail/quiz page
  write/page.js        Write tab
  write/[id]/page.js     one prompt's page — timer + autosaving draft
  admin/page.js         Admin tab — lists + removes uploaded content files
  evaluations/page.js    Evaluations tab — every imported note, see "Export & evaluation"

components/
  NavBar.js            top nav, highlights the active tab
  EmptyState.js         "no content yet" placeholder shown on empty tabs
  ContentUploader.js    the Upload button on each tab page
  SetList.js             groups a subject's items by week, links each to its detail page
  QuizSet.js              renders a set's `questions` as a self-checking multiple-choice quiz,
                            shows an imported per-question evaluation note if there is one
  WritePrompt.js          timer + plan/shape + autosaving textarea for a Write prompt,
                            shows an imported whole-piece evaluation note if there is one
  PromptView.js           last-resort fallback (raw field dump)
  AdminFileList.js       the checkboxes + Export/Delete selected on the Admin tab
  EvaluationImporter.js   the Import evaluation file button on the Admin tab

content/
  abstract/manifest.js  auto-generated, exports ABSTRACT_SETS
  math/manifest.js       auto-generated, exports MATH_SETS
  read/manifest.js       auto-generated, exports READ_SETS
  write/manifest.js       auto-generated, exports WRITE_PROMPTS

lib/
  content-manifest.js   regenerateManifest() + listContentFiles() + loadFileDefaultExport()
  group-by-week.js       groupByWeek() — used by components/SetList.js
  progress-store.js      reads/writes data/progress.json
  evaluation-store.js     reads/writes data/evaluations.json

data/
  progress.json          gitignored — saved quiz answers/drafts, see "Progress" below
  evaluations.json        gitignored — imported evaluation text, see "Export & evaluation" below

app/api/upload-content/route.js     receives an upload, saves the file,
                                      calls regenerateManifest()
app/api/delete-content/route.js     removes one or more files ({ items: [...] }),
                                      calls regenerateManifest() once per affected subject
app/api/progress/route.js           POST records an answer, DELETE resets/clears a set
app/api/draft/route.js              POST saves the current draft text for a Write prompt
app/api/export/route.js             POST { items: [...] } downloads a JSON file of just
                                      those files' questions/drafts + your answers + blank evaluation fields
app/api/import-evaluation/route.js  POST a filled-in export file, merges its evaluations in
```

## Adding study content

Each subject's tab page imports one array from that subject's
`content/<subject>/manifest.js` and renders it — nothing else touches
content. There are two ways to add a set. For what actually goes *inside*
a set/prompt object (the `questions` shape, etc.), see
[`CONTENT-GUIDE.md`](CONTENT-GUIDE.md).

### Upload button (normal way)

Every tab (Abstract/Math/Read/Write) has an **Upload content files** button.
Pick one or more `.js` files at once (the file picker allows multi-select)
and the server:

1. saves each into that subject's `content/<subject>/` folder — one bad
   file (wrong extension, too big) doesn't block the rest of the batch,
   `app/api/upload-content/route.js` reports per-file success/failure and
   the button's status line summarizes it, and
2. regenerates that folder's `manifest.js` once, after every valid file in
   the batch has been saved (not once per file).

The content file's default export is either one set/prompt object, or an
array of them:

```js
// content/math/sets-M1.js
export default {
  id: "M1",
  week: 1,
  weekTitle: "Pattern & Number",
  title: "Fractions warm-up",
  questions: [ /* ... */ ],
};
```

```js
// content/math/sets-M2-M3.js — one file, multiple sets
export default [
  { id: "M2", week: 1, weekTitle: "Pattern & Number", title: "Ratios" },
  { id: "M3", week: 2, weekTitle: "Measurement", title: "Units & conversions" },
];
```

`manifest.js` in each content folder is **generated** (see the header
comment it's written with) — don't hand-edit it, the next upload to that
subject overwrites it.

This only takes effect live under `npm run dev` — Next's dev server picks
up the new file and recompiles automatically (the button waits a beat, then
refreshes the page). Under a production build (`next build && next start`)
new content is baked into the build, so an upload won't show up until the
app is rebuilt and restarted.

### Weeks

`week` (a number) and `weekTitle` (a string) are optional per item.
`components/SetList.js` groups a subject's items by `week`, sorted
ascending, under a heading like "Week 1 — Pattern & Number" — the title
shown comes from the first item it sees for that week number, so give
every item in the same week the same `weekTitle`. Weeks are scoped to one
subject: Math's "Week 1" and Read's "Week 1" are independent groupings,
each subject has its own sequence. Items with no `week` field land in a
trailing "Unsorted" group instead of being dropped.

### Taking a set

Each card on a subject tab links to `<basePath>/<id>` (e.g. `/math/M1`).
An item with a `questions` array renders `components/QuizSet.js` —
multiple choice, click an option, it locks in and shows correct/incorrect
plus the `explanation`, with a running score at the top. An item with no
`questions` but a `stimulus` or `kind` (Write prompts — see
`CONTENT-GUIDE.md`) renders `components/WritePrompt.js` instead: the
prompt, its `plan` steps and `shape` guidance, a `minutes`-based countdown
timer (Start/Pause/Reset, purely client-side, doesn't persist across a
reload), and a textarea that autosaves 1s after you stop typing (and
immediately on blur) via `POST /api/draft`. Anything else falls back to
`components/PromptView.js`, a plain dump of its fields.

### Progress

Answers/drafts are saved server-side in `data/progress.json` — one JSON
file, nested `{ [subject]: { [setId]: { answers: { [questionId]: {
chosen, correct, answeredAt } }, draft: { text, wordCount, updatedAt },
updatedAt } } }` (a quiz set only ever has `answers`, a Write prompt only
ever has `draft`). `lib/progress-store.js` reads and writes it;
`app/api/progress/route.js` exposes `POST` (record one answer, `QuizSet.js`
only) and `DELETE` (clear a set's saved record — used by both `QuizSet.js`'s
**Reset** and `WritePrompt.js`'s **Clear draft**); `app/api/draft/route.js`
exposes `POST` (save the current draft text, `WritePrompt.js` only). A
subject's list page reads that subject's progress server-side and passes
it to `SetList.js`, which shows "Not started" / "3 / 5 correct · in
progress" / "5 / 8 correct" for a quiz set, or "Draft saved · 214 words"
for a Write prompt, under each card. A set's detail page reads its own
saved record server-side and hands it to `QuizSet.js` (`initialAnswers`)
or `WritePrompt.js` (`initialDraft`), so reloading picks up right where
you left off.

`data/` is **gitignored** (see `.gitignore`) — it's runtime state that
changes on every click/keystroke, not authored content, so it doesn't
belong in git history the way `content/` does. It's also not
concurrency-safe (plain read-modify-write, no locking) — fine for one
person working through a quiz or a draft, not written to support
simultaneous writers.

### Export & evaluation

**Export** is selection-driven, not all-or-nothing: check some files in
Admin's list and an **Export selected** button appears next to **Delete
selected**. It `POST`s `{ items: [{ subject, filename }, ...] }` — the same
shape the delete route takes — to `app/api/export/route.js`, which reads
each selected file directly (`loadFileDefaultExport()` in
`lib/content-manifest.js` — evaluates the file's `export default` value
without going through the subject's manifest, since the manifest doesn't
track which file a given set came from) and returns one JSON file,
triggered as a download from the response (`AdminFileList.js` builds a
blob URL — a plain link can't `POST` a selection):

```json
{
  "exportedAt": "2026-08-29T12:00:00.000Z",
  "evaluation": "",
  "subjects": {
    "math": [
      {
        "id": "M1", "title": "...", "week": 1, "weekTitle": "...",
        "questions": [
          {
            "id": "M1-Q1", "prompt": "...", "choices": ["..."], "answer": 0,
            "explanation": "...",
            "yourAnswer": { "chosenIndex": 0, "chosenText": "...", "correct": true, "answeredAt": "..." },
            "evaluation": ""
          }
        ]
      }
    ]
  }
}
```

Each question's `yourAnswer` is merged in from `data/progress.json` (`null`
if unanswered) — the point is a self-contained file: question, correct
answer, and what was actually picked, all in one place. The blank
`evaluation` fields (top-level for an overall verdict, per-question for
something specific) are exactly that — blank, meant to be filled in by
whoever/whatever reads the file (an AI reviewing it, or Tristan by hand)
and the modified file handed back.

A Write prompt (no `questions`) exports differently: instead of a
`questions` array, it carries its saved `draft` (`null` if nothing's been
written yet) and **one** `evaluation` field for the whole piece —
```json
{ "id": "w19", "title": "...", "stimulus": "...", "plan": ["..."], "shape": "...", "draft": { "text": "...", "wordCount": 214, "updatedAt": "..." }, "evaluation": "" }
```
so an AI reviewing an essay gets the actual writing, not just the prompt.

**Import** closes the loop: Admin's **Import evaluation file** button
(`components/EvaluationImporter.js`) reads a local file, `POST`s its raw
JSON to `app/api/import-evaluation/route.js`, which pulls out every
non-blank `evaluation` string and merges it into
`data/evaluations.json` via `lib/evaluation-store.js` —
`{ subjects: { [subject]: { [setId]: { [questionId]: { evaluation, importedAt } } } }, batches: [{ importedAt, text }] }`
for the top-level one. A Write prompt's whole-piece evaluation lands under
the reserved key `_set` (`store.subjects[subject][setId]._set`) instead of
a question id, since it isn't about one question. This is a **separate
file from `data/progress.json`** on purpose: progress's `answers`/`draft`
are relied on elsewhere (the "3 / 5 correct" badge, a quiz or draft
reloading with previous work already there) to only ever hold real in-app
data — merging evaluation-only entries into it would corrupt that.
Re-importing the same file, or one covering overlapping questions/prompts,
just adds another batch/overwrites that entry — it doesn't dedupe or diff
against a previous import.

**Displaying it** happens two places. Inline, on the actual set: a quiz
page reads that set's evaluations via `getSetEvaluations(subject, id)`
and hands the map to `QuizSet.js`, which shows a note under any question
that has one (only once you've answered it, next to its `explanation`); a
Write prompt's page passes its `_set` entry's text to `WritePrompt.js`,
shown once above the textarea. Everything at once, including overall
batch notes: the **Evaluations** tab (`app/evaluations/page.js`) reads
`getAllEvaluations()` and lists every batch note newest-first, then every
subject's per-set notes grouped and linked back to the set — the one
place to see the whole imported history, not just what's attached to the
set you're currently looking at.

### Manual (no server needed)

Drop the file into `content/<subject>/` yourself, following the same
default-export shape, then regenerate that folder's manifest:

```bash
node -e "require('./lib/content-manifest.js').regenerateManifest('math')"
```

If a genuinely new tab is needed (not one of the four above), that's a
bigger change — a new route under `app/`, an entry in `components/NavBar.js`,
an entry in `lib/content-manifest.js`'s `SUBJECTS`, and a new
`content/<tab>/`. Ask before doing that; it touches more than the
content-only path above.

## Stack

- [Next.js](https://nextjs.org) (App Router, JavaScript, no TypeScript)
- Tailwind CSS v4 for styling
- No database — content is static data files, quiz progress is a single
  gitignored JSON file (see "Progress" above). Revisit if/when an Analysis
  tab needs real querying across a lot of attempt history.
