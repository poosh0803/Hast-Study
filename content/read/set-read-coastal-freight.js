export default {
  "id": "D3b",
  "week": null,
  "weekTitle": null,
  "title": "Coastal freight",
  "topic": "Coastal freight",
  "description": "A simple route map in words. Least ocean + most direct.",
  "timeMinutes": 10,
  "passages": [
    {
      "label": "Routes",
      "text": "Ports: Darwin (north), Broome (north-west), Perth (south-west), Adelaide (south), Hobart (south island), Brisbane (east), Cairns (north-east).\n\nCoastal shipping lines: a west-coast line Perth–Broome–Darwin; an east-coast line Hobart–Brisbane–Cairns; a southern line Perth–Adelaide–Hobart.\n\nOverland rail: Perth–Adelaide; Adelaide–Brisbane (via inland hubs). There is no direct rail Darwin–Cairns in this diagram.\n\nA trader in Darwin wants goods in Hobart with as little ocean time as possible, but the goods may change to rail."
    }
  ],
  "questions": [
    {
      "id": "D3b-Q1",
      "skill": "table",
      "prompt": "The route that uses the least ocean for Darwin to Hobart is",
      "choices": [
        "Darwin ship all the way around to Hobart via Cairns and Brisbane",
        "Darwin ship to Perth, rail Perth to Adelaide, ship Adelaide to Hobart",
        "Darwin ship to Broome only and stop",
        "Darwin ship to Cairns, then no further line"
      ],
      "answer": 1,
      "explanation": "Ocean is only Darwin–Perth plus Adelaide–Hobart. All-sea eastabout is longer ocean. Evidence: West line Darwin–Broome–Perth; rail Perth–Adelaide; short southern ship Adelaide–Hobart. Common trap: Picking the famous east-coast cities."
    },
    {
      "id": "D3b-Q2",
      "skill": "table",
      "prompt": "Which port sits on both a coastal shipping line and the Perth–Adelaide rail?",
      "choices": [
        "Cairns",
        "Darwin",
        "Perth",
        "Brisbane"
      ],
      "answer": 2,
      "explanation": "Perth is the hinge. Evidence: Perth is on west-coast shipping and on Perth–Adelaide rail. Common trap: Confusing Brisbane’s rail with Perth’s."
    },
    {
      "id": "D3b-Q3",
      "skill": "infer",
      "prompt": "The diagram most clearly does not allow",
      "choices": [
        "goods to travel Perth to Adelaide by land",
        "a ship from Hobart toward Brisbane",
        "a direct rail Darwin to Cairns",
        "a ship along the west coast"
      ],
      "answer": 2,
      "explanation": "Stated absence. Evidence: “There is no direct rail Darwin–Cairns in this diagram.” Common trap: Missing the explicit ‘no’ sentence."
    },
    {
      "id": "D3b-Q4",
      "skill": "infer",
      "prompt": "A trader who refused all rail would have to",
      "choices": [
        "leave the goods in Darwin",
        "use only coastal shipping and accept more ocean time",
        "fly, which the map provides",
        "use the inland hubs without ships"
      ],
      "answer": 1,
      "explanation": "Policy choice + available modes. Evidence: All listed land links are rail. Without rail, only the shipping lines remain. Common trap: Inventing planes."
    }
  ]
};
