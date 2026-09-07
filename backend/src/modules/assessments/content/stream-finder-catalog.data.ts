/**
 * STREAM FINDER ASSESSMENT CATALOG DATA
 * Extracted verbatim from 3G MELIFE STREAM FINDER (1)(1).xlsx
 */

export interface StreamFinderOption {
  optionKey: string;
  optionText: string;
  scoreValue: number;
  stream?: string;
  displayOrder: number;
}

export interface StreamFinderQuestionData {
  questionNumber: number;
  sectionCode: string;
  sectionName: string;
  dimensionCode: string;
  dimensionName: string;
  questionText: string;
  questionType: "likert_1_5" | "forced_choice_4";
  stream?: string;
  options: StreamFinderOption[];
}

export interface StreamFinderSectionData {
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  questionRange: [number, number];
  questionType: "likert_1_5" | "forced_choice_4";
}

export interface StreamCareerClusterData {
  profileKey: string;
  suggestedCareerFamilies: string[];
  exampleAreas: string[];
  counsellingNote: string;
}

export const STREAM_FINDER_SECTIONS: StreamFinderSectionData[] = [
  {
    "code": "ACADEMIC_INTEREST",
    "name": "Academic Interest",
    "description": "Explores your natural curiosity and engagement with different subject domains.",
    "displayOrder": 1,
    "questionRange": [
      1,
      20
    ],
    "questionType": "likert_1_5"
  },
  {
    "code": "PROBLEM_SOLVING",
    "name": "Problem-Solving Style",
    "description": "Evaluates how you approach complex puzzles, reasoning tasks, and analytical challenges.",
    "displayOrder": 2,
    "questionRange": [
      21,
      36
    ],
    "questionType": "likert_1_5"
  },
  {
    "code": "LEARNING_STYLE",
    "name": "Learning Style",
    "description": "Measures your preferred methods of absorbing, processing, and retaining knowledge.",
    "displayOrder": 3,
    "questionRange": [
      37,
      48
    ],
    "questionType": "likert_1_5"
  },
  {
    "code": "CAREER_ORIENTATION",
    "name": "Career Orientation",
    "description": "Identifies long-term occupational values and vocational preferences.",
    "displayOrder": 4,
    "questionRange": [
      49,
      60
    ],
    "questionType": "likert_1_5"
  },
  {
    "code": "APTITUDE_PREFERENCE",
    "name": "Aptitude Preference",
    "description": "Forced-choice paired scenarios assessing intuitive strengths across academic fields.",
    "displayOrder": 5,
    "questionRange": [
      61,
      70
    ],
    "questionType": "forced_choice_4"
  },
  {
    "code": "SITUATIONAL_INDICATORS",
    "name": "Situational Stream Indicators",
    "description": "Real-world decision-making scenarios mapping directly to academic stream alignments.",
    "displayOrder": 6,
    "questionRange": [
      71,
      80
    ],
    "questionType": "forced_choice_4"
  }
];

export const STREAM_FINDER_QUESTIONS: StreamFinderQuestionData[] = [
  {
    "questionNumber": 1,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I enjoy understanding how machines, devices, or natural systems work.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 2,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "Mathematics is interesting when I understand the logic behind it.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 3,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I enjoy learning about the human body, plants, animals, or living systems.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 4,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "Conducting experiments sounds more interesting to me than memorising facts.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 5,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I enjoy solving numerical or scientific problems.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 6,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I am interested in understanding how businesses make money.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 7,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I enjoy learning about banking, finance, investment, or money management.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 8,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I find topics related to economics and markets interesting.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 9,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I would enjoy planning how a business should operate.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 10,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I am interested in entrepreneurship and creating my own business.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 11,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I enjoy understanding why people behave in different ways.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 12,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I am interested in history, society, politics, or culture.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 13,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I enjoy discussing social issues and different viewpoints.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 14,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "Reading, writing, communication, or languages interest me.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 15,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I would like to understand how communities and societies develop.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 16,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I prefer activities where I can create, build, repair, operate, or design something.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 17,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I enjoy learning practical skills that can be used immediately.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 18,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I prefer hands-on demonstrations to long theoretical explanations.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 19,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I am interested in technical, creative, or skill-based careers.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 20,
    "sectionCode": "ACADEMIC_INTEREST",
    "sectionName": "Academic Interest",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I feel satisfied when I can see a physical or practical result from my work.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 21,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "When I face a problem, I try to identify the logical cause.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 22,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I enjoy problems that have one accurate answer.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 23,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I like analysing evidence before reaching a conclusion.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 24,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I enjoy identifying patterns in numbers or data.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 25,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I can stay focused on difficult analytical problems.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 26,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I naturally think about cost, benefit, profit, and value.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 27,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I enjoy comparing different options before making a financial decision.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 28,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I like organising information into tables, categories, or structured plans.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 29,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I am comfortable making decisions using numbers.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 30,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I enjoy planning resources efficiently.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 31,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I often think about people's feelings and motivations when solving problems.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 32,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I like looking at a problem from several different perspectives.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 33,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I enjoy explaining ideas using words.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 34,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I often question why society works the way it does.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 35,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I prefer understanding the human side of a problem rather than only its technical side.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 36,
    "sectionCode": "PROBLEM_SOLVING",
    "sectionName": "Problem-Solving Style",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "When something stops working, I prefer trying to fix it myself.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 37,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I learn well through formulas, diagrams, models, and logical explanations.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 38,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I enjoy laboratory activities and scientific demonstrations.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 39,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I am comfortable learning complex technical concepts step by step.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 40,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I enjoy analysing graphs, statistics, or numerical information.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 41,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I learn well through business examples and real-life case studies.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 42,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I enjoy activities involving budgeting, planning, or resource management.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 43,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I learn well through discussions, stories, reading, and interpretation.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 44,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I enjoy writing essays, reports, arguments, or explanations.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 45,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I remember concepts better when I understand their social or human meaning.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 46,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I learn fastest when I physically practise a task.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 47,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "Demonstration followed by practice works better for me than reading instructions.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 48,
    "sectionCode": "LEARNING_STYLE",
    "sectionName": "Learning Style",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I enjoy project-based learning where I create something.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 49,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I can imagine myself becoming an engineer, scientist, doctor, researcher, or technology professional.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 50,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "A career involving science or mathematics appeals to me.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 51,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "SCIENCE",
    "dimensionName": "Science",
    "questionText": "I would enjoy working with technology, laboratories, healthcare, engineering, or research.",
    "questionType": "likert_1_5",
    "stream": "Science",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 52,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I can imagine myself working in finance, accounting, banking, management, or business.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 53,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "Running or managing a company sounds exciting to me.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 54,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "COMMERCE",
    "dimensionName": "Commerce",
    "questionText": "I would like a career where financial or business decisions are important.",
    "questionType": "likert_1_5",
    "stream": "Commerce",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 55,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "Careers involving psychology, law, communication, public service, education, media, or social sciences interest me.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 56,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I would enjoy a profession where understanding people is important.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 57,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "HUMANITIES",
    "dimensionName": "Humanities",
    "questionText": "I would like my future career to involve communication, society, behaviour, policy, culture, or ideas.",
    "questionType": "likert_1_5",
    "stream": "Humanities",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 58,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I am interested in careers based on specialised practical or technical skills.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 59,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I would enjoy a career where I regularly create, operate, repair, design, or produce things.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 60,
    "sectionCode": "CAREER_ORIENTATION",
    "sectionName": "Career Orientation",
    "dimensionCode": "APPLIED_TECHNICAL",
    "dimensionName": "Applied / Technical",
    "questionText": "I would consider professional training or skill-based education if it leads to a career I enjoy.",
    "questionType": "likert_1_5",
    "stream": "Applied / Technical",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5
      }
    ]
  },
  {
    "questionNumber": 61,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which task sounds most enjoyable?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Solving a scientific puzzle",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Planning a small business",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Understanding a social issue",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Building or repairing something",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 62,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which school project would you prefer?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Testing water quality in a laboratory",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Creating a business and pricing plan",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Studying how social media affects teenagers",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Designing and building a working model",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 63,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which type of information attracts you first?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Scientific facts",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Financial figures",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Human stories",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Practical instructions",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 64,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "If given an unfamiliar problem, what would you usually do?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Analyse the cause logically",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Compare advantages and costs",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Ask how different people are affected",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Try possible practical solutions",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 65,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which activity sounds most satisfying?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Discovering why something happens",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Making a successful financial plan",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Helping someone understand an issue",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Producing something useful",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 66,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which competition would you most likely enter?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Science or mathematics competition",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Business or entrepreneurship competition",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Debate, essay, or social science competition",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Design, robotics, craft, or technical competition",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 67,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which environment would you prefer?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Laboratory or technology centre",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Corporate office or business environment",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "School, court, media organisation, NGO, or public institution",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Workshop, studio, site, kitchen, production unit, or technical environment",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 68,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "What do you notice most when visiting a new place?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "How things function",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "How businesses operate",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "The people and culture",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "How things are designed or constructed",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 69,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which skill would you most like to master?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Scientific analysis",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Financial decision-making",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Communication and understanding people",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Practical technical expertise",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 70,
    "sectionCode": "APTITUDE_PREFERENCE",
    "sectionName": "Aptitude Preference",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which statement describes you best?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "I am curious about how the world works scientifically.",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "I am curious about how money and organisations work.",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "I am curious about people and society.",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "I am curious about how things are made and used.",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 71,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Your school gives you \u20b910,000 for a project. What would you prefer to do?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Build a scientific prototype",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Create a small business and track profit",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Conduct a community-awareness project",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Build a useful product or practical system",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 72,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "A local lake is polluted. Which role would interest you most?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Test the chemical and biological condition of the water",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Calculate the economic cost and funding options",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Study its impact on the community",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Design a practical filtration or cleaning solution",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 73,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "A new company is opening nearby. What interests you most?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "The technology it uses",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Its business model and profitability",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Its impact on employment and society",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "The production process and equipment",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 74,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Your friend wants help choosing a mobile phone. What would you focus on?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Processor, battery, specifications, and technology",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Price, resale value, and value for money",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "User needs, lifestyle, and communication preferences",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Build quality, repairability, and practical usability",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 75,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which documentary would you watch first?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Space exploration and future technology",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "How global companies became successful",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Human psychology and civilisation",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "How major structures or machines are built",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 76,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which problem would you rather solve?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Why a chemical reaction failed",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Why a business is losing money",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Why a group of people is behaving differently",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Why a machine or practical process is not working",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 77,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "You have four internship options. Which one would you select?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Research laboratory",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Finance or business company",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Media, counselling, legal, education, or social organisation",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Technical workshop, design studio, hotel, production unit, or field site",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 78,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which achievement would make you most proud?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Inventing or discovering something",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Building a profitable organisation",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Influencing people through ideas or helping society",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Mastering a valuable professional skill",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 79,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "Which question interests you most?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "\"How does this work?\"",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "\"How can this create value?\"",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "\"Why do people do this?\"",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "\"How can I make or improve this?\"",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  },
  {
    "questionNumber": 80,
    "sectionCode": "SITUATIONAL_INDICATORS",
    "sectionName": "Situational Stream Indicators",
    "dimensionCode": "FORCED_CHOICE",
    "dimensionName": "Stream Aptitude Scenario",
    "questionText": "If all careers offered the same salary, which type would you most likely choose?",
    "questionType": "forced_choice_4",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Scientific, medical, engineering, mathematical, or technological",
        "scoreValue": 3,
        "stream": "Science",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Business, finance, accounting, economics, or management",
        "scoreValue": 3,
        "stream": "Commerce",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Psychology, law, humanities, communication, education, or social science",
        "scoreValue": 3,
        "stream": "Humanities",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Technical, design, hospitality, production, creative, or skilled profession",
        "scoreValue": 3,
        "stream": "Applied / Technical",
        "displayOrder": 4
      }
    ]
  }
];

export const STREAM_FINDER_CAREER_CLUSTERS: StreamCareerClusterData[] = [
  {
    "profileKey": "Profile / Stream",
    "suggestedCareerFamilies": [
      "Suggested Career Families"
    ],
    "exampleAreas": [
      "Example Areas"
    ],
    "counsellingNote": "Counselling Note"
  },
  {
    "profileKey": "Science",
    "suggestedCareerFamilies": [
      "Health & Life Sciences",
      "Engineering & Technology",
      "Computing & Data",
      "Research"
    ],
    "exampleAreas": [
      "Medicine",
      "Engineering",
      "Computer Science",
      "AI",
      "Biotechnology",
      "Pharmacy",
      "Data Science",
      "Environmental Science"
    ],
    "counsellingNote": "Explore subject prerequisites and academic readiness."
  },
  {
    "profileKey": "Commerce",
    "suggestedCareerFamilies": [
      "Business & Finance",
      "Economics",
      "Entrepreneurship",
      "Management & Analytics"
    ],
    "exampleAreas": [
      "CA",
      "Finance",
      "Banking",
      "Economics",
      "Management",
      "Marketing",
      "HR",
      "Business Analytics"
    ],
    "counsellingNote": "Assess numerical comfort, commercial interest and decision-making orientation."
  },
  {
    "profileKey": "Humanities",
    "suggestedCareerFamilies": [
      "Human Behaviour",
      "Law & Public Affairs",
      "Communication & Media",
      "Social Sciences"
    ],
    "exampleAreas": [
      "Psychology",
      "Law",
      "Civil Services",
      "Journalism",
      "Education",
      "Public Policy",
      "International Relations"
    ],
    "counsellingNote": "Explore verbal, social, interpretive and people-oriented strengths."
  },
  {
    "profileKey": "Applied / Technical",
    "suggestedCareerFamilies": [
      "Technical & Skilled Careers",
      "Design",
      "Hospitality",
      "Production & Field Practice"
    ],
    "exampleAreas": [
      "Polytechnic",
      "ITI",
      "Electronics",
      "Automobile",
      "Design",
      "Hospitality",
      "Animation",
      "Interior Design",
      "Tourism"
    ],
    "counsellingNote": "Strong option for students who learn best through doing and applied practice."
  },
  {
    "profileKey": "Science + Commerce",
    "suggestedCareerFamilies": [
      "Quantitative Business & Technology"
    ],
    "exampleAreas": [
      "Economics",
      "Statistics",
      "Actuarial Science",
      "FinTech",
      "Business Analytics",
      "Data Analytics",
      "Technology Management"
    ],
    "counsellingNote": "A genuine interdisciplinary profile, not an inconclusive result."
  },
  {
    "profileKey": "Science + Humanities",
    "suggestedCareerFamilies": [
      "Human Science & Society"
    ],
    "exampleAreas": [
      "Psychology",
      "Cognitive Science",
      "Public Health",
      "Environmental Studies",
      "Behavioural Science",
      "Science Communication"
    ],
    "counsellingNote": "Explore pathways combining scientific thinking with human or social questions."
  },
  {
    "profileKey": "Science + Applied",
    "suggestedCareerFamilies": [
      "Engineering & Applied Technology"
    ],
    "exampleAreas": [
      "Engineering",
      "Architecture",
      "Robotics",
      "Electronics",
      "Mechatronics",
      "Industrial Design"
    ],
    "counsellingNote": "Often suits students combining analytical reasoning with hands-on problem solving."
  },
  {
    "profileKey": "Commerce + Humanities",
    "suggestedCareerFamilies": [
      "People, Markets & Institutions"
    ],
    "exampleAreas": [
      "Law",
      "Economics",
      "Marketing",
      "HR",
      "Public Administration",
      "International Relations",
      "Communication"
    ],
    "counsellingNote": "Useful for students interested in organisations, society and communication."
  },
  {
    "profileKey": "Commerce + Applied",
    "suggestedCareerFamilies": [
      "Enterprise & Operations"
    ],
    "exampleAreas": [
      "Hospitality Management",
      "Entrepreneurship",
      "Logistics",
      "Retail",
      "Event Management",
      "E-commerce",
      "Production Management"
    ],
    "counsellingNote": "Explore business activity connected to practical operations."
  }
];

export const STREAM_MAX_POINTS = {
  Science: 145,
  Commerce: 135,
  Humanities: 140,
  "Applied / Technical": 120,
} as const;

export const STREAM_ITEM_KEY_MAP: Record<number, string> = {
  1: "Science",
  2: "Science",
  3: "Science",
  4: "Science",
  5: "Science",
  6: "Commerce",
  7: "Commerce",
  8: "Commerce",
  9: "Commerce",
  10: "Commerce",
  11: "Humanities",
  12: "Humanities",
  13: "Humanities",
  14: "Humanities",
  15: "Humanities",
  16: "Applied / Technical",
  17: "Applied / Technical",
  18: "Applied / Technical",
  19: "Applied / Technical",
  20: "Applied / Technical",
  21: "Science",
  22: "Science",
  23: "Science",
  24: "Science",
  25: "Science",
  26: "Commerce",
  27: "Commerce",
  28: "Commerce",
  29: "Commerce",
  30: "Commerce",
  31: "Humanities",
  32: "Humanities",
  33: "Humanities",
  34: "Humanities",
  35: "Humanities",
  36: "Applied / Technical",
  37: "Science",
  38: "Science",
  39: "Science",
  40: "Science",
  41: "Commerce",
  42: "Commerce",
  43: "Humanities",
  44: "Humanities",
  45: "Humanities",
  46: "Applied / Technical",
  47: "Applied / Technical",
  48: "Applied / Technical",
  49: "Science",
  50: "Science",
  51: "Science",
  52: "Commerce",
  53: "Commerce",
  54: "Commerce",
  55: "Humanities",
  56: "Humanities",
  57: "Humanities",
  58: "Applied / Technical",
  59: "Applied / Technical",
  60: "Applied / Technical",
};
