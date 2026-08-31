export default {
  "id": "E1",
  "week": null,
  "weekTitle": null,
  "title": "Bonus · Noticeboard",
  "topic": "Bonus · Noticeboard",
  "description": "Short factual notice plus attitude questions.",
  "timeMinutes": 8,
  "passages": [
    {
      "label": "Club notice",
      "text": "Saturday training moves to the far oval from 5 April. The near oval is closed for drainage. Bring your own water. The canteen will not open until May. Players who cannot reach the far oval should message the coach by Thursday — not on Saturday morning at the gate.\n\nCoach R. Hall wrote at the bottom, in a different hand: “This is not a holiday. If you treat the far oval as optional, you are choosing the bench.”"
    }
  ],
  "questions": [
    {
      "id": "E1-Q1",
      "skill": "fact",
      "prompt": "Which statement is a rule-like judgement rather than a timetable fact?",
      "choices": [
        "Training moves from 5 April",
        "The near oval is closed for drainage",
        "Treating the far oval as optional means choosing the bench",
        "The canteen reopens in May"
      ],
      "answer": 2,
      "explanation": "Consequence framed as moral/sporting judgement. Evidence: Bottom note: choosing the bench. Common trap: Anything strict = opinion."
    },
    {
      "id": "E1-Q2",
      "skill": "infer",
      "prompt": "The instruction to message by Thursday implies the coach",
      "choices": [
        "will wait at the gate each Saturday",
        "needs time to plan around absences",
        "has closed the far oval",
        "does not want water bottles"
      ],
      "answer": 1,
      "explanation": "Late gate news is refused — planning window. Evidence: not on Saturday morning at the gate. Common trap: Tone drowning the planning reason."
    },
    {
      "id": "E1-Q3",
      "skill": "tone",
      "prompt": "The change of handwriting at the bottom mainly signals",
      "choices": [
        "a printer error",
        "a sharper personal warning after the logistics",
        "that the oval is open",
        "that May is cancelled"
      ],
      "answer": 1,
      "explanation": "Voice shifts from admin to warning. Evidence: different hand + “not a holiday.” Common trap: Ignoring the voice shift."
    },
    {
      "id": "E1-Q4",
      "skill": "infer",
      "prompt": "Players who only read the first three sentences would miss",
      "choices": [
        "the date of the move",
        "the drainage reason",
        "how to report a problem reaching the far oval, and the bench warning",
        "that water is BYO"
      ],
      "answer": 2,
      "explanation": "Skimming cost. Evidence: Message-by-Thursday and handwritten warning sit later. Common trap: Skim-and-guess."
    }
  ]
};
