/**
 * 3G MELIFE | ENGINEERING BRANCH FINDER CATALOG DATA
 * Authoritative specification extracted from 3G_MeLife_Engineering_Branch_Finder_v2_Scientific_Development.xlsx
 *
 * Status: Development / Pilot Required
 */

export interface EngineeringConstructDefinition {
  code: string;
  name: string;
  description: string;
  associatedBranches: string[];
}

export interface EngineeringBranchClusterData {
  code: string;
  name: string;
  coreFocus: string;
  exampleAreas: string;
  counsellingNote: string;
  primaryConstructs: string[];
  secondaryConstructs: string[];
  suggestedProjects: string[];
  keySchoolSubjects: string[];
}

export interface EngineeringOption {
  optionKey: string;
  optionText: string;
  scoreValue: number;
  branchCode?: string;
  constructCode?: string;
  displayOrder: number;
}

export interface EngineeringQuestionData {
  questionNumber: number;
  itemId: string;
  sectionCode: string;
  sectionName: string;
  dimensionCode: string;
  dimensionName: string;
  questionText: string;
  questionType: 'likert_1_4' | 'forced_choice_8';
  primaryBranchCode?: string | null;
  constructCode: string;
  options: EngineeringOption[];
}

export interface EngineeringSectionData {
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  questionRange: [number, number];
  questionType: 'likert_1_4' | 'forced_choice_8';
}

export const ENGINEERING_CONSTRUCTS: Record<string, EngineeringConstructDefinition> = {
  C01: {
    code: 'C01',
    name: 'Engineering & Technology Interest',
    description: 'General attraction to engineering, technology, designing, building, testing, and improving systems.',
    associatedBranches: ['CE', 'CHE'],
  },
  C02: {
    code: 'C02',
    name: 'Mathematical & Analytical Preference',
    description: 'Preference for quantitative reasoning, logic, structured analysis, patterns, and evidence-based problem solving.',
    associatedBranches: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'CHE', 'BME', 'AERO'],
  },
  C03: {
    code: 'C03',
    name: 'Computing & Information Systems',
    description: 'Interest in software, algorithms, data, automation, computational systems, and digital problem solving.',
    associatedBranches: ['CSE', 'ECE'],
  },
  C04: {
    code: 'C04',
    name: 'Physical Systems & Mechanics',
    description: 'Interest in machines, motion, forces, mechanisms, energy, physical systems, and mechanical behaviour.',
    associatedBranches: ['ME', 'AERO', 'EEE'],
  },
  C05: {
    code: 'C05',
    name: 'Electronics & Embedded Systems',
    description: 'Interest in circuits, sensors, electronics, control systems, communication devices, and embedded technology.',
    associatedBranches: ['ECE', 'EEE', 'CSE', 'BME', 'AERO'],
  },
  C06: {
    code: 'C06',
    name: 'Built Environment & Infrastructure',
    description: 'Interest in structures, construction, transportation systems, cities, infrastructure, and the physical built environment.',
    associatedBranches: ['CE'],
  },
  C07: {
    code: 'C07',
    name: 'Materials, Chemistry & Processes',
    description: 'Interest in materials, chemical systems, reactions, manufacturing processes, and industrial optimisation.',
    associatedBranches: ['CHE', 'ME'],
  },
  C08: {
    code: 'C08',
    name: 'Life Science & Human Systems',
    description: 'Interest in biology, health, medical technology, human systems, and engineering applications in life science.',
    associatedBranches: ['BME'],
  },
};

export const ENGINEERING_BRANCH_CLUSTERS: Record<string, EngineeringBranchClusterData> = {
  CSE: {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    coreFocus: 'Computation, software architecture, intelligent algorithms, cloud infrastructure, and data systems.',
    exampleAreas: 'Software Engineering, AI & Machine Learning, Cybersecurity, Cloud Computing, Distributed Systems, Data Science',
    counsellingNote: 'Check mathematics readiness and genuine passion for computational logic, coding, and abstract problem solving.',
    primaryConstructs: ['C03', 'C02', 'C05'],
    secondaryConstructs: ['C01'],
    suggestedProjects: [
      'Build a web application with full-stack database integration',
      'Create an automated AI text/image classifier or algorithm',
      'Contribute to open-source software and algorithm optimization',
      'Design a secure network or encrypted communication protocol'
    ],
    keySchoolSubjects: ['Mathematics', 'Computer Science / Informatics', 'Physics']
  },
  ECE: {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    coreFocus: 'Electronics, signal processing, wireless communication, microcontrollers, and embedded hardware.',
    exampleAreas: 'Embedded Systems, IoT, Wireless Telecom, VLSI Design, Signal Processing, Robotics Hardware',
    counsellingNote: 'Explore physics, mathematics, circuit analysis, and hands-on microcontroller/IoT exposure.',
    primaryConstructs: ['C05', 'C02', 'C03'],
    secondaryConstructs: ['C01', 'C04'],
    suggestedProjects: [
      'Design an Arduino/ESP32 sensor monitoring station',
      'Build a wireless communication link or radio transceiver module',
      'Simulate and breadboard analog and digital logic circuits',
      'Program a microcontroller to control motors and optical sensors'
    ],
    keySchoolSubjects: ['Physics', 'Mathematics', 'Computer Science']
  },
  EEE: {
    code: 'EEE',
    name: 'Electrical Engineering',
    coreFocus: 'Power generation, electrical machines, smart grids, control systems, and renewable energy.',
    exampleAreas: 'Power Systems, Renewable Energy, Electric Vehicles, Industrial Automation, Control Engineering, High Voltage',
    counsellingNote: 'Check physics/mathematics foundation and interest in energy systems, electrification, and large-scale power.',
    primaryConstructs: ['C05', 'C04', 'C02'],
    secondaryConstructs: ['C01', 'C07'],
    suggestedProjects: [
      'Build a solar-powered battery management circuit',
      'Design an automated power-switching or motor control circuit',
      'Simulate power distribution and renewable energy grid integration',
      'Investigate electric vehicle powertrain and inverter efficiency'
    ],
    keySchoolSubjects: ['Physics', 'Mathematics', 'Chemistry']
  },
  ME: {
    code: 'ME',
    name: 'Mechanical Engineering',
    coreFocus: 'Mechanics, kinematics, thermodynamics, CAD design, manufacturing processes, and physical machinery.',
    exampleAreas: 'Robotics, Automotive Engineering, Thermal Systems, Precision Manufacturing, Product Design, Mechatronics',
    counsellingNote: 'Explore physics, mathematics, spatial reasoning, CAD design tools, and practical workshop interest.',
    primaryConstructs: ['C04', 'C02', 'C07'],
    secondaryConstructs: ['C01', 'C05'],
    suggestedProjects: [
      'Design 3D mechanical components using CAD and 3D print prototypes',
      'Build a mechanical linkage, gearbox, or robotic gripper',
      'Analyse stress and thermal dissipation in mechanical structures',
      'Construct a working wind turbine or fluid propulsion mechanism'
    ],
    keySchoolSubjects: ['Physics', 'Mathematics', 'Engineering Graphics / Design']
  },
  CE: {
    code: 'CE',
    name: 'Civil Engineering',
    coreFocus: 'Structural analysis, infrastructure, transportation networks, environmental engineering, and sustainable urban design.',
    exampleAreas: 'Structural Engineering, Transportation Systems, Geotechnical Engineering, Water Resources, Sustainable Cities, Construction Management',
    counsellingNote: 'Consider mathematics, physics, spatial thinking, and interest in shaping resilient public infrastructure.',
    primaryConstructs: ['C06', 'C02', 'C01'],
    secondaryConstructs: ['C07', 'C04'],
    suggestedProjects: [
      'Design a scale-model bridge and test load-bearing capacity',
      'Model stormwater drainage and flood mitigation for a local area',
      'Survey sustainable building materials (e.g. geopolymers, timber)',
      'Analyze traffic flow and transportation routing efficiency'
    ],
    keySchoolSubjects: ['Physics', 'Mathematics', 'Geography / Environmental Science']
  },
  CHE: {
    code: 'CHE',
    name: 'Chemical Engineering',
    coreFocus: 'Chemical reaction engineering, industrial separation, fluid dynamics, energy conversion, and advanced materials synthesis.',
    exampleAreas: 'Process Engineering, Pharmaceuticals, Green Hydrogen & Energy, Polymers & Materials, Food Processing, Environmental Remediation',
    counsellingNote: 'Explore chemistry, mathematics, process systems thinking, and safety-oriented engineering.',
    primaryConstructs: ['C07', 'C02', 'C01'],
    secondaryConstructs: ['C04', 'C08'],
    suggestedProjects: [
      'Design a water purification and chemical filtration process',
      'Synthesize biodegradable bioplastics from organic plant starch',
      'Model reaction kinetics and heat exchanger efficiency in a process',
      'Explore biofuel extraction and renewable chemical energy synthesis'
    ],
    keySchoolSubjects: ['Chemistry', 'Mathematics', 'Physics']
  },
  BME: {
    code: 'BME',
    name: 'Biomedical Engineering',
    coreFocus: 'Engineering applied to human physiology, medical instrumentation, biomaterials, and assistive healthcare technology.',
    exampleAreas: 'Medical Devices, Biosensors, Biomechanics & Prosthetics, Neural Engineering, Tissue Engineering, Medical Imaging',
    counsellingNote: 'Explore biology/health curiosity combined with mathematics, physics, sensors, and technical problem solving.',
    primaryConstructs: ['C08', 'C02', 'C05'],
    secondaryConstructs: ['C04', 'C07'],
    suggestedProjects: [
      'Build a DIY electrocardiogram (ECG) or optical heart-rate monitor',
      'Design a 3D-printable ergonomic prosthetic finger or assistive grip',
      'Analyze gait biomechanics using smartphone accelerometer data',
      'Investigate biocompatible hydrogels for controlled drug delivery'
    ],
    keySchoolSubjects: ['Biology', 'Physics', 'Mathematics', 'Chemistry']
  },
  AERO: {
    code: 'AERO',
    name: 'Aerospace Engineering',
    coreFocus: 'Aerodynamics, flight mechanics, orbital dynamics, propulsion systems, avionics, and lightweight aerospace structures.',
    exampleAreas: 'Aircraft Design, Drones & UAVs, Rocket Propulsion, Spacecraft Systems, Flight Control & Avionics, Hypersonics',
    counsellingNote: 'Strong foundation in mathematics and physics, rigorous analytical discipline, and high flight/space enthusiasm are essential.',
    primaryConstructs: ['C04', 'C02', 'C05'],
    secondaryConstructs: ['C01', 'C07'],
    suggestedProjects: [
      'Design and wind-tunnel test custom airfoil profiles in CFD software',
      'Build and pilot an autonomous waypoint-navigating quadcopter drone',
      'Simulate rocket orbital trajectories and staged propulsion thrust',
      'Calculate structural load and flutter limits on composite wing spars'
    ],
    keySchoolSubjects: ['Physics', 'Mathematics', 'Computer Science']
  }
};

export const ENGINEERING_SECTIONS: EngineeringSectionData[] = [
  {
    code: 'BRANCH_PREFERENCE_LIKERT',
    name: 'Engineering Branch Preferences',
    description: 'Reflects your interest and affinity for core activities, problem-solving domains, and technologies across 8 engineering disciplines.',
    displayOrder: 1,
    questionRange: [1, 64],
    questionType: 'likert_1_4',
  },
  {
    code: 'FORCED_CHOICE_SCENARIOS',
    name: 'Engineering Exploration Scenarios',
    description: 'Forced-choice practical project and lab scenarios helping identify your strongest intuitive engineering calling.',
    displayOrder: 2,
    questionRange: [65, 80],
    questionType: 'forced_choice_8',
  },
];

export const ENGINEERING_QUESTIONS: EngineeringQuestionData[] = [
  {
    "questionNumber": 1,
    "itemId": "E01",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_ENGINEERING_INTEREST",
    "dimensionName": "CSE - Engineering Interest",
    "questionText": "I enjoy thinking about how software, algorithms, or digital systems can solve problems.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 2,
    "itemId": "E02",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "CSE - Analytical & Mathematical Thinking",
    "questionText": "I like breaking a complex task into clear logical instructions.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 3,
    "itemId": "E03",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "CSE - Design & Systems Thinking",
    "questionText": "I enjoy finding efficient ways to organise or process information.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 4,
    "itemId": "E04",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "CSE - Technical & Practical Problem Solving",
    "questionText": "I am curious about how apps, websites, AI systems, or computer programs work.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 5,
    "itemId": "E05",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "CSE - Engineering Work & Impact",
    "questionText": "I like debugging a problem by testing one possible cause at a time.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 6,
    "itemId": "E06",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_ENGINEERING_INTEREST",
    "dimensionName": "CSE - Engineering Interest",
    "questionText": "I enjoy creating digital solutions that other people can use.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 7,
    "itemId": "E07",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "CSE - Analytical & Mathematical Thinking",
    "questionText": "I am interested in data, automation, cybersecurity, or intelligent systems.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 8,
    "itemId": "E08",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CSE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "CSE - Design & Systems Thinking",
    "questionText": "I would enjoy designing a system that combines logic, software, and user needs.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CSE",
    "constructCode": "C03",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CSE",
        "constructCode": "C03"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CSE",
        "constructCode": "C03"
      }
    ]
  },
  {
    "questionNumber": 9,
    "itemId": "E09",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_ENGINEERING_INTEREST",
    "dimensionName": "ECE - Engineering Interest",
    "questionText": "I am curious about how electronic devices communicate signals and information.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 10,
    "itemId": "E10",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "ECE - Analytical & Mathematical Thinking",
    "questionText": "I enjoy understanding how circuits, sensors, or communication systems work.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 11,
    "itemId": "E11",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "ECE - Design & Systems Thinking",
    "questionText": "I like exploring how hardware and software can work together.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 12,
    "itemId": "E12",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "ECE - Technical & Practical Problem Solving",
    "questionText": "I am interested in wireless communication, embedded systems, or connected devices.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 13,
    "itemId": "E13",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "ECE - Engineering Work & Impact",
    "questionText": "I enjoy testing how electronic components behave under different conditions.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 14,
    "itemId": "E14",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_ENGINEERING_INTEREST",
    "dimensionName": "ECE - Engineering Interest",
    "questionText": "I like understanding how devices convert, process, or transmit signals.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 15,
    "itemId": "E15",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "ECE - Analytical & Mathematical Thinking",
    "questionText": "I would enjoy designing technology for communication, sensing, or automation.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 16,
    "itemId": "E16",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ECE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "ECE - Design & Systems Thinking",
    "questionText": "I am curious about areas such as robotics electronics, IoT, or signal processing.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ECE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ECE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ECE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 17,
    "itemId": "E17",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_ENGINEERING_INTEREST",
    "dimensionName": "EEE - Engineering Interest",
    "questionText": "I am interested in how electrical energy is generated, controlled, transmitted, or used.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 18,
    "itemId": "E18",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "EEE - Analytical & Mathematical Thinking",
    "questionText": "I enjoy understanding motors, power systems, circuits, or electrical machines.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 19,
    "itemId": "E19",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "EEE - Design & Systems Thinking",
    "questionText": "I like solving problems involving electrical measurements and relationships.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 20,
    "itemId": "E20",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "EEE - Technical & Practical Problem Solving",
    "questionText": "I am curious about renewable energy and how power systems can become more efficient.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 21,
    "itemId": "E21",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "EEE - Engineering Work & Impact",
    "questionText": "I would enjoy working with electrical equipment while following strict safety procedures.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 22,
    "itemId": "E22",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_ENGINEERING_INTEREST",
    "dimensionName": "EEE - Engineering Interest",
    "questionText": "I like understanding how control systems make machines or processes operate reliably.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 23,
    "itemId": "E23",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "EEE - Analytical & Mathematical Thinking",
    "questionText": "I am interested in smart grids, power electronics, automation, or energy systems.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 24,
    "itemId": "E24",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "EEE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "EEE - Design & Systems Thinking",
    "questionText": "I would enjoy designing or improving systems that use electrical energy effectively.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "EEE",
    "constructCode": "C05",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "EEE",
        "constructCode": "C05"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "EEE",
        "constructCode": "C05"
      }
    ]
  },
  {
    "questionNumber": 25,
    "itemId": "E25",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_ENGINEERING_INTEREST",
    "dimensionName": "ME - Engineering Interest",
    "questionText": "I enjoy understanding how machines move and how mechanical parts interact.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 26,
    "itemId": "E26",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "ME - Analytical & Mathematical Thinking",
    "questionText": "I am interested in engines, manufacturing, robotics, or mechanical systems.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 27,
    "itemId": "E27",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "ME - Design & Systems Thinking",
    "questionText": "I like thinking about forces, motion, materials, and how objects behave.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 28,
    "itemId": "E28",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "ME - Technical & Practical Problem Solving",
    "questionText": "I enjoy practical projects involving mechanisms, tools, or machines.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 29,
    "itemId": "E29",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "ME - Engineering Work & Impact",
    "questionText": "I am curious about how products are manufactured and how production can be improved.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 30,
    "itemId": "E30",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_ENGINEERING_INTEREST",
    "dimensionName": "ME - Engineering Interest",
    "questionText": "I like testing a physical design to see whether it performs as expected.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 31,
    "itemId": "E31",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "ME - Analytical & Mathematical Thinking",
    "questionText": "I would enjoy learning about thermodynamics, mechanics, or machine design.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 32,
    "itemId": "E32",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "ME_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "ME - Design & Systems Thinking",
    "questionText": "I am interested in automation, manufacturing, vehicles, or industrial systems.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "ME",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "ME",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "ME",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 33,
    "itemId": "E33",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_ENGINEERING_INTEREST",
    "dimensionName": "CE - Engineering Interest",
    "questionText": "I am interested in how buildings, bridges, roads, and other infrastructure are designed.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 34,
    "itemId": "E34",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "CE - Analytical & Mathematical Thinking",
    "questionText": "I enjoy thinking about how structures can remain safe under different conditions.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 35,
    "itemId": "E35",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "CE - Design & Systems Thinking",
    "questionText": "I am curious about construction materials and how they behave.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 36,
    "itemId": "E36",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "CE - Technical & Practical Problem Solving",
    "questionText": "I like visualising spaces, structures, measurements, and physical layouts.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 37,
    "itemId": "E37",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "CE - Engineering Work & Impact",
    "questionText": "I would enjoy projects connected to cities, transportation, water, or infrastructure.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 38,
    "itemId": "E38",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_ENGINEERING_INTEREST",
    "dimensionName": "CE - Engineering Interest",
    "questionText": "I am interested in sustainable construction and efficient use of land and resources.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 39,
    "itemId": "E39",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "CE - Analytical & Mathematical Thinking",
    "questionText": "I like the idea of coordinating a project from design through construction.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 40,
    "itemId": "E40",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "CE - Design & Systems Thinking",
    "questionText": "I would enjoy solving practical problems involving structures, sites, or the built environment.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CE",
    "constructCode": "C06",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CE",
        "constructCode": "C06"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CE",
        "constructCode": "C06"
      }
    ]
  },
  {
    "questionNumber": 41,
    "itemId": "E41",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_ENGINEERING_INTEREST",
    "dimensionName": "CHE - Engineering Interest",
    "questionText": "I am curious about how raw materials can be transformed into useful products.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 42,
    "itemId": "E42",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "CHE - Analytical & Mathematical Thinking",
    "questionText": "I enjoy thinking about processes that involve heat, pressure, mixtures, or reactions.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 43,
    "itemId": "E43",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "CHE - Design & Systems Thinking",
    "questionText": "I am interested in how chemicals are produced safely at industrial scale.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 44,
    "itemId": "E44",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "CHE - Technical & Practical Problem Solving",
    "questionText": "I like understanding how changing one process condition can affect an outcome.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 45,
    "itemId": "E45",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "CHE - Engineering Work & Impact",
    "questionText": "I would enjoy working with process diagrams, measurements, and controlled experiments.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 46,
    "itemId": "E46",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_ENGINEERING_INTEREST",
    "dimensionName": "CHE - Engineering Interest",
    "questionText": "I am interested in energy efficiency, materials, food, pharmaceuticals, or industrial processes.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 47,
    "itemId": "E47",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "CHE - Analytical & Mathematical Thinking",
    "questionText": "I care about how engineering can reduce waste and improve resource efficiency.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 48,
    "itemId": "E48",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "CHE_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "CHE - Design & Systems Thinking",
    "questionText": "I would enjoy designing or improving a process while considering safety and environmental impact.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "CHE",
    "constructCode": "C07",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "CHE",
        "constructCode": "C07"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "CHE",
        "constructCode": "C07"
      }
    ]
  },
  {
    "questionNumber": 49,
    "itemId": "E49",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_ENGINEERING_INTEREST",
    "dimensionName": "BME - Engineering Interest",
    "questionText": "I am interested in how engineering can help understand or improve human health.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 50,
    "itemId": "E50",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "BME - Analytical & Mathematical Thinking",
    "questionText": "I enjoy learning how medical devices, sensors, or assistive technologies work.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 51,
    "itemId": "E51",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "BME - Design & Systems Thinking",
    "questionText": "I am curious about the interaction between engineering systems and the human body.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 52,
    "itemId": "E52",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "BME - Technical & Practical Problem Solving",
    "questionText": "I would enjoy designing technology that helps diagnose, monitor, or support patients.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 53,
    "itemId": "E53",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "BME - Engineering Work & Impact",
    "questionText": "I like solving technical problems where safety and human wellbeing are important.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 54,
    "itemId": "E54",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_ENGINEERING_INTEREST",
    "dimensionName": "BME - Engineering Interest",
    "questionText": "I am interested in biomedical signals, prosthetics, rehabilitation, or medical instrumentation.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 55,
    "itemId": "E55",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "BME - Analytical & Mathematical Thinking",
    "questionText": "I enjoy combining ideas from biology, technology, and engineering.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 56,
    "itemId": "E56",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "BME_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "BME - Design & Systems Thinking",
    "questionText": "I would be motivated by engineering projects with a direct healthcare or accessibility impact.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "BME",
    "constructCode": "C08",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "BME",
        "constructCode": "C08"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "BME",
        "constructCode": "C08"
      }
    ]
  },
  {
    "questionNumber": 57,
    "itemId": "E57",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_ENGINEERING_INTEREST",
    "dimensionName": "AERO - Engineering Interest",
    "questionText": "I am fascinated by how aircraft, spacecraft, or flying systems are designed and controlled.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 58,
    "itemId": "E58",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "AERO - Analytical & Mathematical Thinking",
    "questionText": "I enjoy thinking about motion, forces, aerodynamics, and the behaviour of vehicles in air or space.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 59,
    "itemId": "E59",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "AERO - Design & Systems Thinking",
    "questionText": "I am curious about propulsion systems and how energy is converted into motion.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 60,
    "itemId": "E60",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_TECHNICAL_&_PRACTICAL_PROBLEM_SOLVING",
    "dimensionName": "AERO - Technical & Practical Problem Solving",
    "questionText": "I like solving engineering problems where weight, speed, stability, and safety interact.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 61,
    "itemId": "E61",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_ENGINEERING_WORK_&_IMPACT",
    "dimensionName": "AERO - Engineering Work & Impact",
    "questionText": "I would enjoy learning how aircraft structures are designed to handle demanding conditions.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 62,
    "itemId": "E62",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_ENGINEERING_INTEREST",
    "dimensionName": "AERO - Engineering Interest",
    "questionText": "I am interested in navigation, flight control, space systems, or advanced materials.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 63,
    "itemId": "E63",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_ANALYTICAL_&_MATHEMATICAL_THINKING",
    "dimensionName": "AERO - Analytical & Mathematical Thinking",
    "questionText": "I enjoy highly precise engineering problems where small changes can affect performance.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 64,
    "itemId": "E64",
    "sectionCode": "BRANCH_PREFERENCE_LIKERT",
    "sectionName": "Engineering Branch Preferences",
    "dimensionCode": "AERO_DESIGN_&_SYSTEMS_THINKING",
    "dimensionName": "AERO - Design & Systems Thinking",
    "questionText": "I would be motivated by projects related to aviation, space technology, or autonomous flight.",
    "questionType": "likert_1_4",
    "primaryBranchCode": "AERO",
    "constructCode": "C04",
    "options": [
      {
        "optionKey": "1",
        "optionText": "Not at all like me",
        "scoreValue": 1,
        "displayOrder": 1,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "2",
        "optionText": "A little like me",
        "scoreValue": 2,
        "displayOrder": 2,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "3",
        "optionText": "Mostly like me",
        "scoreValue": 3,
        "displayOrder": 3,
        "branchCode": "AERO",
        "constructCode": "C04"
      },
      {
        "optionKey": "4",
        "optionText": "Very much like me",
        "scoreValue": 4,
        "displayOrder": 4,
        "branchCode": "AERO",
        "constructCode": "C04"
      }
    ]
  },
  {
    "questionNumber": 65,
    "itemId": "E65",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which project would you most like to work on?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Build an AI or software system",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Design a smart communication device",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Improve an energy or electrical control system",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Design a machine or automated mechanism",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Design a bridge or sustainable building system",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Improve an industrial chemical process",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Create a medical device or health technology",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Design an aircraft, drone, or space system",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 66,
    "itemId": "E66",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which technical problem sounds most interesting?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Make an algorithm faster",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Improve a wireless signal",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Reduce electrical energy loss",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Reduce machine vibration",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Strengthen a structure",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Improve process efficiency",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Improve a patient-monitoring device",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Improve flight stability",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 67,
    "itemId": "E67",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which laboratory would you most like to explore?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "AI/computing lab",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Electronics/IoT lab",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Power/energy lab",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Robotics/manufacturing lab",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Structures/construction lab",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Process/chemical lab",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Biomedical/medical-device lab",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Aerospace/flight lab",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 68,
    "itemId": "E68",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which future technology attracts you most?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Artificial intelligence",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Connected devices",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Smart energy grids",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Autonomous machines",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Sustainable cities",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Advanced industrial materials",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Personalised medical technology",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Autonomous flight",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 69,
    "itemId": "E69",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which engineering task sounds most satisfying?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Debug a complex program",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Test a sensor system",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Optimise an electrical circuit",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Build a working mechanism",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Plan a safe structural solution",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Optimise a production process",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Test a health-monitoring device",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Improve an aircraft component",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 70,
    "itemId": "E70",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which internship would you choose?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Software engineering team",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Embedded/electronics team",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Energy/control team",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Mechanical design team",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Construction/infrastructure team",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Process engineering team",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Medical technology team",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Aerospace engineering team",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 71,
    "itemId": "E71",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which challenge would you rather solve?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "A digital system gives inconsistent results",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "A device loses communication",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "A power system is inefficient",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "A machine behaves unexpectedly",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "A structure must handle a new load",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "A production process wastes material",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "A medical sensor gives unreliable readings",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "A flying vehicle becomes unstable",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 72,
    "itemId": "E72",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which product would you most enjoy improving?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "A learning application",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "A connected wearable device",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "A home energy system",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "A robotic machine",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "A flood-resistant community facility",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "A safer industrial product",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "A rehabilitation device",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "A high-efficiency drone",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 73,
    "itemId": "E73",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which type of engineering work would you prefer?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Software and data",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Signals and electronics",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Energy and control",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Mechanics and manufacturing",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Structures and infrastructure",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Processes and materials",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Health and human systems",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Flight and space systems",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 74,
    "itemId": "E74",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which project outcome would make you most proud?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Creating a useful digital solution",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Making a device communicate reliably",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Making energy use safer and more efficient",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Making a machine work better",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Making a structure safer",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Making a process cleaner",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Helping people through technology",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Improving flight or space performance",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 75,
    "itemId": "E75",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which topic would you explore for a personal project?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Algorithms, AI, or computing",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Signals, circuits, or communication",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Power, energy, or control",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Mechanics, robotics, or manufacturing",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Structures, materials, or cities",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Chemistry, processes, or industrial systems",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Biology, medical devices, or rehabilitation",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Aerodynamics, propulsion, or space",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 76,
    "itemId": "E76",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which environment would you enjoy working in?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Computing/technology centre",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Electronics/communication lab",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Energy/power facility",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Workshop/manufacturing plant",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Construction/design office",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Industrial process plant",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Hospital/biomedical lab",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Aviation/space facility",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 77,
    "itemId": "E77",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which problem would keep you curious for longer?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "How software can learn or automate",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "How devices can sense and communicate",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "How energy systems can become smarter",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "How machines can become more precise",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "How infrastructure can become more resilient",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "How processes can reduce waste",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "How technology can improve health",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "How aircraft can become safer",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 78,
    "itemId": "E78",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which engineering role sounds most appealing?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Software systems engineer",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Electronics/communication engineer",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Power/control engineer",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Mechanical/manufacturing engineer",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Civil/infrastructure engineer",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Chemical/process engineer",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Biomedical engineer",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Aerospace engineer",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 79,
    "itemId": "E79",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "Which innovation would you like to help develop?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "A new AI-enabled service",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "A low-power connected device",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "A clean-energy technology",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "A next-generation robot",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "A sustainable infrastructure solution",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "A low-waste industrial process",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "A smart medical device",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "A safer autonomous aircraft",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  },
  {
    "questionNumber": 80,
    "itemId": "E80",
    "sectionCode": "FORCED_CHOICE_SCENARIOS",
    "sectionName": "Engineering Exploration Scenarios",
    "dimensionCode": "FORCED_CHOICE_SCENARIOS",
    "dimensionName": "Engineering Exploration Scenarios",
    "questionText": "If you had one year for an engineering project, what would you choose?",
    "questionType": "forced_choice_8",
    "primaryBranchCode": null,
    "constructCode": "FORCED_CHOICE",
    "options": [
      {
        "optionKey": "A",
        "optionText": "Build an intelligent digital platform",
        "scoreValue": 1,
        "branchCode": "CSE",
        "constructCode": "C03",
        "displayOrder": 1
      },
      {
        "optionKey": "B",
        "optionText": "Build a connected sensing network",
        "scoreValue": 1,
        "branchCode": "ECE",
        "constructCode": "C05",
        "displayOrder": 2
      },
      {
        "optionKey": "C",
        "optionText": "Build a renewable-energy control system",
        "scoreValue": 1,
        "branchCode": "EEE",
        "constructCode": "C05",
        "displayOrder": 3
      },
      {
        "optionKey": "D",
        "optionText": "Build an automated machine",
        "scoreValue": 1,
        "branchCode": "ME",
        "constructCode": "C04",
        "displayOrder": 4
      },
      {
        "optionKey": "E",
        "optionText": "Design a resilient community structure",
        "scoreValue": 1,
        "branchCode": "CE",
        "constructCode": "C06",
        "displayOrder": 5
      },
      {
        "optionKey": "F",
        "optionText": "Design a cleaner production process",
        "scoreValue": 1,
        "branchCode": "CHE",
        "constructCode": "C07",
        "displayOrder": 6
      },
      {
        "optionKey": "G",
        "optionText": "Design an assistive medical technology",
        "scoreValue": 1,
        "branchCode": "BME",
        "constructCode": "C08",
        "displayOrder": 7
      },
      {
        "optionKey": "H",
        "optionText": "Design an autonomous flying system",
        "scoreValue": 1,
        "branchCode": "AERO",
        "constructCode": "C04",
        "displayOrder": 8
      }
    ]
  }
];
