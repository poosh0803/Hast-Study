export default {
  "id": "D4b",
  "week": null,
  "weekTitle": null,
  "title": "Library loans graph",
  "topic": "Library loans graph",
  "description": "Stacked or band thinking. Width = amount. Read the note.",
  "timeMinutes": 8,
  "passages": [
    {
      "label": "Loans, 2016–2025 (described)",
      "text": "A stacked graph of annual loans at one library:\n2016 total about 40 000. 2025 total about 88 000.\nBands from bottom to top each year: print novels, print non-fiction, children’s print, e-loans.\nPrint novels stay a wide band all the way through.\nE-loans start as a thin band in 2016 and become a clear band by 2025, but still narrower than print novels.\nChildren’s print grows steadily.\nPrint non-fiction stays roughly the same width.\nThere is no year where the total stack shrinks."
    }
  ],
  "questions": [
    {
      "id": "D4b-Q1",
      "skill": "table",
      "prompt": "Between 2016 and 2025 total loans",
      "choices": [
        "never declined, and more than doubled",
        "stayed much the same",
        "fell after e-loans arrived",
        "cannot be compared"
      ],
      "answer": 0,
      "explanation": "More than double and never down. Evidence: 40 000 to 88 000; no year the stack shrinks. Common trap: Assuming e-books killed print totals."
    },
    {
      "id": "D4b-Q2",
      "skill": "table",
      "prompt": "The most accurate summary is",
      "choices": [
        "e-loans replaced print novels as the dominant band",
        "print novels remain the dominant band; e-loans grew from a thin start",
        "children’s print disappeared",
        "non-fiction overtook everything"
      ],
      "answer": 1,
      "explanation": "Growth ≠ replacement. Evidence: Novels stay wide; e-loans thin then clearer but still narrower than novels. Common trap: The new thing must have won."
    },
    {
      "id": "D4b-Q3",
      "skill": "table",
      "prompt": "Which resource increased its band most clearly from a near-zero start?",
      "choices": [
        "print novels",
        "print non-fiction",
        "e-loans",
        "the total cannot show this"
      ],
      "answer": 2,
      "explanation": "Biggest visible new growth from almost nothing. Evidence: E-loans thin in 2016, clear by 2025. Common trap: Confusing total growth with one band."
    },
    {
      "id": "D4b-Q4",
      "skill": "infer",
      "prompt": "The graph does not, by itself, prove",
      "choices": [
        "totals rose",
        "e-loans existed in 2025",
        "people became better readers",
        "print novels stayed important"
      ],
      "answer": 2,
      "explanation": "A value claim the numbers do not carry. Evidence: Loans ≠ quality of reading. Common trap: Reading morals into a stack."
    }
  ]
};
