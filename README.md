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

Then open http://localhost:3000. Because it's a real Next.js server (not a
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

Plus **Admin**, set apart on the right of the nav (not one of the study
tabs) — lists every uploaded content file across all four subjects with a
checkbox per file (and a select-all per subject); Remove deletes one, or
select several across any mix of subjects and Delete selected removes them
in one request. Either way, each affected subject's manifest is
regenerated once at the end, the same way an upload does. It also has an
**Export questions & answers** link — downloads one JSON file with every
subject's questions merged with Tristan's saved answer for each (see
"Export" below), meant for handing to an AI to review how the study is
going. No login on this page — fine for personal/LAN use, but worth
knowing before this is ever exposed beyond localhost.

An **Analysis** tab (progress/score breakdowns) may be added later once
there's real attempt data to analyze.

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
  write/[id]/page.js     one prompt's detail page
  admin/page.js         Admin tab — lists + removes uploaded content files

components/
  NavBar.js            top nav, highlights the active tab
  EmptyState.js         "no content yet" placeholder shown on empty tabs
  ContentUploader.js    the Upload button on each tab page
  SetList.js             groups a subject's items by week, links each to its detail page
  QuizSet.js              renders a set's `questions` as a self-checking multiple-choice quiz
  PromptView.js           fallback for a set with no `questions` (raw field dump)
  AdminFileList.js       the Remove buttons on the Admin tab

content/
  abstract/manifest.js  auto-generated, exports ABSTRACT_SETS
  math/manifest.js       auto-generated, exports MATH_SETS
  read/manifest.js       auto-generated, exports READ_SETS
  write/manifest.js       auto-generated, exports WRITE_PROMPTS

lib/
  content-manifest.js   regenerateManifest() + listContentFiles()
  group-by-week.js       groupByWeek() — used by components/SetList.js
  progress-store.js      reads/writes data/progress.json

data/
  progress.json          gitignored — saved quiz answers, see "Progress" below

app/api/upload-content/route.js   receives an upload, saves the file,
                                    calls regenerateManifest()
app/api/delete-content/route.js   removes one or more files ({ items: [...] }),
                                    calls regenerateManifest() once per affected subject
app/api/progress/route.js         POST records an answer, DELETE resets a set
app/api/export/route.js           GET downloads one JSON file: every question + your answer
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

Each card on a subject tab links to `<basePath>/<id>` (e.g. `/math/M1`),
which renders `components/QuizSet.js` if the item has a `questions` array —
multiple choice, click an option, it locks in and shows correct/incorrect
plus the `explanation`, with a running score at the top. An item with no
`questions` (Write prompts, for now — see `CONTENT-GUIDE.md`) falls back to
`components/PromptView.js`, a plain dump of its fields, until that content
shape is designed.

### Progress

Answers are saved server-side in `data/progress.json` — one JSON file,
nested `{ [subject]: { [setId]: { answers: { [questionId]: { chosen,
correct, answeredAt } }, updatedAt } } }`. `lib/progress-store.js` reads and
writes it; `app/api/progress/route.js` exposes `POST` (record one answer)
and `DELETE` (clear a set's saved answers, used by the **Reset** button on
a quiz page). A subject's list page reads that subject's progress
server-side and passes it to `SetList.js`, which shows "Not started" / "3 /
5 correct · in progress" / "5 / 8 correct" under each card; a set's detail
page reads its own saved answers server-side and hands them to `QuizSet.js`
as `initialAnswers`, so a previously-answered question reloads already
locked in with its explanation showing.

`data/` is **gitignored** (see `.gitignore`) — it's runtime state that
changes on every click, not authored content, so it doesn't belong in git
history the way `content/` does. It's also not concurrency-safe (plain
read-modify-write, no locking) — fine for one person clicking through a
quiz, not written to support simultaneous writers.

### Export

The **Export questions & answers** link on Admin hits `app/api/export/route.js`
(a plain `GET`, downloaded via `Content-Disposition: attachment` — no
client JS needed), which builds one JSON file:

```json
{
  "exportedAt": "2026-08-29T12:00:00.000Z",
  "subjects": {
    "math": [
      {
        "id": "M1", "title": "...", "week": 1, "weekTitle": "...",
        "questions": [
          {
            "id": "M1-Q1", "prompt": "...", "choices": ["..."], "answer": 0,
            "explanation": "...",
            "yourAnswer": { "chosenIndex": 0, "chosenText": "...", "correct": true, "answeredAt": "..." }
          }
        ]
      }
    ],
    "abstract": [], "read": [], "write": []
  }
}
```

Every subject's sets are read from their manifest (same as the tab pages)
and each question gets a `yourAnswer` merged in from `data/progress.json`
via `getSubjectProgress()` — `null` if that question hasn't been answered
yet. The point is a self-contained file: question, correct answer, and
what was actually picked, all in one place, so an AI reading it doesn't
need anything else to spot patterns (which topics, which weeks, what kind
of mistakes).

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
