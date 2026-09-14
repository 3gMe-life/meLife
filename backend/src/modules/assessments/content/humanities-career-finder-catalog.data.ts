export interface AssessmentSectionCatalogItem {
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  weight?: number;
}

export interface AssessmentDimensionCatalogItem {
  code: string;
  sectionCode: string;
  name: string;
  description: string;
  displayOrder: number;
}

export interface AssessmentOptionCatalogItem {
  optionKey: string;
  optionText: string;
  scoreValue: number;
  displayOrder: number;
  metadata?: Record<string, any>;
}

export interface AssessmentQuestionCatalogItem {
  code: string;
  sectionCode: string;
  dimensionCode?: string;
  questionType: string;
  questionText: string;
  displayOrder: number;
  isMandatory: boolean;
  scoringMethod: string;
  isReverseKeyed?: boolean;
  isPilot?: boolean;
  options: AssessmentOptionCatalogItem[];
}

export interface HumanitiesCareerFamilyDefinition {
  code: string;
  name: string;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export const HUMANITIES_CAREER_FAMILIES: HumanitiesCareerFamilyDefinition[] = [
  {
    "code": "HUMAN_BEHAVIOUR_WELLBEING",
    "name": "Human Behaviour & Wellbeing",
    "suggestedPathways": "Psychology, counselling, youth work, wellbeing, human development",
    "exampleAreas": "Clinical / Counselling Psychology, Social Work, Child & Youth Development, Mental Health Support, HR / Organisational Wellbeing",
    "counsellingNote": "Explore people-focused pathways where understanding behaviour and supporting development matter."
  },
  {
    "code": "LAW_PUBLIC_AFFAIRS_JUSTICE",
    "name": "Law, Public Affairs & Social Justice",
    "suggestedPathways": "Law, public administration, policy advocacy, governance, social justice",
    "exampleAreas": "Corporate & Constitutional Law, Civil Services (UPSC), Public Policy, Judiciary, Human Rights Advocacy, International Relations",
    "counsellingNote": "Explore pathways involving rules, rights, institutions, evidence and public decision-making."
  },
  {
    "code": "MEDIA_COMM_CREATIVE_CULTURE",
    "name": "Media, Communication & Creative Culture",
    "suggestedPathways": "Journalism, media, content, public communication, cultural and creative industries",
    "exampleAreas": "Print & Broadcast Journalism, Digital Media & Content Strategy, Public Relations, Advertising, Creative Writing, Film & Cultural Studies",
    "counsellingNote": "Explore pathways involving storytelling, communication, media, culture and audience engagement."
  },
  {
    "code": "EDUCATION_LANG_SOCIAL_RESEARCH",
    "name": "Education, Languages & Social Research",
    "suggestedPathways": "Teaching, languages, education, social research, community learning, academic support",
    "exampleAreas": "School & Higher Education Teaching, Linguistics & Translation, Sociology, Historical Research, Think-tank Research, Educational Policy",
    "counsellingNote": "Explore pathways involving learning, language, research, facilitation and social understanding."
  }
];

export const HUMANITIES_CAREER_FINDER_SECTIONS: AssessmentSectionCatalogItem[] = [
  {
    "code": "SEC_HUMAN_BEHAVIOUR",
    "name": "Human Behaviour & Empathy",
    "description": "Interest in people, behaviour, emotions, relationships and wellbeing.",
    "displayOrder": 1,
    "weight": 1.0
  },
  {
    "code": "SEC_LANGUAGE_COMM",
    "name": "Language & Communication",
    "description": "Interest in reading, writing, speaking, explaining and interpreting language.",
    "displayOrder": 2,
    "weight": 1.0
  },
  {
    "code": "SEC_SOCIETY_CULTURE",
    "name": "Society, Culture & Identity",
    "description": "Curiosity about communities, culture, identity, traditions and social change.",
    "displayOrder": 3,
    "weight": 1.0
  },
  {
    "code": "SEC_LAW_JUSTICE",
    "name": "Law, Justice & Civic Reasoning",
    "description": "Interest in rules, rights, fairness, evidence, institutions and public decision-making.",
    "displayOrder": 4,
    "weight": 1.0
  },
  {
    "code": "SEC_HISTORY_EVIDENCE",
    "name": "History, Interpretation & Evidence",
    "description": "Interest in historical context, sources, interpretation, timelines and competing explanations.",
    "displayOrder": 5,
    "weight": 1.0
  },
  {
    "code": "SEC_CREATIVE_MEDIA",
    "name": "Creative Expression & Media",
    "description": "Interest in storytelling, media, visual/creative expression and audience engagement.",
    "displayOrder": 6,
    "weight": 1.0
  },
  {
    "code": "SEC_EDUCATION_FACIL",
    "name": "Education & Facilitation",
    "description": "Interest in teaching, mentoring, simplifying ideas and helping others learn.",
    "displayOrder": 7,
    "weight": 1.0
  },
  {
    "code": "SEC_RESEARCH_POLICY",
    "name": "Research, Policy & Global Thinking",
    "description": "Interest in research, public issues, policy, systems, global affairs and evidence-based conclusions.",
    "displayOrder": 8,
    "weight": 1.0
  },
  {
    "code": "SEC_CAREER_SCEN",
    "name": "Career Preference Scenarios",
    "description": "Practical humanities scenario choices reflecting preferred work context and daily challenges.",
    "displayOrder": 9,
    "weight": 1.0
  }
];

export const HUMANITIES_CAREER_FINDER_DIMENSIONS: AssessmentDimensionCatalogItem[] = [
  {
    "code": "DIM_HUMAN_BEHAVIOUR",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "name": "Human Behaviour & Empathy",
    "description": "Interest in people, behaviour, emotions, relationships and wellbeing.",
    "displayOrder": 1
  },
  {
    "code": "DIM_LANGUAGE_COMM",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "name": "Language & Communication",
    "description": "Interest in reading, writing, speaking, explaining and interpreting language.",
    "displayOrder": 2
  },
  {
    "code": "DIM_SOCIETY_CULTURE",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "name": "Society, Culture & Identity",
    "description": "Curiosity about communities, culture, identity, traditions and social change.",
    "displayOrder": 3
  },
  {
    "code": "DIM_LAW_JUSTICE",
    "sectionCode": "SEC_LAW_JUSTICE",
    "name": "Law, Justice & Civic Reasoning",
    "description": "Interest in rules, rights, fairness, evidence, institutions and public decision-making.",
    "displayOrder": 4
  },
  {
    "code": "DIM_HISTORY_EVIDENCE",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "name": "History, Interpretation & Evidence",
    "description": "Interest in historical context, sources, interpretation, timelines and competing explanations.",
    "displayOrder": 5
  },
  {
    "code": "DIM_CREATIVE_MEDIA",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "name": "Creative Expression & Media",
    "description": "Interest in storytelling, media, visual/creative expression and audience engagement.",
    "displayOrder": 6
  },
  {
    "code": "DIM_EDUCATION_FACIL",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "name": "Education & Facilitation",
    "description": "Interest in teaching, mentoring, simplifying ideas and helping others learn.",
    "displayOrder": 7
  },
  {
    "code": "DIM_RESEARCH_POLICY",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "name": "Research, Policy & Global Thinking",
    "description": "Interest in research, public issues, policy, systems, global affairs and evidence-based conclusions.",
    "displayOrder": 8
  },
  {
    "code": "DIM_CAREER_SCEN",
    "sectionCode": "SEC_CAREER_SCEN",
    "name": "Career Preference Scenarios",
    "description": "Practical humanities scenario choices reflecting preferred work context and daily challenges.",
    "displayOrder": 9
  }
];

export const HUMANITIES_CAREER_FINDER_QUESTIONS: AssessmentQuestionCatalogItem[] = [
  {
    "code": "HCF01",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I am curious about why people behave differently in similar situations.",
    "displayOrder": 1,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF02",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I like listening carefully when someone explains how they feel or what they are experiencing.",
    "displayOrder": 2,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF03",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I enjoy noticing patterns in people's behaviour and interactions.",
    "displayOrder": 3,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF04",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I am interested in how thoughts, emotions and experiences can influence behaviour.",
    "displayOrder": 4,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF05",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I rarely find myself interested in why people behave differently in similar situations.",
    "displayOrder": 5,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF06",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I like exploring how family, friendships and environment shape a person's development.",
    "displayOrder": 6,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF07",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I can stay interested in a discussion even when the people involved have very different viewpoints.",
    "displayOrder": 7,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF08",
    "sectionCode": "SEC_HUMAN_BEHAVIOUR",
    "dimensionCode": "DIM_HUMAN_BEHAVIOUR",
    "questionType": "likert_1_5",
    "questionText": "I am curious about how people cope with stress, change or difficult situations.",
    "displayOrder": 8,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.5,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF09",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I enjoy expressing my ideas clearly in speaking or writing.",
    "displayOrder": 9,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF10",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I like reading articles, stories or essays and thinking about what the writer is trying to communicate.",
    "displayOrder": 10,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF11",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I enjoy choosing words carefully to make an explanation easier to understand.",
    "displayOrder": 11,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF12",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I feel comfortable presenting an idea to a group when I have prepared for it.",
    "displayOrder": 12,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF13",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I usually avoid situations where I have to explain my ideas clearly to other people.",
    "displayOrder": 13,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF14",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I enjoy writing when I can develop an argument, story or explanation.",
    "displayOrder": 14,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF15",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I notice when the wording of a message changes its meaning or impact.",
    "displayOrder": 15,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF16",
    "sectionCode": "SEC_LANGUAGE_COMM",
    "dimensionCode": "DIM_LANGUAGE_COMM",
    "questionType": "likert_1_5",
    "questionText": "I enjoy conversations where people exchange ideas and explain different viewpoints.",
    "displayOrder": 16,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.45,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF17",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I am curious about how communities develop their customs and traditions.",
    "displayOrder": 17,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF18",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I enjoy learning how culture can influence the way people think and live.",
    "displayOrder": 18,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF19",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I like exploring why social groups may have different values or expectations.",
    "displayOrder": 19,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF20",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I am interested in how societies change over time.",
    "displayOrder": 20,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF21",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I usually have little interest in how culture and community shape people's lives.",
    "displayOrder": 21,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF22",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I like learning about different cultures without assuming that one is automatically better than another.",
    "displayOrder": 22,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF23",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I am curious about how family, community and social environment influence opportunities.",
    "displayOrder": 23,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF24",
    "sectionCode": "SEC_SOCIETY_CULTURE",
    "dimensionCode": "DIM_SOCIETY_CULTURE",
    "questionType": "likert_1_5",
    "questionText": "I enjoy exploring how social attitudes change across generations.",
    "displayOrder": 24,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF25",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I enjoy thinking about whether a rule is fair and why it exists.",
    "displayOrder": 25,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF26",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I am interested in how rights and responsibilities work in society.",
    "displayOrder": 26,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF27",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I like examining both sides of an argument before deciding what I think.",
    "displayOrder": 27,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF28",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I enjoy situations where evidence must be considered before reaching a conclusion.",
    "displayOrder": 28,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF29",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I prefer to accept a rule as it is without thinking about whether it is fair or reasonable.",
    "displayOrder": 29,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF30",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I like identifying inconsistencies in an argument or set of rules.",
    "displayOrder": 30,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF31",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I would enjoy discussing how laws can affect different groups of people.",
    "displayOrder": 31,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF32",
    "sectionCode": "SEC_LAW_JUSTICE",
    "dimensionCode": "DIM_LAW_JUSTICE",
    "questionType": "likert_1_5",
    "questionText": "I am interested in how public decisions can balance individual rights and community needs.",
    "displayOrder": 32,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.1,
          "lawPublicAffairsWeight": 0.5,
          "mediaCreativeWeight": 0.15,
          "educationResearchWeight": 0.25
        }
      }
    ]
  },
  {
    "code": "HCF33",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "questionType": "likert_1_5",
    "questionText": "I enjoy understanding what happened in the past and why it mattered.",
    "displayOrder": 33,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF34",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "questionType": "likert_1_5",
    "questionText": "I like connecting events from different periods to understand how one change can influence another.",
    "displayOrder": 34,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF35",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "questionType": "likert_1_5",
    "questionText": "I enjoy comparing different accounts of the same historical event.",
    "displayOrder": 35,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF36",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "questionType": "likert_1_5",
    "questionText": "I am interested in how historians use documents, objects or other evidence to interpret the past.",
    "displayOrder": 36,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF37",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "questionType": "likert_1_5",
    "questionText": "I usually lose interest when I have to compare evidence from different historical accounts.",
    "displayOrder": 37,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF38",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "questionType": "likert_1_5",
    "questionText": "I enjoy learning how political, economic and cultural changes are connected across time.",
    "displayOrder": 38,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF39",
    "sectionCode": "SEC_HISTORY_EVIDENCE",
    "dimensionCode": "DIM_HISTORY_EVIDENCE",
    "questionType": "likert_1_5",
    "questionText": "I am curious about how historical memory can differ between communities.",
    "displayOrder": 39,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.25,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF40",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "questionType": "likert_1_5",
    "questionText": "I enjoy creating stories, scripts, visual concepts or other forms of creative expression.",
    "displayOrder": 40,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      }
    ]
  },
  {
    "code": "HCF41",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "questionType": "likert_1_5",
    "questionText": "I like thinking about how images, sound or words can influence an audience.",
    "displayOrder": 41,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      }
    ]
  },
  {
    "code": "HCF42",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "questionType": "likert_1_5",
    "questionText": "I am interested in how news, films, social media or other media shape public understanding.",
    "displayOrder": 42,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      }
    ]
  },
  {
    "code": "HCF43",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "questionType": "likert_1_5",
    "questionText": "I enjoy developing an idea into content that other people can experience.",
    "displayOrder": 43,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      }
    ]
  },
  {
    "code": "HCF44",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "questionType": "likert_1_5",
    "questionText": "I would rather follow a fixed format than experiment with different ways of expressing an idea.",
    "displayOrder": 44,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      }
    ]
  },
  {
    "code": "HCF45",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "questionType": "likert_1_5",
    "questionText": "I am curious about why some stories or media messages attract people's attention.",
    "displayOrder": 45,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      }
    ]
  },
  {
    "code": "HCF46",
    "sectionCode": "SEC_CREATIVE_MEDIA",
    "dimensionCode": "DIM_CREATIVE_MEDIA",
    "questionType": "likert_1_5",
    "questionText": "I enjoy analysing how a film, advertisement, article or social-media post creates a particular impression.",
    "displayOrder": 46,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.2,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.5,
          "educationResearchWeight": 0.2
        }
      }
    ]
  },
  {
    "code": "HCF47",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "questionType": "likert_1_5",
    "questionText": "I enjoy explaining a difficult idea in a simpler way.",
    "displayOrder": 47,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF48",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "questionType": "likert_1_5",
    "questionText": "I feel satisfied when someone understands something because I helped them learn it.",
    "displayOrder": 48,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF49",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "questionType": "likert_1_5",
    "questionText": "I like adapting the way I explain something when another person does not understand it the first time.",
    "displayOrder": 49,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF50",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "questionType": "likert_1_5",
    "questionText": "I enjoy helping classmates organise their learning or prepare for a task.",
    "displayOrder": 50,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF51",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "questionType": "likert_1_5",
    "questionText": "I become frustrated when I need to explain something more than once for another person to understand.",
    "displayOrder": 51,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF52",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "questionType": "likert_1_5",
    "questionText": "I like encouraging people when they are struggling to learn something new.",
    "displayOrder": 52,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF53",
    "sectionCode": "SEC_EDUCATION_FACIL",
    "dimensionCode": "DIM_EDUCATION_FACIL",
    "questionType": "likert_1_5",
    "questionText": "I enjoy designing activities that help people understand or practise an idea.",
    "displayOrder": 53,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.35,
          "lawPublicAffairsWeight": 0.1,
          "mediaCreativeWeight": 0.25,
          "educationResearchWeight": 0.3
        }
      }
    ]
  },
  {
    "code": "HCF54",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "questionType": "likert_1_5",
    "questionText": "I enjoy investigating a social issue before forming an opinion about it.",
    "displayOrder": 54,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF55",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "questionType": "likert_1_5",
    "questionText": "I like comparing evidence from different sources before reaching a conclusion.",
    "displayOrder": 55,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF56",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "questionType": "likert_1_5",
    "questionText": "I am interested in how public policies can change people's lives.",
    "displayOrder": 56,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF57",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "questionType": "likert_1_5",
    "questionText": "I enjoy exploring issues that involve several connected causes rather than one simple answer.",
    "displayOrder": 57,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF58",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "questionType": "likert_1_5",
    "questionText": "I prefer forming a quick opinion rather than spending time investigating evidence about a social issue.",
    "displayOrder": 58,
    "isMandatory": true,
    "scoringMethod": "REVERSE_LIKERT",
    "isReverseKeyed": true,
    "isPilot": true,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": true,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF59",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "questionType": "likert_1_5",
    "questionText": "I like asking what data or evidence would help test a claim about society.",
    "displayOrder": 59,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF60",
    "sectionCode": "SEC_RESEARCH_POLICY",
    "dimensionCode": "DIM_RESEARCH_POLICY",
    "questionType": "likert_1_5",
    "questionText": "I enjoy thinking about how a decision may affect different groups over time.",
    "displayOrder": 60,
    "isMandatory": true,
    "scoringMethod": "LIKERT_SCALE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "1",
        "optionText": "Strongly Disagree",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "2",
        "optionText": "Disagree",
        "scoreValue": 2,
        "displayOrder": 2,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "3",
        "optionText": "Not Sure",
        "scoreValue": 3,
        "displayOrder": 3,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "4",
        "optionText": "Agree",
        "scoreValue": 4,
        "displayOrder": 4,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      },
      {
        "optionKey": "5",
        "optionText": "Strongly Agree",
        "scoreValue": 5,
        "displayOrder": 5,
        "metadata": {
          "isReverseKeyed": false,
          "humanBehaviourWeight": 0.15,
          "lawPublicAffairsWeight": 0.3,
          "mediaCreativeWeight": 0.2,
          "educationResearchWeight": 0.35
        }
      }
    ]
  },
  {
    "code": "HCF61",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "You are given a free afternoon to explore one topic. Which would you choose?",
    "displayOrder": 61,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "A",
        "optionText": "How emotions and relationships affect people",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "How a public decision or rule affects citizens",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "How a story, message or media piece influences an audience",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "How a social issue could be researched and explained",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF62",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which project would you most enjoy working on?",
    "displayOrder": 62,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Understanding how people respond to stress",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Examining whether a school or community rule is fair",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Creating a campaign or story for an audience",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Studying a social issue using evidence from different sources",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF63",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which question would you most naturally ask first?",
    "displayOrder": 63,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Why is this person reacting this way?",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "What rights, rules or responsibilities apply here?",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "How can this idea be communicated in an engaging way?",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "What evidence would help us understand the wider issue?",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF64",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which type of activity sounds most satisfying?",
    "displayOrder": 64,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Listening to people and understanding their experiences",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Building a reasoned case about a difficult public issue",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Creating content that makes people think or feel something",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Comparing information to identify a pattern or explanation",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF65",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which school project would you be most likely to volunteer for?",
    "displayOrder": 65,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": true,
    "options": [
      {
        "optionKey": "A",
        "optionText": "A study about friendships, behaviour or wellbeing",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "A project about rights, citizenship or public institutions",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "A podcast, magazine, video or creative communication project",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "A research project on society, policy or global issues",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF66",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which skill would you most like to become excellent at?",
    "displayOrder": 66,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Understanding people and supporting their development",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Reasoning about fairness, rules and evidence",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Storytelling and communicating ideas to different audiences",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Researching complex issues and drawing evidence-based conclusions",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF67",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which type of material would you most enjoy analysing?",
    "displayOrder": 67,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Interviews or observations about people's experiences",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "A case involving conflicting rights or responsibilities",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "A film, article, advertisement or social-media campaign",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Reports, datasets or multiple sources about a social issue",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF68",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which challenge would you choose?",
    "displayOrder": 68,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Helping someone understand a difficult personal situation",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Working through competing arguments about a community decision",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Turning a complicated idea into an engaging public message",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Finding out why a social problem is happening",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF69",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which achievement would feel most meaningful?",
    "displayOrder": 69,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Helping someone make positive progress",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Contributing to a fairer decision or system",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Creating something that reaches and influences people",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Producing research that helps others understand an important issue",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF70",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which conversation would hold your attention longest?",
    "displayOrder": 70,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Why people think, feel and behave differently",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "How laws and public institutions should respond to a problem",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Why certain stories and messages influence audiences",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "How evidence can explain a complex social problem",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF71",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Your group must choose a project. Which role would you naturally prefer?",
    "displayOrder": 71,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Interviewing people and understanding their experiences",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Checking the fairness of the rules and arguments",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Planning the story, presentation or media output",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Finding evidence and organising the research",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF72",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "A community has a difficult problem. What would you want to do first?",
    "displayOrder": 72,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Listen to the people affected and understand their experiences",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Identify the rights, responsibilities and rules involved",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Create a clear message that helps people understand the issue",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Gather evidence and investigate possible causes",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF73",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which internship environment sounds most appealing?",
    "displayOrder": 73,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "A people-support or wellbeing organisation",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "A legal, civic or public-service organisation",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "A media, communication or creative organisation",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "A research, policy or social-development organisation",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF74",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "You discover two groups strongly disagree. What would you most likely do?",
    "displayOrder": 74,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Try to understand the experiences and concerns behind each side",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Compare the arguments with the relevant rules and rights",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Find a way to communicate the issue so both sides can understand it",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Look for evidence that explains why the disagreement developed",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF75",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which documentary would you choose first?",
    "displayOrder": 75,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "How people develop, cope and form relationships",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "How courts, governments or public institutions work",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "How media and storytelling shape culture",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "How societies respond to major global challenges",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF76",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Your teacher asks you to investigate a social issue. Which approach attracts you most?",
    "displayOrder": 76,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Interview people and explore their lived experiences",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Examine the laws, rights and institutions connected to it",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Create a visual or written story to communicate the issue",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Compare research and evidence to identify possible solutions",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF77",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "Which outcome would make you most proud after a team project?",
    "displayOrder": 77,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "A participant says the project helped them feel understood",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "The final recommendation is fair and well reasoned",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "The final product communicates the idea powerfully",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "The project produces a clear evidence-based explanation",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF78",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "If you could spend a day observing one setting, which would you choose?",
    "displayOrder": 78,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "A counselling, youth or wellbeing setting",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "A court, public office or civic institution",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "A newsroom, studio, cultural organisation or media team",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "A research centre, policy group or international organisation",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF79",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "A new social issue appears in the news. What would you be most curious to understand?",
    "displayOrder": 79,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "How it affects people's emotions and behaviour",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "What rules, rights and public responsibilities are involved",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "How the issue is being framed and communicated to the public",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "What evidence explains its causes and possible long-term effects",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  },
  {
    "code": "HCF80",
    "sectionCode": "SEC_CAREER_SCEN",
    "dimensionCode": "DIM_CAREER_SCEN",
    "questionType": "forced_choice_4",
    "questionText": "If all four options had the same status and salary, which type of work would you choose?",
    "displayOrder": 80,
    "isMandatory": true,
    "scoringMethod": "CAREER_CHOICE",
    "isReverseKeyed": false,
    "isPilot": false,
    "options": [
      {
        "optionKey": "A",
        "optionText": "Work centred on people, behaviour and wellbeing",
        "scoreValue": 1,
        "displayOrder": 1,
        "metadata": {
          "familyCode": "HUMAN_BEHAVIOUR_WELLBEING"
        }
      },
      {
        "optionKey": "B",
        "optionText": "Work centred on law, justice and public affairs",
        "scoreValue": 1,
        "displayOrder": 2,
        "metadata": {
          "familyCode": "LAW_PUBLIC_AFFAIRS_JUSTICE"
        }
      },
      {
        "optionKey": "C",
        "optionText": "Work centred on communication, culture and creative expression",
        "scoreValue": 1,
        "displayOrder": 3,
        "metadata": {
          "familyCode": "MEDIA_COMM_CREATIVE_CULTURE"
        }
      },
      {
        "optionKey": "D",
        "optionText": "Work centred on research, policy and social analysis",
        "scoreValue": 1,
        "displayOrder": 4,
        "metadata": {
          "familyCode": "EDUCATION_LANG_SOCIAL_RESEARCH"
        }
      }
    ]
  }
];
