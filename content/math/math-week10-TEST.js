export default {
  id: "M2",
  week: 10,
  weekTitle: "AI TEST",
  title: "Data, Graphs & Balances - TEST",
  topic: "Data & Measurement",
  tables: [
    {
      caption: "Monthly Rainfall (mm) — Riverton, 2024",
      columns: ["Month", "Jan", "Feb", "Mar", "Apr"],
      rows: [
        ["Rainfall", 32, 28, { text: 61, color: "blue" }, 45],
        ["Rainy days", 6, 5, { text: 11, color: "blue" }, 9],
      ],
    },
  ],
  charts: [
    {
      type: "bar",
      caption: "Average Monthly Rainfall by Season — Riverton",
      categories: ["Summer", "Autumn", "Winter", "Spring"],
      series: [
        { name: "2023", color: "#2563eb", values: [30, 55, 70, 40] },
        { name: "2024", color: "#f97316", values: [28, 61, 75, 45] },
      ],
    },
    {
      type: "scatter",
      caption: "Average Temperature vs Rainfall — Riverton, 2024",
      xLabel: "Average Temperature (°C)",
      yLabel: "Rainfall (mm)",
      series: [
        {
          name: "Months",
          color: "#0891b2",
          points: [
            { x: 28, y: 20 },
            { x: 24, y: 32 },
            { x: 18, y: 45 },
            { x: 12, y: 61 },
            { x: 10, y: 75 },
            { x: 15, y: 45 },
          ],
        },
      ],
    },
  ],
  diagrams: [
    {
      caption: "Weighing Puzzle: Find the value of x",
      totalMass: 24,
      massUnit: "kg",
      root: {
        children: [
          {
            shape: "square",
            color: "#3b82f6",
            label: "x",
          },
          {
            children: [
              { shape: "circle", color: "#10b981", label: "5 kg" },
              { shape: "circle", color: "#10b981", label: "5 kg" },
              { shape: "triangle", color: "#eab308", label: "4 kg" },
            ],
          },
        ],
      },
    },
  ],
  figures: [
    {
      caption: "Riverton rainfall gauge station",
      svg: '<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="220" fill="#eaf4fb"/><rect x="0" y="170" width="200" height="50" fill="#8bbf6f"/><rect x="95" y="90" width="10" height="90" fill="#8b5e34"/><polygon points="70,40 130,40 118,20 82,20" fill="#2563a8"/><rect x="75" y="40" width="50" height="70" rx="4" fill="#bfe3f0" stroke="#2563a8" stroke-width="2"/><rect x="77" y="85" width="46" height="23" fill="#5aa9d6"/><line x1="80" y1="55" x2="90" y2="55" stroke="#2563a8" stroke-width="1.5"/><line x1="80" y1="70" x2="90" y2="70" stroke="#2563a8" stroke-width="1.5"/><line x1="80" y1="85" x2="90" y2="85" stroke="#2563a8" stroke-width="1.5"/><line x1="80" y1="100" x2="90" y2="100" stroke="#2563a8" stroke-width="1.5"/></svg>',
    },
    {
      caption: "Rotation sequence — what comes next?",
      svg: '<svg viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="20" width="40" height="40" fill="#3b82f6"/><circle cx="42" cy="24" r="4" fill="#111827"/><rect x="90" y="20" width="40" height="40" fill="#3b82f6" transform="rotate(30 110 40)"/><circle cx="122" cy="24" r="4" fill="#111827" transform="rotate(30 110 40)"/><rect x="170" y="20" width="40" height="40" fill="#3b82f6" transform="rotate(60 190 40)"/><circle cx="202" cy="24" r="4" fill="#111827" transform="rotate(60 190 40)"/><rect x="250" y="20" width="40" height="40" fill="#3b82f6" transform="rotate(90 270 40)"/><circle cx="282" cy="24" r="4" fill="#111827" transform="rotate(90 270 40)"/></svg>',
    },
  ],
  questions: [
    {
      id: "M2-Q1",
      prompt:
        "Using the table above, what was the total rainfall (in mm) for January and March combined?",
      choices: ["73", "93", "77", "106"],
      answer: 1,
      explanation: "32 (Jan) + 61 (Mar) = 93 mm.",
    },
    {
      id: "M2-Q2",
      prompt:
        "Based on the scatter plot, as average temperature increases, rainfall tends to",
      choices: [
        "increase",
        "decrease",
        "stay exactly the same",
        "there is no relationship",
      ],
      answer: 1,
      explanation:
        "The points trend downward from left to right — higher temperatures are associated with lower rainfall in this data set.",
    },
    {
      id: "M2-Q3",
      prompt:
        "The balance above is level. The two circles are 5 kg each and the triangle is 4 kg. What is x?",
      choices: ["10 kg", "12 kg", "14 kg", "16 kg"],
      answer: 2,
      explanation:
        "The right side totals 5 + 5 + 4 = 14 kg. For the balance to be level, the left side (x) must also equal 14 kg.",
    },
    {
      id: "M2-Q4",
      prompt:
        "In the rotation sequence above, each square (with its dot) turns by the same angle each step. What is the next square's rotation from the first square?",
      choices: ["100°", "110°", "120°", "130°"],
      answer: 2,
      explanation:
        "Each step rotates 30° further (0°, 30°, 60°, 90°), so the next frame would be 120°.",
    },
  ],
};