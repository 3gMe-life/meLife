/**
 * Official 3G MeLife Skill Finder (Ages 10-13) Assessment Catalog Data
 * Extracted directly from validated psychometric pilot workbook v0.3
 */

export const SKILL_FINDER_SECTIONS = [
  {
    "code": "SECTION_A",
    "name": "Section A \u2014 Interest Discovery",
    "description": "Explores primary vocational and learning interests across the 6 RIASEC domains (Builder, Explorer, Creator, Helper, Leader, Organiser).",
    "displayOrder": 1
  },
  {
    "code": "SECTION_B",
    "name": "Section B \u2014 Skill Behaviour",
    "description": "Assesses self-reported problem-solving instincts, communication, creative thinking, spatial aptitude, and self-management.",
    "displayOrder": 2
  },
  {
    "code": "SECTION_C",
    "name": "Section C \u2014 Demonstrated Aptitude",
    "description": "Engaging cognitive reasoning, numerical, verbal, spatial rotation, paper-folding, and creative challenge tasks.",
    "displayOrder": 3
  },
  {
    "code": "SECTION_D",
    "name": "Section D \u2014 Developmental Strengths",
    "description": "Measures core learning habits including curiosity, persistence, adaptability, collaboration, and learning independence.",
    "displayOrder": 4
  },
  {
    "code": "SECTION_E",
    "name": "Section E \u2014 Response Quality",
    "description": "Response consistency and validity indicators to ensure reliability of results.",
    "displayOrder": 5
  }
];

export const SKILL_FINDER_QUESTIONS = [
  {
    "questionNumber": 1,
    "sectionCode": "SECTION_A",
    "dimensionCode": "BUILDER_R",
    "dimensionName": "Builder (R)",
    "questionText": "I enjoy building, assembling or fixing things.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": null,
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 2,
    "sectionCode": "SECTION_A",
    "dimensionCode": "EXPLORER_I",
    "dimensionName": "Explorer (I)",
    "questionText": "I like finding out why things happen and how they work.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": null,
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 3,
    "sectionCode": "SECTION_A",
    "dimensionCode": "CREATOR_A",
    "dimensionName": "Creator (A)",
    "questionText": "I enjoy creating drawings, designs, stories, videos or other original work.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": null,
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 4,
    "sectionCode": "SECTION_A",
    "dimensionCode": "HELPER_S",
    "dimensionName": "Helper (S)",
    "questionText": "I enjoy helping someone who is having difficulty.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": null,
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 5,
    "sectionCode": "SECTION_A",
    "dimensionCode": "LEADER_E",
    "dimensionName": "Leader (E)",
    "questionText": "I like taking the lead when a group needs to make a decision.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 6,
    "sectionCode": "SECTION_A",
    "dimensionCode": "ORGANISER_C",
    "dimensionName": "Organiser (C)",
    "questionText": "I enjoy arranging things neatly and keeping information organised.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 7,
    "sectionCode": "SECTION_A",
    "dimensionCode": "BUILDER_R",
    "dimensionName": "Builder (R)",
    "questionText": "I would enjoy using tools, equipment or practical materials to make something.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 8,
    "sectionCode": "SECTION_A",
    "dimensionCode": "EXPLORER_I",
    "dimensionName": "Explorer (I)",
    "questionText": "I like experiments, investigations and discovering answers.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 9,
    "sectionCode": "SECTION_A",
    "dimensionCode": "CREATOR_A",
    "dimensionName": "Creator (A)",
    "questionText": "I enjoy imagining new designs, stories, characters or ideas.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 10,
    "sectionCode": "SECTION_A",
    "dimensionCode": "HELPER_S",
    "dimensionName": "Helper (S)",
    "questionText": "I enjoy explaining things so another person can understand.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 11,
    "sectionCode": "SECTION_A",
    "dimensionCode": "LEADER_E",
    "dimensionName": "Leader (E)",
    "questionText": "I enjoy presenting an idea and encouraging others to support it.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 12,
    "sectionCode": "SECTION_A",
    "dimensionCode": "ORGANISER_C",
    "dimensionName": "Organiser (C)",
    "questionText": "I enjoy making lists, schedules or plans.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 13,
    "sectionCode": "SECTION_A",
    "dimensionCode": "BUILDER_R",
    "dimensionName": "Builder (R)",
    "questionText": "I enjoy activities where I can build, repair, assemble or work with real objects.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 14,
    "sectionCode": "SECTION_A",
    "dimensionCode": "EXPLORER_I",
    "dimensionName": "Explorer (I)",
    "questionText": "I enjoy difficult puzzles and problems that make me think.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 15,
    "sectionCode": "SECTION_A",
    "dimensionCode": "CREATOR_A",
    "dimensionName": "Creator (A)",
    "questionText": "I enjoy thinking of new or unusual ways to do things.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 16,
    "sectionCode": "SECTION_A",
    "dimensionCode": "HELPER_S",
    "dimensionName": "Helper (S)",
    "questionText": "I like working with people and helping a team succeed.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 17,
    "sectionCode": "SECTION_A",
    "dimensionCode": "LEADER_E",
    "dimensionName": "Leader (E)",
    "questionText": "I would enjoy starting a small project, club or team activity.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 18,
    "sectionCode": "SECTION_A",
    "dimensionCode": "ORGANISER_C",
    "dimensionName": "Organiser (C)",
    "questionText": "I like checking information and making sure things are in the right place.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 19,
    "sectionCode": "SECTION_A",
    "dimensionCode": "BUILDER_R",
    "dimensionName": "Builder (R)",
    "questionText": "I enjoy practical outdoor activities such as making, growing, caring for or improving things.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 20,
    "sectionCode": "SECTION_A",
    "dimensionCode": "EXPLORER_I",
    "dimensionName": "Explorer (I)",
    "questionText": "When I do not know an answer, I enjoy searching for information to solve it.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 21,
    "sectionCode": "SECTION_A",
    "dimensionCode": "CREATOR_A",
    "dimensionName": "Creator (A)",
    "questionText": "I enjoy expressing ideas through art, design, writing, music, performance or media.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 22,
    "sectionCode": "SECTION_A",
    "dimensionCode": "HELPER_S",
    "dimensionName": "Helper (S)",
    "questionText": "I enjoy listening to people and helping them feel supported.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 23,
    "sectionCode": "SECTION_A",
    "dimensionCode": "LEADER_E",
    "dimensionName": "Leader (E)",
    "questionText": "I enjoy organising people so a group can reach a goal.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 24,
    "sectionCode": "SECTION_A",
    "dimensionCode": "ORGANISER_C",
    "dimensionName": "Organiser (C)",
    "questionText": "I enjoy following a clear system so a task is completed correctly.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 25,
    "sectionCode": "SECTION_A",
    "dimensionCode": "BUILDER_R",
    "dimensionName": "Builder (R)",
    "questionText": "I enjoy taking simple objects apart or examining them to understand how they work.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 26,
    "sectionCode": "SECTION_A",
    "dimensionCode": "EXPLORER_I",
    "dimensionName": "Explorer (I)",
    "questionText": "I like comparing clues or evidence before deciding on an answer.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 27,
    "sectionCode": "SECTION_A",
    "dimensionCode": "CREATOR_A",
    "dimensionName": "Creator (A)",
    "questionText": "I enjoy changing or improving something so it feels more original or expressive.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 28,
    "sectionCode": "SECTION_A",
    "dimensionCode": "HELPER_S",
    "dimensionName": "Helper (S)",
    "questionText": "I would enjoy teaching or guiding a younger student in something I know.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 29,
    "sectionCode": "SECTION_A",
    "dimensionCode": "LEADER_E",
    "dimensionName": "Leader (E)",
    "questionText": "I am interested in making decisions and taking responsibility for a group task.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 30,
    "sectionCode": "SECTION_A",
    "dimensionCode": "ORGANISER_C",
    "dimensionName": "Organiser (C)",
    "questionText": "I enjoy sorting records, collections or information into a useful order.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 31,
    "sectionCode": "SECTION_B",
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "dimensionName": "Logical & Problem-Solving",
    "questionText": "When I have a difficult problem, I can break it into smaller steps.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 32,
    "sectionCode": "SECTION_B",
    "dimensionCode": "COMMUNICATION",
    "dimensionName": "Communication",
    "questionText": "I can explain an idea clearly so another person understands it.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 33,
    "sectionCode": "SECTION_B",
    "dimensionCode": "CREATIVE_THINKING",
    "dimensionName": "Creative Thinking",
    "questionText": "I can usually think of more than one solution to a problem.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 34,
    "sectionCode": "SECTION_B",
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "dimensionName": "Visual-Spatial Thinking",
    "questionText": "I can imagine how something might look before it is built or drawn.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 35,
    "sectionCode": "SECTION_B",
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "dimensionName": "Practical & Technical Skill",
    "questionText": "I can follow steps to build, test or assemble a simple object or project.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 36,
    "sectionCode": "SECTION_B",
    "dimensionCode": "SOCIAL_TEAMWORK",
    "dimensionName": "Social & Teamwork",
    "questionText": "I can usually notice when another person is uncomfortable, upset or left out.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 37,
    "sectionCode": "SECTION_B",
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "dimensionName": "Leadership & Initiative",
    "questionText": "When a group does not know how to begin, I can help everyone get started.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 38,
    "sectionCode": "SECTION_B",
    "dimensionCode": "SELF_MANAGEMENT",
    "dimensionName": "Self-Management",
    "questionText": "I can organise my work when I have several things to finish.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 39,
    "sectionCode": "SECTION_B",
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "dimensionName": "Logical & Problem-Solving",
    "questionText": "If my first solution does not work, I can try a different approach.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 40,
    "sectionCode": "SECTION_B",
    "dimensionCode": "COMMUNICATION",
    "dimensionName": "Communication",
    "questionText": "I can tell or write information in a clear order.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 41,
    "sectionCode": "SECTION_B",
    "dimensionCode": "CREATIVE_THINKING",
    "dimensionName": "Creative Thinking",
    "questionText": "I can often think of a new way to improve or use an ordinary idea.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 42,
    "sectionCode": "SECTION_B",
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "dimensionName": "Visual-Spatial Thinking",
    "questionText": "Maps, diagrams, shapes and layouts are usually easy for me to understand.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 43,
    "sectionCode": "SECTION_B",
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "dimensionName": "Practical & Technical Skill",
    "questionText": "When a simple device does not work, I can think of sensible things to check first.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 44,
    "sectionCode": "SECTION_B",
    "dimensionCode": "SOCIAL_TEAMWORK",
    "dimensionName": "Social & Teamwork",
    "questionText": "I work well with people who have different ideas from mine.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 45,
    "sectionCode": "SECTION_B",
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "dimensionName": "Leadership & Initiative",
    "questionText": "I can encourage other people to work toward a shared goal.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 46,
    "sectionCode": "SECTION_B",
    "dimensionCode": "SELF_MANAGEMENT",
    "dimensionName": "Self-Management",
    "questionText": "I can keep working even when there are distractions around me.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 47,
    "sectionCode": "SECTION_B",
    "dimensionCode": "LOGICAL_PROBLEM_SOLVING",
    "dimensionName": "Logical & Problem-Solving",
    "questionText": "Before choosing a solution, I can compare different options and think about what may happen.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 48,
    "sectionCode": "SECTION_B",
    "dimensionCode": "COMMUNICATION",
    "dimensionName": "Communication",
    "questionText": "When I do not understand someone, I can ask questions to make the meaning clearer.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 49,
    "sectionCode": "SECTION_B",
    "dimensionCode": "CREATIVE_THINKING",
    "dimensionName": "Creative Thinking",
    "questionText": "I can connect ideas from different places to create something new.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 50,
    "sectionCode": "SECTION_B",
    "dimensionCode": "VISUAL_SPATIAL_THINKING",
    "dimensionName": "Visual-Spatial Thinking",
    "questionText": "I can mentally picture where parts, shapes or objects would fit together.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 51,
    "sectionCode": "SECTION_B",
    "dimensionCode": "PRACTICAL_TECHNICAL_SKILL",
    "dimensionName": "Practical & Technical Skill",
    "questionText": "I can use simple tools or materials carefully and follow safety instructions.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 52,
    "sectionCode": "SECTION_B",
    "dimensionCode": "SOCIAL_TEAMWORK",
    "dimensionName": "Social & Teamwork",
    "questionText": "I can share tasks fairly and contribute my part when working in a team.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 53,
    "sectionCode": "SECTION_B",
    "dimensionCode": "LEADERSHIP_INITIATIVE",
    "dimensionName": "Leadership & Initiative",
    "questionText": "If something useful needs to be done, I can suggest a next step instead of waiting for someone else.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 54,
    "sectionCode": "SECTION_B",
    "dimensionCode": "SELF_MANAGEMENT",
    "dimensionName": "Self-Management",
    "questionText": "I can plan my time so important school tasks are finished by their deadline.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 55,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PATTERN_LOGIC",
    "dimensionName": "Pattern & Logic",
    "questionText": "What comes next? 2, 5, 11, 23, 47, ?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "72",
        "score": 0
      },
      {
        "key": "B",
        "text": "83",
        "score": 0
      },
      {
        "key": "C",
        "text": "95",
        "score": 0
      },
      {
        "key": "D",
        "text": "96",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 56,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PATTERN_LOGIC",
    "dimensionName": "Pattern & Logic",
    "questionText": "All Rinos are blue. No blue object is yellow. Which must be true?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Some Rinos are yellow",
        "score": 0
      },
      {
        "key": "B",
        "text": "No Rino is yellow",
        "score": 0
      },
      {
        "key": "C",
        "text": "All yellow things are Rinos",
        "score": 0
      },
      {
        "key": "D",
        "text": "We cannot know anything about Rinos",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 57,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PATTERN_LOGIC",
    "dimensionName": "Pattern & Logic",
    "questionText": "IMAGE QUESTION \u2014 Study the visual sequence and choose the symbol that comes next.",
    "questionType": "mcq_image",
    "imageUrl": "/uploads/assessments/skill-finder/q57_pattern_sequence.png",
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Option A",
        "score": 0
      },
      {
        "key": "B",
        "text": "Option B",
        "score": 0
      },
      {
        "key": "C",
        "text": "Option C",
        "score": 0
      },
      {
        "key": "D",
        "text": "Option D",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 58,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PATTERN_LOGIC",
    "dimensionName": "Pattern & Logic",
    "questionText": "IMAGE QUESTION \u2014 Study the visual matrix and choose the missing box.",
    "questionType": "mcq_image",
    "imageUrl": "/uploads/assessments/skill-finder/q58_pattern_matrix.png",
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Option A",
        "score": 0
      },
      {
        "key": "B",
        "text": "Option B",
        "score": 0
      },
      {
        "key": "C",
        "text": "Option C",
        "score": 0
      },
      {
        "key": "D",
        "text": "Option D",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 59,
    "sectionCode": "SECTION_C",
    "dimensionCode": "NUMERICAL_REASONING",
    "dimensionName": "Numerical Reasoning",
    "questionText": "A box contains 24 pencils. One-third are red. How many red pencils?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "6",
        "score": 0
      },
      {
        "key": "B",
        "text": "8",
        "score": 0
      },
      {
        "key": "C",
        "text": "12",
        "score": 0
      },
      {
        "key": "D",
        "text": "16",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 60,
    "sectionCode": "SECTION_C",
    "dimensionCode": "NUMERICAL_REASONING",
    "dimensionName": "Numerical Reasoning",
    "questionText": "Four notebooks cost \u20b9120. At the same price, how much do seven notebooks cost?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "\u20b9180",
        "score": 0
      },
      {
        "key": "B",
        "text": "\u20b9190",
        "score": 0
      },
      {
        "key": "C",
        "text": "\u20b9210",
        "score": 0
      },
      {
        "key": "D",
        "text": "\u20b9240",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 61,
    "sectionCode": "SECTION_C",
    "dimensionCode": "NUMERICAL_REASONING",
    "dimensionName": "Numerical Reasoning",
    "questionText": "Three-fifths of 40 students joined a club. How many students joined?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "18",
        "score": 0
      },
      {
        "key": "B",
        "text": "20",
        "score": 0
      },
      {
        "key": "C",
        "text": "24",
        "score": 0
      },
      {
        "key": "D",
        "text": "30",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 62,
    "sectionCode": "SECTION_C",
    "dimensionCode": "NUMERICAL_REASONING",
    "dimensionName": "Numerical Reasoning",
    "questionText": "Six identical stickers cost \u20b990. At the same price, how much do ten stickers cost?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "D",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "\u20b9120",
        "score": 0
      },
      {
        "key": "B",
        "text": "\u20b9135",
        "score": 0
      },
      {
        "key": "C",
        "text": "\u20b9140",
        "score": 0
      },
      {
        "key": "D",
        "text": "\u20b9150",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 63,
    "sectionCode": "SECTION_C",
    "dimensionCode": "VERBAL_REASONING",
    "dimensionName": "Verbal Reasoning",
    "questionText": "BOOK is related to READING. FORK is related to:",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Drawing",
        "score": 0
      },
      {
        "key": "B",
        "text": "Eating",
        "score": 0
      },
      {
        "key": "C",
        "text": "Running",
        "score": 0
      },
      {
        "key": "D",
        "text": "Writing",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 64,
    "sectionCode": "SECTION_C",
    "dimensionCode": "VERBAL_REASONING",
    "dimensionName": "Verbal Reasoning",
    "questionText": "Arun said: 'The football field is wet because it rained heavily during the night.' Which statement is supported?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Arun played during rain",
        "score": 0
      },
      {
        "key": "B",
        "text": "Heavy rain happened during the night",
        "score": 0
      },
      {
        "key": "C",
        "text": "The field is always wet",
        "score": 0
      },
      {
        "key": "D",
        "text": "The match was cancelled",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 65,
    "sectionCode": "SECTION_C",
    "dimensionCode": "VERBAL_REASONING",
    "dimensionName": "Verbal Reasoning",
    "questionText": "GLOVE is related to HAND. SHOE is related to:",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Head",
        "score": 0
      },
      {
        "key": "B",
        "text": "Arm",
        "score": 0
      },
      {
        "key": "C",
        "text": "Foot",
        "score": 0
      },
      {
        "key": "D",
        "text": "Knee",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 66,
    "sectionCode": "SECTION_C",
    "dimensionCode": "VERBAL_REASONING",
    "dimensionName": "Verbal Reasoning",
    "questionText": "Maya finished her library book before Friday because she wanted to return it on time. Which is best supported?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Maya dislikes reading",
        "score": 0
      },
      {
        "key": "B",
        "text": "Maya lost the book",
        "score": 0
      },
      {
        "key": "C",
        "text": "Maya paid attention to the return deadline",
        "score": 0
      },
      {
        "key": "D",
        "text": "The library closes on Friday",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 67,
    "sectionCode": "SECTION_C",
    "dimensionCode": "SPATIAL_REASONING",
    "dimensionName": "Spatial Reasoning",
    "questionText": "You are facing North. Turn right, then left, then left again. Which direction are you facing?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "D",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "North",
        "score": 0
      },
      {
        "key": "B",
        "text": "South",
        "score": 0
      },
      {
        "key": "C",
        "text": "East",
        "score": 0
      },
      {
        "key": "D",
        "text": "West",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 68,
    "sectionCode": "SECTION_C",
    "dimensionCode": "SPATIAL_REASONING",
    "dimensionName": "Spatial Reasoning",
    "questionText": "IMAGE QUESTION \u2014 Which option shows the same marked figure after rotation only, not a mirror image?",
    "questionType": "mcq_image",
    "imageUrl": "/uploads/assessments/skill-finder/q68_spatial_rotation.png",
    "correctKey": "D",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Option A",
        "score": 0
      },
      {
        "key": "B",
        "text": "Option B",
        "score": 0
      },
      {
        "key": "C",
        "text": "Option C",
        "score": 0
      },
      {
        "key": "D",
        "text": "Option D",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 69,
    "sectionCode": "SECTION_C",
    "dimensionCode": "SPATIAL_REASONING",
    "dimensionName": "Spatial Reasoning",
    "questionText": "IMAGE QUESTION \u2014 A paper is folded and punched. Which hole pattern appears after opening?",
    "questionType": "mcq_image",
    "imageUrl": "/uploads/assessments/skill-finder/q69_spatial_paperfold.png",
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Option A",
        "score": 0
      },
      {
        "key": "B",
        "text": "Option B",
        "score": 0
      },
      {
        "key": "C",
        "text": "Option C",
        "score": 0
      },
      {
        "key": "D",
        "text": "Option D",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 70,
    "sectionCode": "SECTION_C",
    "dimensionCode": "SPATIAL_REASONING",
    "dimensionName": "Spatial Reasoning",
    "questionText": "A robot starts at the centre of a grid, moves 2 squares East and then 1 square North. Where is it compared with the start?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "South-West",
        "score": 0
      },
      {
        "key": "B",
        "text": "North-West",
        "score": 0
      },
      {
        "key": "C",
        "text": "North-East",
        "score": 0
      },
      {
        "key": "D",
        "text": "South-East",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 71,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "Practical Problem-Solving",
    "questionText": "A battery-powered torch suddenly stops working. What should you check first?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Replace the bulb immediately",
        "score": 0
      },
      {
        "key": "B",
        "text": "Check the batteries and their placement",
        "score": 0
      },
      {
        "key": "C",
        "text": "Press the switch repeatedly",
        "score": 0
      },
      {
        "key": "D",
        "text": "Clean the outside",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 72,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "Practical Problem-Solving",
    "questionText": "A bicycle chain keeps slipping off. What is the best first step?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Paint the chain",
        "score": 0
      },
      {
        "key": "B",
        "text": "Check whether the chain sits correctly on the gears and whether it is too loose",
        "score": 0
      },
      {
        "key": "C",
        "text": "Remove the brakes",
        "score": 0
      },
      {
        "key": "D",
        "text": "Add water to the chain",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 73,
    "sectionCode": "SECTION_C",
    "dimensionCode": "CREATIVE_THINKING",
    "dimensionName": "Creative Thinking",
    "questionText": "60-second challenge: Write as many different and unusual uses for an empty paper cup as you can. Evaluator scores 0\u20134 in column F using the creativity rubric.",
    "questionType": "open_scored",
    "imageUrl": null,
    "correctKey": "Evaluator 0\u20134 rubric",
    "maxPoints": 4.0,
    "options": []
  },
  {
    "questionNumber": 74,
    "sectionCode": "SECTION_C",
    "dimensionCode": "CREATIVE_THINKING",
    "dimensionName": "Creative Thinking",
    "questionText": "60-second challenge: Think of different useful things you could create from an empty cardboard box. Evaluator scores 0\u20134 in column F using the creativity rubric.",
    "questionType": "open_scored",
    "imageUrl": null,
    "correctKey": "Evaluator 0\u20134 rubric",
    "maxPoints": 4.0,
    "options": []
  },
  {
    "questionNumber": 75,
    "sectionCode": "SECTION_C",
    "dimensionCode": "SOCIAL_JUDGMENT",
    "dimensionName": "Social Judgment",
    "questionText": "Two group members strongly disagree and both want their idea chosen. What is the best first action?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Ask everyone to vote immediately",
        "score": 0
      },
      {
        "key": "B",
        "text": "Let both explain their reasons and compare them with the project goal",
        "score": 0
      },
      {
        "key": "C",
        "text": "Ask one person to give up the idea",
        "score": 0
      },
      {
        "key": "D",
        "text": "Use parts of both ideas without discussing them",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 76,
    "sectionCode": "SECTION_C",
    "dimensionCode": "SOCIAL_JUDGMENT",
    "dimensionName": "Social Judgment",
    "questionText": "A new student is quiet and is being left out of a group activity. What is the best first response?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Ignore it because the student may prefer being alone",
        "score": 0
      },
      {
        "key": "B",
        "text": "Tell the teacher the group cannot work with the student",
        "score": 0
      },
      {
        "key": "C",
        "text": "Invite the student to join and ask what part they would like to do",
        "score": 0
      },
      {
        "key": "D",
        "text": "Give the student all the easiest work",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 77,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PLANNING",
    "dimensionName": "Planning",
    "questionText": "You have homework due tomorrow, sports practice tonight and a project due next week. What is the best approach?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "B",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Start only the easiest task",
        "score": 0
      },
      {
        "key": "B",
        "text": "Plan by urgency and available time",
        "score": 0
      },
      {
        "key": "C",
        "text": "Leave everything until tomorrow",
        "score": 0
      },
      {
        "key": "D",
        "text": "Work only on the next-week project",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 78,
    "sectionCode": "SECTION_C",
    "dimensionCode": "PLANNING",
    "dimensionName": "Planning",
    "questionText": "You have 60 minutes to study: a 20-minute revision due tomorrow, a 25-minute assignment due in two days and optional reading. What is the best plan?",
    "questionType": "mcq_text",
    "imageUrl": null,
    "correctKey": "C",
    "maxPoints": 2.0,
    "options": [
      {
        "key": "A",
        "text": "Do optional reading first",
        "score": 0
      },
      {
        "key": "B",
        "text": "Spend all 60 minutes on the assignment",
        "score": 0
      },
      {
        "key": "C",
        "text": "Finish the urgent revision, then work on the assignment with the remaining time",
        "score": 0
      },
      {
        "key": "D",
        "text": "Wait until later because there is not enough time",
        "score": 0
      }
    ]
  },
  {
    "questionNumber": 79,
    "sectionCode": "SECTION_D",
    "dimensionCode": "CURIOSITY",
    "dimensionName": "Curiosity",
    "questionText": "When something interests me, I want to know more about it.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 80,
    "sectionCode": "SECTION_D",
    "dimensionCode": "PERSISTENCE",
    "dimensionName": "Persistence",
    "questionText": "When something is difficult, I usually keep trying.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 81,
    "sectionCode": "SECTION_D",
    "dimensionCode": "ADAPTABILITY",
    "dimensionName": "Adaptability",
    "questionText": "If one method does not work, I can change my approach.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 82,
    "sectionCode": "SECTION_D",
    "dimensionCode": "INITIATIVE",
    "dimensionName": "Initiative",
    "questionText": "If I see something useful that needs to be done, I can begin without always waiting to be told.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 83,
    "sectionCode": "SECTION_D",
    "dimensionCode": "COLLABORATION",
    "dimensionName": "Collaboration",
    "questionText": "I listen to other people's ideas even when they are different from mine.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 84,
    "sectionCode": "SECTION_D",
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "dimensionName": "Attention to Detail",
    "questionText": "I usually check my work before saying it is finished.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 85,
    "sectionCode": "SECTION_D",
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "dimensionName": "Learning Independence",
    "questionText": "I can learn some new things by exploring examples or resources on my own.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 86,
    "sectionCode": "SECTION_D",
    "dimensionCode": "CURIOSITY",
    "dimensionName": "Curiosity",
    "questionText": "I often ask 'why?' or 'how?' because I want to understand things better.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 87,
    "sectionCode": "SECTION_D",
    "dimensionCode": "PERSISTENCE",
    "dimensionName": "Persistence",
    "questionText": "After making a mistake or failing at something, I usually try again.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 88,
    "sectionCode": "SECTION_D",
    "dimensionCode": "ADAPTABILITY",
    "dimensionName": "Adaptability",
    "questionText": "I can adjust when rules, plans or situations unexpectedly change.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 89,
    "sectionCode": "SECTION_D",
    "dimensionCode": "INITIATIVE",
    "dimensionName": "Initiative",
    "questionText": "I am comfortable suggesting an idea when a group needs one.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 90,
    "sectionCode": "SECTION_D",
    "dimensionCode": "COLLABORATION",
    "dimensionName": "Collaboration",
    "questionText": "I try to help my teammates succeed, not only myself.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 91,
    "sectionCode": "SECTION_D",
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "dimensionName": "Attention to Detail",
    "questionText": "I often notice small mistakes or details that other people miss.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 92,
    "sectionCode": "SECTION_D",
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "dimensionName": "Learning Independence",
    "questionText": "When I do not understand something, I try books, examples, videos or other resources before giving up.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 93,
    "sectionCode": "SECTION_D",
    "dimensionCode": "CURIOSITY",
    "dimensionName": "Curiosity",
    "questionText": "I enjoy asking questions that help me understand a topic more deeply.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 94,
    "sectionCode": "SECTION_D",
    "dimensionCode": "PERSISTENCE",
    "dimensionName": "Persistence",
    "questionText": "If a task takes longer than expected, I can keep working until I make progress.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 95,
    "sectionCode": "SECTION_D",
    "dimensionCode": "ADAPTABILITY",
    "dimensionName": "Adaptability",
    "questionText": "When I receive useful feedback, I can change what I am doing and try again.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 96,
    "sectionCode": "SECTION_D",
    "dimensionCode": "INITIATIVE",
    "dimensionName": "Initiative",
    "questionText": "When I notice a problem, I can suggest a sensible action instead of only waiting for others.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 97,
    "sectionCode": "SECTION_D",
    "dimensionCode": "COLLABORATION",
    "dimensionName": "Collaboration",
    "questionText": "When working in a group, I can change my own idea if another idea works better.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 98,
    "sectionCode": "SECTION_D",
    "dimensionCode": "ATTENTION_TO_DETAIL",
    "dimensionName": "Attention to Detail",
    "questionText": "Before submitting work, I can check important instructions and small details.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 99,
    "sectionCode": "SECTION_D",
    "dimensionCode": "LEARNING_INDEPENDENCE",
    "dimensionName": "Learning Independence",
    "questionText": "If I am curious about something, I can find a suitable way to learn more about it.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Use response 1\u20134",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 100,
    "sectionCode": "SECTION_E",
    "dimensionCode": "CONSISTENCY_LEADERSHIP",
    "dimensionName": "Consistency \u2014 Leadership",
    "questionText": "When a team is unsure what to do next, I am comfortable helping the group choose a direction.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Compare with Q53",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 101,
    "sectionCode": "SECTION_E",
    "dimensionCode": "CONSISTENCY_PERSISTENCE",
    "dimensionName": "Consistency \u2014 Persistence",
    "questionText": "After a setback, I usually make another attempt instead of stopping immediately.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Compare with Q80",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 102,
    "sectionCode": "SECTION_E",
    "dimensionCode": "CONSISTENCY_EXPLORER",
    "dimensionName": "Consistency \u2014 Explorer",
    "questionText": "When something surprises me, I usually want to investigate what caused it.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Compare with Q2",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 103,
    "sectionCode": "SECTION_E",
    "dimensionCode": "CONSISTENCY_PLANNING",
    "dimensionName": "Consistency \u2014 Planning",
    "questionText": "Before starting several tasks, I usually decide what needs to be done first.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Compare with Q38",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  },
  {
    "questionNumber": 104,
    "sectionCode": "SECTION_E",
    "dimensionCode": "ATTENTION_CHECK",
    "dimensionName": "Attention Check",
    "questionText": "For this question only, please choose 'A little like me'.",
    "questionType": "likert_1_4",
    "imageUrl": null,
    "correctKey": "Attention check must equal 2",
    "maxPoints": 4.0,
    "options": [
      {
        "key": "1",
        "text": "Not like me",
        "score": 1
      },
      {
        "key": "2",
        "text": "A little like me",
        "score": 2
      },
      {
        "key": "3",
        "text": "Mostly like me",
        "score": 3
      },
      {
        "key": "4",
        "text": "Very much like me",
        "score": 4
      }
    ]
  }
];
