export default {
  "id": "M3",
  "week": 2,
  "weekTitle": "Building Skills",
  "title": "Space & steps",
  "topic": "Space & steps",
  "description": "Draw it. Count what you cannot see from the front.",
  "timeMinutes": 12,
  "questions": [
    {
      "id": "M3-Q1",
      "skill": "m-space",
      "prompt": "How many small cubes remain after the corner cube is removed?",
      "choices": [
        "26",
        "24",
        "18",
        "27"
      ],
      "answer": 0,
      "explanation": "A corner cube is one cube. Evidence: 27 − 1 = 26. Common trap: Thinking a corner is three cubes."
    },
    {
      "id": "M3-Q2",
      "skill": "m-space",
      "prompt": "How many small cubes in the full 3×3×3 have at least one face painted if the outside is painted first?",
      "choices": [
        "8",
        "26",
        "27",
        "18"
      ],
      "answer": 1,
      "explanation": "27 − 1 = 26. Evidence: Only the hidden centre cube is unpainted. Common trap: Forgetting the very middle cube."
    },
    {
      "id": "M3-Q3",
      "skill": "m-space",
      "prompt": "A rectangle is 8 cm by 5 cm. Another rectangle has the same perimeter but is 9 cm long. Its width is",
      "choices": [
        "4 cm",
        "5 cm",
        "6 cm",
        "7 cm"
      ],
      "answer": 0,
      "explanation": "Same perimeter, not same area. Evidence: Perimeter 26; 9 + w = 13; w = 4. Common trap: Keeping the area instead of the perimeter."
    },
    {
      "id": "M3-Q4",
      "skill": "m-word",
      "prompt": "A car travels 84 km in 1 hour 10 minutes. Average speed in km/h is",
      "choices": [
        "72",
        "84",
        "70",
        "96"
      ],
      "answer": 0,
      "explanation": "Time must be in hours. Evidence: 70 minutes = 7/6 hours; 84 ÷ 7/6 = 72. Common trap: Treating 1 h 10 min as 1.10 hours."
    },
    {
      "id": "M3-Q5",
      "skill": "m-word",
      "prompt": "Tickets are $12 each, or 5 for $50. What is the least cost for 11 tickets?",
      "choices": [
        "$110",
        "$112",
        "$120",
        "$100"
      ],
      "answer": 1,
      "explanation": "11 = 5+5+1. Evidence: Two packs of 5 = $100, plus one $12 = $112. Common trap: Buying only packs or only singles."
    },
    {
      "id": "M3-Q6",
      "skill": "m-seq",
      "prompt": "A square number pattern starts 1, 4, 9, 16. The 8th term is",
      "choices": [
        "36",
        "49",
        "64",
        "81"
      ],
      "answer": 2,
      "explanation": "nth term n². Evidence: 8² = 64. Common trap: Counting from zero."
    },
    {
      "id": "M3-Q7",
      "skill": "m-word",
      "prompt": "After a 20% discount a jacket costs $64. The original price was",
      "choices": [
        "$76.80",
        "$80",
        "$84",
        "$51.20"
      ],
      "answer": 1,
      "explanation": "Discount off the original, not added to 64. Evidence: 64 is 80% of the original, so original = 64 ÷ 0.8 = 80. Common trap: Adding 20% onto the sale price."
    }
  ]
};
