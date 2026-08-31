export default {
  "id": "M1",
  "week": 4,
  "weekTitle": "Exam Practice",
  "title": "Patterns & number",
  "topic": "Patterns & number",
  "description": "Find the rule that survives every term. No calculator.",
  "timeMinutes": 12,
  "questions": [
    {
      "id": "M1-Q1",
      "skill": "m-seq",
      "prompt": "The sequence is 5, 8, 14, 26, 50, … What is the next term?",
      "choices": [
        "74",
        "76",
        "98",
        "100"
      ],
      "answer": 2,
      "explanation": "50 + 48 = 98. Evidence: Jumps +3, +6, +12, +24 — the jump doubles. Common trap: Adding the first jump forever."
    },
    {
      "id": "M1-Q2",
      "skill": "m-seq",
      "prompt": "In 81, 27, 9, 3, … the missing next term is",
      "choices": [
        "1",
        "0",
        "2",
        "6"
      ],
      "answer": 0,
      "explanation": "3 ÷ 3 = 1. Evidence: Each term is divided by 3. Common trap: Subtracting 54 each time (81−27)."
    },
    {
      "id": "M1-Q3",
      "skill": "m-word",
      "prompt": "A box holds 48 fruit. 3/8 are apples. How many are not apples?",
      "choices": [
        "18",
        "30",
        "16",
        "24"
      ],
      "answer": 1,
      "explanation": "48 − 18 = 30. Evidence: 3/8 of 48 = 18 apples, so 30 are not. Common trap: Answering the first fraction you compute."
    },
    {
      "id": "M1-Q4",
      "skill": "m-word",
      "prompt": "Tristan has $35. A book is $18 and a pen is $4. He buys two pens and the book. How much is left?",
      "choices": [
        "$9",
        "$13",
        "$17",
        "$8"
      ],
      "answer": 0,
      "explanation": "Two pens, not one. Evidence: 18 + 8 = 26; 35 − 26 = 9. Common trap: Buying one pen."
    },
    {
      "id": "M1-Q5",
      "skill": "m-word",
      "prompt": "A tank is 2/5 full. After 9 litres are poured in it is 3/5 full. The tank’s capacity is",
      "choices": [
        "15 L",
        "27 L",
        "45 L",
        "90 L"
      ],
      "answer": 2,
      "explanation": "1/5 = 9 so whole = 45. Evidence: The extra 9 L is 1/5 of the tank. Common trap: Treating 9 L as 2/5."
    },
    {
      "id": "M1-Q6",
      "skill": "m-seq",
      "prompt": "Odd-one-out: 16, 25, 36, 48, 49. Which does not belong?",
      "choices": [
        "16",
        "25",
        "48",
        "49"
      ],
      "answer": 2,
      "explanation": "48 is not a square. Evidence: The others are square numbers. Common trap: Picking the largest."
    },
    {
      "id": "M1-Q7",
      "skill": "m-word",
      "prompt": "A ribbon 2.4 m long is cut into 30 cm pieces. How many pieces?",
      "choices": [
        "8",
        "12",
        "6",
        "80"
      ],
      "answer": 0,
      "explanation": "Same units first. Evidence: 240 cm ÷ 30 = 8. Common trap: Mixing m and cm."
    },
    {
      "id": "M1-Q8",
      "skill": "m-word",
      "prompt": "The average of 6, 10 and x is 11. x is",
      "choices": [
        "11",
        "17",
        "15",
        "13"
      ],
      "answer": 1,
      "explanation": "6 + 10 + x = 33. Evidence: Sum of three scores = 33, so x = 17. Common trap: Thinking the average is one of the scores."
    }
  ]
};
