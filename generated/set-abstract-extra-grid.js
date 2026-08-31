export default {
  "id": "AR6",
  "week": 1,
  "weekTitle": "Foundations",
  "title": "Extra grid",
  "topic": "Extra grid",
  "description": "Original extra abstract. Name two features.",
  "timeMinutes": 10,
  "passages": [
    {
      "label": "Hunt",
      "text": "Track count, fill, turn, or place. The answer obeys both rules you named."
    }
  ],
  "questions": [
    {
      "id": "AR6-Q1",
      "skill": "a-grid",
      "prompt": "Row adds 1 stripe. Column darkens. Missing bottom-right needs",
      "choices": [
        "no stripe, pale",
        "most stripes, darkest",
        "most stripes, pale",
        "no stripe, dark"
      ],
      "answer": 1,
      "explanation": "both rules Evidence: right = most, bottom = darkest Common trap: Fitting only one direction."
    },
    {
      "id": "AR6-Q2",
      "skill": "a-grid",
      "prompt": "Rows are small/medium/large. Columns are circle/square/triangle. Centre is a",
      "choices": [
        "small circle",
        "medium square",
        "large triangle",
        "medium circle"
      ],
      "answer": 1,
      "explanation": "medium square Evidence: mid size + mid type Common trap: Fitting only one direction."
    },
    {
      "id": "AR6-Q3",
      "skill": "a-grid",
      "prompt": "Each row sums to 9 marks. A row shows 2 and 3. Missing has",
      "choices": [
        "2",
        "4",
        "9",
        "5"
      ],
      "answer": 1,
      "explanation": "4 Evidence: 2+3+?=9 so 4 Common trap: Fitting only one direction."
    },
    {
      "id": "AR6-Q4",
      "skill": "a-grid",
      "prompt": "Checker: stripe/plain alternate both ways. TL striped, TR plain, BL plain. BR is",
      "choices": [
        "plain",
        "striped",
        "blank",
        "spotted"
      ],
      "answer": 1,
      "explanation": "striped Evidence: checker Common trap: Fitting only one direction."
    },
    {
      "id": "AR6-Q5",
      "skill": "a-grid",
      "prompt": "Row rule same-same-change. Two grey squares already sit left and mid. The right cell is",
      "choices": [
        "grey square",
        "something else",
        "two squares",
        "blank always"
      ],
      "answer": 1,
      "explanation": "different Evidence: must change Common trap: Fitting only one direction."
    },
    {
      "id": "AR6-Q6",
      "skill": "a-grid",
      "prompt": "Column rule: add a tail. Row rule: flip fill. Missing needs",
      "choices": [
        "tail only",
        "flip only",
        "tail and flip",
        "neither"
      ],
      "answer": 2,
      "explanation": "both Evidence: both directions Common trap: Fitting only one direction."
    },
    {
      "id": "AR6-Q7",
      "skill": "a-grid",
      "prompt": "Top row blue shapes. Bottom row red. Left column hollow. Right column solid. Bottom-right is",
      "choices": [
        "blue hollow",
        "red solid",
        "red hollow",
        "blue solid"
      ],
      "answer": 1,
      "explanation": "red solid Evidence: bottom red + right solid Common trap: Fitting only one direction."
    },
    {
      "id": "AR6-Q8",
      "skill": "a-grid",
      "prompt": "If every row’s third cell is the first two combined, and cells are A then B, missing is",
      "choices": [
        "A",
        "B",
        "A+B",
        "empty"
      ],
      "answer": 2,
      "explanation": "A+B Evidence: combine Common trap: Fitting only one direction."
    }
  ]
};
