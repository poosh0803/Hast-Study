export default {
  "id": "AR3",
  "week": 1,
  "weekTitle": "Foundations",
  "title": "Complete the grid",
  "topic": "Complete the grid",
  "description": "A rule across AND a rule down. The missing cell must obey both.",
  "timeMinutes": 10,
  "passages": [
    {
      "label": "Method",
      "text": "Write the row rule in five words. Write the column rule in five words. Kill any option that breaks one of them."
    }
  ],
  "questions": [
    {
      "id": "AR3-Q1",
      "skill": "a-grid",
      "prompt": "In each row the number of dots rises by 1 left to right. In each column the fill goes white, grey, black down the page. The missing bottom-right cell should have",
      "choices": [
        "fewest dots, white",
        "most dots, black",
        "most dots, white",
        "fewest dots, black"
      ],
      "answer": 1,
      "explanation": "Both rules. Evidence: Right column = most dots. Bottom row = black. Common trap: Fitting only the row."
    },
    {
      "id": "AR3-Q2",
      "skill": "a-grid",
      "prompt": "Each row rotates a triangle 90° to the right. Each column adds one extra mark. The missing cell needs",
      "choices": [
        "the row’s next turn only",
        "the column’s extra mark only",
        "the next turn AND the extra mark",
        "a blank triangle"
      ],
      "answer": 2,
      "explanation": "Turn + mark. Evidence: Both directions. Common trap: One-direction option."
    },
    {
      "id": "AR3-Q3",
      "skill": "a-grid",
      "prompt": "Top row is small shapes. Bottom row is large shapes. Left column is circles. Right column is squares. Bottom-right is a",
      "choices": [
        "small circle",
        "large square",
        "large circle",
        "small square"
      ],
      "answer": 1,
      "explanation": "Size from row, type from column. Evidence: Bottom = large, right = square. Common trap: Copying a neighbour."
    },
    {
      "id": "AR3-Q4",
      "skill": "a-grid",
      "prompt": "A 2×2 grid: top-left striped, top-right plain, bottom-left plain. Bottom-right should be",
      "choices": [
        "plain",
        "striped",
        "blank",
        "spotted"
      ],
      "answer": 1,
      "explanation": "Checkerboard. Evidence: Each row and each column has one striped and one plain — like a checker. Common trap: Matching the cell beside it."
    },
    {
      "id": "AR3-Q5",
      "skill": "a-grid",
      "prompt": "Across: colour order blue, yellow, red. Down: shape order circle, square, triangle. The centre cell (middle of both) is a",
      "choices": [
        "blue circle",
        "yellow square",
        "red triangle",
        "yellow circle"
      ],
      "answer": 1,
      "explanation": "Both middle values. Evidence: Middle across = yellow. Middle down = square. Common trap: Using only the colour rule."
    },
    {
      "id": "AR3-Q6",
      "skill": "a-grid",
      "prompt": "Each row’s three frames add to 6 dots in total. A row already shows 1 and 2. The missing frame has",
      "choices": [
        "2 dots",
        "3 dots",
        "6 dots",
        "1 dot"
      ],
      "answer": 1,
      "explanation": "Row sum. Evidence: 1 + 2 + ? = 6, so 3. Common trap: Copying a visible count."
    },
    {
      "id": "AR3-Q7",
      "skill": "a-grid",
      "prompt": "If a row is ‘same, same, change’ and a column is ‘change every cell’, the last cell of a row that already has two identical grey squares is",
      "choices": [
        "another grey square",
        "a different shape or fill",
        "blank",
        "two squares"
      ],
      "answer": 1,
      "explanation": "Same-same-change. Evidence: The row must change on the third cell. Common trap: Making the whole row match."
    }
  ]
};
