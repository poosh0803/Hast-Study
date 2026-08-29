export default {
  "id": "D6b",
  "week": null,
  "weekTitle": null,
  "title": "Wind farm map (text)",
  "topic": "Wind farm map (text)",
  "description": "Resource map in words. Symbol meaning + variety by region.",
  "timeMinutes": 8,
  "passages": [
    {
      "label": "Inland energy sketch",
      "text": "A state sketch marks: black dots = operating wind turbines (dot size = capacity); empty circles = approved but not built; grey squares = substations; ship icons on the one coastal edge = export ports for leftover manufactured blades (not for electricity).\n\nNorth ridge: many small black dots, two empty circles, one square.\nCentral plain: three large black dots, no empty circles, two squares.\nSouth valley: one small black dot, six empty circles, no square.\nCoast: two ship icons, no turbines."
    }
  ],
  "questions": [
    {
      "id": "D6b-Q1",
      "skill": "infer",
      "prompt": "The empty circles suggest",
      "choices": [
        "turbines that have already worn out",
        "projects allowed but not yet standing",
        "substations",
        "export ports"
      ],
      "answer": 1,
      "explanation": "Permission without steel in the ground. Evidence: approved but not built. Common trap: Empty = dead."
    },
    {
      "id": "D6b-Q2",
      "skill": "infer",
      "prompt": "Ship icons on this map most likely stand for",
      "choices": [
        "places electricity is generated",
        "trade in physical equipment",
        "offshore turbines",
        "national parks"
      ],
      "answer": 1,
      "explanation": "Goods, not current. Evidence: export ports for leftover manufactured blades (not for electricity). Common trap: Ships = power stations."
    },
    {
      "id": "D6b-Q3",
      "skill": "table",
      "prompt": "Which region has the widest mix of marked features (built wind, unbuilt wind, and a substation)?",
      "choices": [
        "Central plain",
        "South valley",
        "North ridge",
        "Coast"
      ],
      "answer": 2,
      "explanation": "All three types present. Evidence: North: small dots + empty circles + square. Common trap: Largest dots = widest variety."
    },
    {
      "id": "D6b-Q4",
      "skill": "infer",
      "prompt": "The sketch most strongly suggests the south valley is",
      "choices": [
        "already the biggest generator",
        "planned as a future build-out with little support kit yet",
        "a port",
        "empty of all planning"
      ],
      "answer": 1,
      "explanation": "Lots approved, almost none built, no substation. Evidence: One small dot, six empty circles, no square. Common trap: Empty circles as emptiness."
    }
  ]
};
