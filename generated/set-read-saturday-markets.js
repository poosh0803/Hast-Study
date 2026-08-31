export default {
  "id": "D4",
  "week": 1,
  "weekTitle": "Foundations",
  "title": "Saturday markets",
  "topic": "Saturday markets",
  "description": "Table first. Headings. Then prove the option with a cell.",
  "timeMinutes": 10,
  "passages": [
    {
      "label": "Stall bookings, one Saturday",
      "text": "A community market allows four stall types. Numbers are stalls booked that day."
    }
  ],
  "questions": [
    {
      "id": "D4-Q1",
      "skill": "table",
      "prompt": "Which zone booked the most repair stalls?",
      "choices": [
        "River lawn",
        "Car park",
        "Hall verge",
        "They are equal"
      ],
      "answer": 1,
      "explanation": "Car park 7 is the peak. Evidence: Repairs column: 1, 7, 0. Common trap: Looking at totals instead of the repairs column."
    },
    {
      "id": "D4-Q2",
      "skill": "table",
      "prompt": "Which statement is supported?",
      "choices": [
        "Every zone booked more food than clothes",
        "Hall verge booked no repairs and the most clothes",
        "Plants outnumbered clothes overall",
        "The car park was the busiest zone overall"
      ],
      "answer": 1,
      "explanation": "Two cells confirm B. Evidence: Hall verge repairs 0, clothes 9 (highest clothes). Totals: both lawn and verge 18 > car park 14. Common trap: One true half of an option."
    },
    {
      "id": "D4-Q3",
      "skill": "infer",
      "prompt": "A reader could reasonably challenge the table as a picture of “typical Saturdays” because",
      "choices": [
        "it includes clothes",
        "it is one Saturday only",
        "fifty is a large number",
        "repairs cannot be sold outdoors"
      ],
      "answer": 1,
      "explanation": "Sample of one day. Evidence: Caption: one Saturday. Common trap: Attacking the topic instead of the sample."
    },
    {
      "id": "D4-Q4",
      "skill": "table",
      "prompt": "Food + plants together are",
      "choices": [
        "smaller than clothes alone",
        "26 stalls",
        "only in the car park",
        "equal to repairs"
      ],
      "answer": 1,
      "explanation": "Add the totals row. Evidence: 15 + 11 = 26. Common trap: Adding the wrong pair."
    }
  ]
};
