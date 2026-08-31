# Evaluation Guide

This is for reviewing a Hast Study **export file** (Admin → select some
content files → **Export selected**) and filling in its blank
`evaluation` fields. It's not for writing new content — see
`CONTENT-GUIDE.md` for that.

## The file you'll get

A quiz set (Math/Abstract/Read) looks like this — one entry per question:

```json
{
  "exportedAt": "2026-08-31T12:00:00.000Z",
  "evaluation": "",
  "subjects": {
    "math": [
      {
        "id": "M1", "title": "...",
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

`yourAnswer` is `null` if that question hasn't been attempted yet.

A Write prompt (no `questions` array) looks like this instead — one
`evaluation` for the whole piece, next to the actual draft:

```json
{
  "id": "w8", "title": "...", "stimulus": "...", "plan": ["..."], "shape": "...",
  "draft": { "text": "...", "wordCount": 214, "updatedAt": "..." },
  "evaluation": ""
}
```

`draft` is `null` if nothing's been written yet.

## What to do

1. **Quiz questions** — for every question with a non-null `yourAnswer`,
   write a short (1–3 sentence) note in its `evaluation` field. Be
   specific: reference what was actually picked and *why* it was right or
   wrong, not just "correct"/"incorrect". Look across the questions in one
   set for patterns worth naming — a repeated mistake type, a skill
   that's clearly automatic now, hesitation on a particular style of
   question. Leave `evaluation` as `""` for any question whose
   `yourAnswer` is `null` — there's nothing to evaluate yet.
2. **Write pieces** — for a prompt with a non-null `draft`, write the
   evaluation straight into that item's own `evaluation` field (there's
   no per-question loop here). Assess the actual writing against the
   `stimulus`, whether the `plan` points show up, and the `shape` it was
   meant to follow.
3. **Overall note** — fill in the top-level `evaluation` field with a
   short summary across the *whole* export — patterns across sets/
   subjects, what to focus on next, genuine strengths. Don't just repeat
   each per-question note.
4. **Leave everything else untouched** — `id`, `title`, `questions`,
   `choices`, `answer`, `explanation`, `yourAnswer`, `draft`, `stimulus`,
   `plan`, `shape`, all of it. Only `evaluation` fields should change.
5. Save the file (same filename is fine) and bring it back through
   Admin's **Import evaluation file** button.

## Tone

Specific and actionable, not generic praise or criticism. "Missed this
one — picked 'yellow circle', combining the right colour with the wrong
shape. Re-drill reading both axes independently before combining." is a
good evaluation. "Good job!" or "Needs improvement" is not. Write like a
study coach reviewing a kid's real practice attempt, not a generic grader
— the point is feedback Tristan can actually act on next time.
