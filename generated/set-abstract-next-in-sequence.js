export default {
  "id": "AR1",
  "week": 1,
  "weekTitle": "Foundations",
  "title": "Next in sequence",
  "topic": "Next in sequence",
  "description": "Name the change that happens every step. Then apply it once more.",
  "timeMinutes": 10,
  "passages": [
    {
      "label": "Method",
      "text": "Track two things: how many, and what turns or fills. The next frame must obey both."
    }
  ],
  "questions": [
    {
      "id": "AR1-Q1",
      "skill": "a-next",
      "prompt": "Dots increase by one each frame. Which is next?",
      "choices": [
        "3 dots",
        "4 dots",
        "5 dots",
        "2 dots"
      ],
      "answer": 2,
      "explanation": "Add one each time. Evidence: Frames show 2, then 3, then 4 dots — next is 5. Common trap: Copying the last frame."
    },
    {
      "id": "AR1-Q2",
      "skill": "a-next",
      "prompt": "A triangle turns a quarter-turn clockwise each step. After pointing up, right, down, it next points",
      "choices": [
        "up",
        "left",
        "right",
        "down"
      ],
      "answer": 1,
      "explanation": "90° clockwise. Evidence: Up → right → down → left. Common trap: Turning the other way."
    },
    {
      "id": "AR1-Q3",
      "skill": "a-next",
      "prompt": "Squares go white, grey, black, white, grey, … The next fill is",
      "choices": [
        "white",
        "grey",
        "black",
        "striped"
      ],
      "answer": 2,
      "explanation": "White-grey-black repeats. Evidence: The cycle is three fills long. Common trap: Treating it as only two colours."
    },
    {
      "id": "AR1-Q4",
      "skill": "a-next",
      "prompt": "Each step adds one side: triangle, then square, then pentagon. Next is a",
      "choices": [
        "hexagon",
        "circle",
        "triangle",
        "blank"
      ],
      "answer": 0,
      "explanation": "A hexagon has six sides. Evidence: Sides 3, 4, 5 → 6. Common trap: Skipping from 5 sides to 0 or back to 3."
    },
    {
      "id": "AR1-Q5",
      "skill": "a-next",
      "prompt": "A dot starts at top-left and walks clockwise around the four corners. After TL, TR, BR, next is",
      "choices": [
        "top-left",
        "bottom-left",
        "centre",
        "top-right"
      ],
      "answer": 1,
      "explanation": "Clockwise corners. Evidence: TL → TR → BR → BL. Common trap: Diagonal jump."
    },
    {
      "id": "AR1-Q6",
      "skill": "a-next",
      "prompt": "Each frame keeps the previous shapes and adds a new circle. After 1, then 2, then 3 circles, next has",
      "choices": [
        "2",
        "3",
        "4",
        "1"
      ],
      "answer": 2,
      "explanation": "3 + 1 = 4. Evidence: Accumulate, do not replace. Common trap: Resetting the count."
    },
    {
      "id": "AR1-Q7",
      "skill": "a-next",
      "prompt": "Shading moves one stripe down a flag of three bands: top shaded, then middle, then bottom. Next is",
      "choices": [
        "top again",
        "all three",
        "middle",
        "none"
      ],
      "answer": 0,
      "explanation": "Top-middle-bottom-top. Evidence: A 3-step cycle returns to the top. Common trap: Inventing a new pattern after three."
    },
    {
      "id": "AR1-Q8",
      "skill": "a-next",
      "prompt": "Arrows flip between left and right AND grow: small-left, small-right, big-left, … Next is",
      "choices": [
        "small-left",
        "big-right",
        "big-left",
        "small-right"
      ],
      "answer": 1,
      "explanation": "After big-left comes big-right. Evidence: Flip every step; size changes every two. Common trap: Tracking only the flip."
    }
  ]
};
