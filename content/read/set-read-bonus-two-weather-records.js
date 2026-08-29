export default {
  "id": "E2",
  "week": null,
  "weekTitle": null,
  "title": "Bonus · Two weather records",
  "topic": "Bonus · Two weather records",
  "description": "A table of maxima. Compare years, do not average in your head without looking.",
  "timeMinutes": 8,
  "passages": [
    {
      "label": "Note",
      "text": "Maxima are the highest daytime reading that month. Rain days count any day with at least 1 mm."
    }
  ],
  "questions": [
    {
      "id": "E2-Q1",
      "skill": "table",
      "prompt": "Which city recorded both a higher maximum and fewer rain days in 2025 than in 2024?",
      "choices": [
        "Port Ellen",
        "Red Hollow",
        "Kempfield",
        "None of them"
      ],
      "answer": 2,
      "explanation": "Among the named options, only Kempfield is both hotter and drier. Stony Reach follows the same pattern but is not listed as A-C. Evidence: Kempfield 38 to 41 and rain 4 to 1. Common trap: Stopping at the first column."
    },
    {
      "id": "E2-Q2",
      "skill": "table",
      "prompt": "Port Ellen is unlike the other three in that it",
      "choices": [
        "had no rain",
        "was cooler in 2025 and had more rain days",
        "is not a city in the table",
        "had the hottest maximum"
      ],
      "answer": 1,
      "explanation": "Only cooler-and-wetter row. Evidence: 27→26, 9→11. Common trap: Hottest ≠ Port Ellen."
    },
    {
      "id": "E2-Q3",
      "skill": "infer",
      "prompt": "The table cannot tell you",
      "choices": [
        "which listed city had the hottest 2025 day-reading",
        "whether nights were hotter",
        "which city had the fewest 2025 rain days",
        "whether Red Hollow’s max fell"
      ],
      "answer": 1,
      "explanation": "Night temperature is absent. Evidence: Only maxima and rain days — no minima / nights. Common trap: Inventing overnight data."
    },
    {
      "id": "E2-Q4",
      "skill": "table",
      "prompt": "Rain days in Stony Reach",
      "choices": [
        "tripled",
        "fell from 6 to 2",
        "matched Port Ellen",
        "were zero"
      ],
      "answer": 1,
      "explanation": "Direct cells. Evidence: 6 → 2. Common trap: Wrong row."
    }
  ]
};
