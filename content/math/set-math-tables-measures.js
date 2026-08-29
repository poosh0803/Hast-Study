export default {
  "id": "M2",
  "week": 1,
  "weekTitle": "Foundations",
  "title": "Tables & measures",
  "topic": "Tables & measures",
  "description": "Headings first. Prove the option with a cell or a conversion.",
  "timeMinutes": 12,
  "table": {
    "headers": [
      "Day",
      "Laps",
      "Minutes"
    ],
    "rows": [
      [
        "Mon",
        "8",
        "20"
      ],
      [
        "Tue",
        "12",
        "27"
      ],
      [
        "Wed",
        "9",
        "22"
      ],
      [
        "Thu",
        "15",
        "30"
      ]
    ]
  },
  "questions": [
    {
      "id": "M2-Q1",
      "skill": "m-data",
      "prompt": "On which day was the mean time per lap the shortest?",
      "choices": [
        "Mon",
        "Tue",
        "Wed",
        "Thu"
      ],
      "answer": 3,
      "explanation": "Minutes ÷ laps. Evidence: Thu 30÷15 = 2 min/lap. Others are higher. Common trap: Picking the day with most laps without dividing."
    },
    {
      "id": "M2-Q2",
      "skill": "m-data",
      "prompt": "Total distance on Tuesday was",
      "choices": [
        "12 m",
        "300 m",
        "3 km",
        "2.5 km"
      ],
      "answer": 2,
      "explanation": "Use the note under the table. Evidence: 12 × 250 m = 3000 m = 3 km. Common trap: Ignoring the 250 m lap."
    },
    {
      "id": "M2-Q3",
      "skill": "m-data",
      "prompt": "Which statement is supported?",
      "choices": [
        "Monday had the most laps",
        "Tuesday and Thursday were the only days with 12 or more laps",
        "Thursday took longer per lap than Monday",
        "The four-day total is 40 laps"
      ],
      "answer": 1,
      "explanation": "Only those two rows are ≥ 12. Evidence: Tue 12 and Thu 15; Mon 8 and Wed 9. Common trap: Guessing a total."
    },
    {
      "id": "M2-Q4",
      "skill": "m-data",
      "prompt": "How many more laps were run on Thursday than on Monday?",
      "choices": [
        "7",
        "6",
        "8",
        "23"
      ],
      "answer": 0,
      "explanation": "Named rows only. Evidence: 15 − 8 = 7. Common trap: Adding instead of subtracting."
    },
    {
      "id": "M2-Q5",
      "skill": "m-word",
      "prompt": "A map scale is 1 cm to 5 km. Two towns are 4.6 cm apart on the map. Real distance is",
      "choices": [
        "4.6 km",
        "9.2 km",
        "23 km",
        "46 km"
      ],
      "answer": 2,
      "explanation": "Scale multiplies. Evidence: 4.6 × 5 = 23 km. Common trap: Forgetting the scale number."
    },
    {
      "id": "M2-Q6",
      "skill": "m-word",
      "prompt": "A juice mix is 2 parts cordial to 5 parts water. In 28 cups of mix, cordial is",
      "choices": [
        "8 cups",
        "10 cups",
        "4 cups",
        "14 cups"
      ],
      "answer": 0,
      "explanation": "Parts first. Evidence: 2+5=7 parts; 28÷7=4; 2×4=8. Common trap: 2:5 as 2/5 of the whole."
    },
    {
      "id": "M2-Q7",
      "skill": "m-word",
      "prompt": "A film starts at 4:50 pm and runs 1 hour 35 minutes. It ends at",
      "choices": [
        "6:15 pm",
        "6:25 pm",
        "5:85 pm",
        "6:20 pm"
      ],
      "answer": 1,
      "explanation": "Watch the 60-minute roll. Evidence: 4:50 + 1 h = 5:50; +35 = 6:25. Common trap: 50+35 = 85 minutes written as :85."
    }
  ]
};
