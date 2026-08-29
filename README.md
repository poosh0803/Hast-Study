# Hast Study — Tristan

A study site for Tristan's HAST prep, built as a server-hosted Next.js app
(as opposed to the earlier `hast-coach` static-page prototype). This repo is
a fresh start on a different framework — it does not import, link to, or
reuse any code from `hast-coach`; that project was only used as background
reading on what HAST prep needs to cover.

Right now this is **framework only** — nav, tab pages, and the drop-in
content convention are in place, but no real study content exists yet. Study
sets get added later as plain data files, dropped into `content/`, without
touching the pages that render them.

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

An **Analysis** tab (progress/score breakdowns) may be added later once
there's real attempt data to analyze.

## Folder layout

```
app/
  layout.js          root layout — renders <NavBar/> and page content
  page.js             Home
  abstract/page.js    Abstract tab
  math/page.js        Math tab
  read/page.js        Read tab
  write/page.js        Write tab

components/
  NavBar.js            top nav, highlights the active tab
  EmptyState.js         "no content yet" placeholder shown on empty tabs

content/
  abstract/manifest.js  exports ABSTRACT_SETS (currently [])
  math/manifest.js       exports MATH_SETS (currently [])
  read/manifest.js       exports READ_SETS (currently [])
  write/manifest.js       exports WRITE_PROMPTS (currently [])
```

## Adding study content

Each subject's tab page imports one array from that subject's
`content/<subject>/manifest.js` and renders it — nothing else. To add a new
set of questions/prompts, you only ever touch two files:

1. **Create the content file** — e.g. `content/math/sets-M1.js` — exporting
   a plain object (or array of objects) shaped however that subject's page
   expects to consume it (each item needs at least an `id` and a `title`
   today; extend the shape as real content and UI are designed together).

   ```js
   // content/math/sets-M1.js
   export const setM1 = {
     id: "M1",
     title: "Fractions warm-up",
     questions: [ /* ... */ ],
   };
   ```

2. **Register it in the manifest** — import it in
   `content/math/manifest.js` and add it to the exported array:

   ```js
   import { setM1 } from "./sets-M1";

   export const MATH_SETS = [setM1];
   ```

That's it — reload the page and the new set appears. The page component,
nav, and every other subject are untouched. The same pattern applies to
`abstract/`, `read/`, and `write/` (whose manifest exports `WRITE_PROMPTS`
instead of a `*_SETS` array).

If a genuinely new tab is needed (not one of the four above), that's a
bigger change — a new route under `app/`, an entry in `components/NavBar.js`,
and a new `content/<tab>/manifest.js`. Ask before doing that; it touches
more than the content-only path above.

## Stack

- [Next.js](https://nextjs.org) (App Router, JavaScript, no TypeScript)
- Tailwind CSS v4 for styling
- No database yet — content is static data files; persistence for
  scores/progress will be designed once there's real content to track
  progress against.
