export type EntrepreneurArchetypeCode =
  | "INNOVATOR"
  | "BUILDER"
  | "LEADER"
  | "EXPLORER"
  | "GROWTH_ENTREPRENEUR";

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
  weight: number;
  measurementArea?: string;
  coreIndicators?: string[];
  developmentalFocus?: string;
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
  maxPoints?: number;
  isMandatory: boolean;
  scoringMethod: string;
  options: AssessmentOptionCatalogItem[];
}

export interface EntrepreneurProfileDefinition {
  code: EntrepreneurArchetypeCode;
  title: string;
  subtitle: string;
  tagline: string;
  badgeColor: string;
  description: string;
  dominantDimensions: string[];
  idealVentureTypes: string[];
  strengthSuperpowers: string[];
  keySuperpowers?: string[];
  developmentalFocus: string[];
  blindSpots?: string[];
  idealCoFounders?: string[];
  leadershipStyle: string;
  executionStrategy: string;
  roadmap?: Array<{ phase: string; timeframe: string; keyActions: string[]; milestone?: string }>;
  startupRoadmap: {
    stage1Ideation: string;
    stage2Validation: string;
    stage3Execution: string;
    stage4Scale: string;
  };
}

// 1. Core Entrepreneur Dimensions
export const ENTREPRENEUR_DIMENSIONS: AssessmentDimensionCatalogItem[] = [
  {
    code: "DIM_ENTR_INTEREST",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Entrepreneurial Interest & Passion",
    description: "Intrinsic motivation to launch independent initiatives, autonomy drive, and passion for creating new value.",
    displayOrder: 1,
    weight: 0.1,
    measurementArea: "Intrinsic Drive, Autonomy Preference, Venture Ambition",
    coreIndicators: [
      "Preference for self-directed projects over routine corporate roles",
      "Excitement when imagining new business concepts and services",
      "Willingness to invest personal energy into building long-term assets",
      "Strong desire to make a tangible commercial and social impact",
    ],
    developmentalFocus: "Channeling raw enthusiasm into structured business discovery and founder discipline.",
  },
  {
    code: "DIM_OPP_RECOGNITION",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Opportunity Recognition & Market Sensitivity",
    description: "Ability to spot unmet customer needs, observe market inefficiencies, and identify viable commercial openings.",
    displayOrder: 2,
    weight: 0.1,
    measurementArea: "Customer Pain-Point Identification, Market Gap Analysis, Trend Awareness",
    coreIndicators: [
      "Noticing daily friction points and contemplating commercial solutions",
      "Tracking emerging consumer habits and technology shifts",
      "Evaluating competitive offerings to find neglected customer segments",
      "Connecting disparate market signals to identify early trends",
    ],
    developmentalFocus: "Systematic market sizing, value proposition mapping, and customer interview methodologies.",
  },
  {
    code: "DIM_INNOVATION_CREAT",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Innovation & Creative Problem Solving",
    description: "Conceptual originality, lateral thinking, and the capability to invent novel product or service architectures.",
    displayOrder: 3,
    weight: 0.1,
    measurementArea: "Lateral Thinking, Solution Design, Differentiated Product Ideation",
    coreIndicators: [
      "Generating multiple creative approaches when standard methods fail",
      "Combining ideas from different industries to create hybrid solutions",
      "Challenging conventional industry assumptions and orthodoxies",
      "Rapid conceptual prototyping of new features and experiences",
    ],
    developmentalFocus: "Structured design thinking, TRIZ principles, and creative constraint management.",
  },
  {
    code: "DIM_BUSINESS_THINKING",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Analytical & Business Thinking",
    description: "Understanding commercial sustainability, revenue mechanisms, cost structures, and unit economics.",
    displayOrder: 4,
    weight: 0.1,
    measurementArea: "Business Models, Monetization Logic, Cost & Margin Awareness",
    coreIndicators: [
      "Analyzing how a product actually generates sustainable cash flow",
      "Evaluating pricing models, customer acquisition costs, and margins",
      "Using quantitative metrics to validate assumptions rather than intuition alone",
      "Understanding scalable distribution channels and go-to-market mechanics",
    ],
    developmentalFocus: "Lean business model canvas mastery, financial forecasting, and unit economics modeling.",
  },
  {
    code: "DIM_LEADERSHIP_INFL",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Leadership & Team Orchestration",
    description: "Ability to inspire co-founders, align team members around a unified vision, and foster high-performance culture.",
    displayOrder: 5,
    weight: 0.1,
    measurementArea: "Vision Alignment, Talent Attraction, Delegation, Culture Building",
    coreIndicators: [
      "Motivating peers and co-workers toward ambitious common milestones",
      "Delegating responsibilities and empowering team member ownership",
      "Resolving inter-team conflicts with constructive objectivity",
      "Attracting skilled collaborators by articulating a compelling mission",
    ],
    developmentalFocus: "Situational leadership frameworks, performance accountability, and collaborative governance.",
  },
  {
    code: "DIM_COMM_PITCHING",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Communication & Pitching Capability",
    description: "Persuasive storytelling, investor pitching, customer negotiation, and articulating crisp value propositions.",
    displayOrder: 6,
    weight: 0.1,
    measurementArea: "Persuasive Storytelling, Investor Deck Pitching, Stakeholder Negotiation",
    coreIndicators: [
      "Explaining complex product ideas in simple, compelling language",
      "Structuring high-impact investor pitches and client proposals",
      "Handling tough stakeholder questions and objections with composure",
      "Adapting presentation style to investors, customers, or technical teams",
    ],
    developmentalFocus: "Executive pitch rehearsals, narrative architecture, and value proposition clarity.",
  },
  {
    code: "DIM_EXECUTION_INIT",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Execution & Operational Initiative",
    description: "Action-oriented bias, speed of implementation, milestone delivery, and bootstrapping resourcefulness.",
    displayOrder: 7,
    weight: 0.1,
    measurementArea: "Action Bias, Minimum Viable Product (MVP) Delivery, Resourcefulness",
    coreIndicators: [
      "Translating abstract plans into concrete weekly deliverables",
      "Launching basic MVPs rapidly to test assumptions in the real world",
      "Overcoming resource constraints through resourceful hacking and thrift",
      "Maintaining relentless momentum despite administrative hurdles",
    ],
    developmentalFocus: "Agile sprint management, OKR tracking, and lean MVP validation cycles.",
  },
  {
    code: "DIM_RISK_TOLERANCE",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Risk Tolerance & Calculated Decision Making",
    description: "Comfort operating under high ambiguity, taking calculated financial/career bets, and mitigating downside risks.",
    displayOrder: 8,
    weight: 0.1,
    measurementArea: "Ambiguity Management, Calculated Risk Taking, Downside Mitigation",
    coreIndicators: [
      "Making decisive moves with incomplete data rather than waiting for certainty",
      "Structuring experiments where potential upside is high and downside is capped",
      "Comfort stepping away from predictable routines to pursue high-growth ventures",
      "Anticipating worst-case scenarios and preparing robust contingency plans",
    ],
    developmentalFocus: "Decision-tree modeling, probabilistic thinking, and risk hedge structuring.",
  },
  {
    code: "DIM_RESILIENCE_GRIT",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Resilience, Grit & Ambiguity Tolerance",
    description: "Psychological stamina, persevering through customer rejections, and bouncing back stronger from venture setbacks.",
    displayOrder: 9,
    weight: 0.1,
    measurementArea: "Rejection Immunity, Emotional Tenacity, Setback Recovery",
    coreIndicators: [
      "Staying motivated after hearing multiple 'no's from clients or investors",
      "Viewing venture failures as informative data points rather than personal defeat",
      "Maintaining emotional equilibrium during high-pressure crises",
      "Sustaining multi-year focus on difficult foundational goals",
    ],
    developmentalFocus: "Stress inoculation, cognitive reframing, and founder support peer circles.",
  },
  {
    code: "DIM_GROWTH_MINDSET",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    name: "Growth Mindset & Continuous Adaptability",
    description: "Capacity to unlearn obsolete assumptions, absorb critical feedback, and execute agile product/business pivots.",
    displayOrder: 10,
    weight: 0.1,
    measurementArea: "Pivot Agility, Feedback Receptivity, Rapid Self-Directed Learning",
    coreIndicators: [
      "Actively seeking out negative customer feedback to improve offerings",
      "Pivoting product direction swiftly when market data disproves initial hypotheses",
      "Rapidly acquiring new domain skills required for current company stage",
      "Embracing curiosity over dogmatic adherence to initial concepts",
    ],
    developmentalFocus: "Customer feedback loops, double-loop learning, and agile business experimentation.",
  },
];

// 2. The 5 Startup Archetypes / Profiles
export const ENTREPRENEUR_PROFILES: Record<string, EntrepreneurProfileDefinition> = {
  INNOVATOR: {
    code: "INNOVATOR",
    title: "The Visionary Innovator",
    subtitle: "Inventive Solution Architect & Creative Disruptor",
    tagline: "Driven by breakthrough ideas, technological differentiation, and novel problem design.",
    badgeColor: "#00BFA5",
    description:
      "You are a creative powerhouse who naturally sees possibilities where others see walls. Your primary entrepreneurial instinct is to build novel, differentiated, and highly inventive solutions. You excel at product ideation, user experience innovation, and disruptive business models.",
    dominantDimensions: ["DIM_INNOVATION_CREAT", "DIM_OPP_RECOGNITION", "DIM_GROWTH_MINDSET"],
    idealVentureTypes: [
      "Deep Tech & AI Startups",
      "Novel Consumer Apps & Digital Products",
      "Design & Creative Studios",
      "R&D / Hardware Innovation Ventures",
    ],
    strengthSuperpowers: [
      "Generating unique, defensible product concepts that disrupt established markets",
      "Reframing complex user problems into intuitive digital or physical experiences",
      "Rapidly experimenting with new technologies, tools, and creative paradigms",
    ],
    developmentalFocus: [
      "Pair with strong operational and business co-founders to balance visionary ideation with commercial execution",
      "Maintain tight focus on customer willingness-to-pay before over-engineering solutions",
    ],
    leadershipStyle: "Inspirational & Creative — Champions inventive thinking and continuous experimentation.",
    executionStrategy: "Agile Prototyping — Builds fast proof-of-concepts to validate novel assumptions.",
    startupRoadmap: {
      stage1Ideation: "Conduct lateral brainstorming sessions and patent/differentiation audits.",
      stage2Validation: "Build rapid wireframes or Figma prototypes to test customer engagement.",
      stage3Execution: "Partner with a commercial/sales lead to establish clear unit economics.",
      stage4Scale: "Build IP defensibility and continuous innovation feedback loops.",
    },
  },
  BUILDER: {
    code: "BUILDER",
    title: "The Strategic Builder",
    subtitle: "Operational Powerhouse & Commercial Execution Master",
    tagline: "Driven by rigorous execution, monetization clarity, unit economics, and operational excellence.",
    badgeColor: "#00B8D4",
    description:
      "You are an exceptional executor with a laser focus on business viability, sustainable margins, and operational discipline. You don't just dream of ideas—you engineer the machines, workflows, and supply chains that turn ideas into profitable enterprise reality.",
    dominantDimensions: ["DIM_BUSINESS_THINKING", "DIM_EXECUTION_INIT", "DIM_RISK_TOLERANCE"],
    idealVentureTypes: [
      "B2B SaaS & Enterprise Software",
      "E-Commerce & Supply Chain Logistics",
      "FinTech & Wealth Management Platforms",
      "Operational & Direct-to-Consumer (D2C) Brands",
    ],
    strengthSuperpowers: [
      "Turning vague strategies into concrete, measurable weekly operational milestones",
      "Disciplined financial modeling, pricing architecture, and cash flow stewardship",
      "Structuring scalable workflows that eliminate bottlenecks and operational waste",
    ],
    developmentalFocus: [
      "Avoid premature optimization before product-market fit is deeply established",
      "Give creative co-founders room to explore high-upside non-linear innovations",
    ],
    leadershipStyle: "Pragmatic & Results-Driven — Sets crystal-clear OKRs and demands operational accountability.",
    executionStrategy: "Milestone-Driven Execution — Operates with structured sprints, dashboards, and KPI tracking.",
    startupRoadmap: {
      stage1Ideation: "Define target market sizing, TAM/SAM/SOM, and competitor margin structures.",
      stage2Validation: "Secure pre-orders or letters of intent (LOI) to validate commercial willingness-to-pay.",
      stage3Execution: "Launch high-quality MVP with robust payment and customer onboarding pipelines.",
      stage4Scale: "Optimize customer acquisition cost (CAC) to lifetime value (LTV) ratios.",
    },
  },
  LEADER: {
    code: "LEADER",
    title: "The Entrepreneurial Leader",
    subtitle: "Charismatic Storyteller & Organizational Orchestrator",
    tagline: "Driven by high-impact communication, vision casting, talent attraction, and culture building.",
    badgeColor: "#F59E0B",
    description:
      "You are a natural catalyst who brings people, capital, and resources together to create extraordinary outcomes. Your superpower lies in persuasive storytelling, rallying top-tier talent around an audacious vision, and navigating high-stakes investor or enterprise client negotiations.",
    dominantDimensions: ["DIM_LEADERSHIP_INFL", "DIM_COMM_PITCHING", "DIM_ENTR_INTEREST"],
    idealVentureTypes: [
      "Marketplace & Network Effect Platforms",
      "Enterprise Sales & B2B Solutions",
      "Venture Capital / Incubator Backed Scaleups",
      "Consumer Brand Movements & Media Ventures",
    ],
    strengthSuperpowers: [
      "Articulating a high-conviction company vision that attracts top co-founders and capital",
      "Negotiating strategic partnerships, distribution agreements, and key client contracts",
      "Building high-trust, mission-driven organizational culture that retains top talent",
    ],
    developmentalFocus: [
      "Ensure granular product details and technical constraints are given rigorous scrutiny",
      "Balance high-level vision casting with hands-on early customer support interactions",
    ],
    leadershipStyle: "Transformational & Empowering — Leads from the front with infectious enthusiasm and empathy.",
    executionStrategy: "People & Ecosystem Leverage — Mobilizes networks, advisors, and capital to accelerate growth.",
    startupRoadmap: {
      stage1Ideation: "Craft the master narrative, pitch deck story arc, and ecosystem positioning.",
      stage2Validation: "Interview industry executives, tier-1 customers, and prospective investors.",
      stage3Execution: "Recruit A-player technical and operational co-founders with equity alignment.",
      stage4Scale: "Execute strategic PR, investor roadshows, and international market expansion.",
    },
  },
  EXPLORER: {
    code: "EXPLORER",
    title: "The Agile Opportunity Explorer",
    subtitle: "Market Trend Hunter & Lean Experimentation Specialist",
    tagline: "Driven by curiosity, market gap detection, fast testing, and customer discovery agility.",
    badgeColor: "#10B981",
    description:
      "You are an agile scout with exceptional radar for emerging trends, consumer pain points, and arbitrage opportunities in changing markets. You excel at rapid customer interviews, lean testing, and discovering untapped niche opportunities before the broader market catches on.",
    dominantDimensions: ["DIM_OPP_RECOGNITION", "DIM_GROWTH_MINDSET", "DIM_INNOVATION_CREAT"],
    idealVentureTypes: [
      "Agile Consumer Tech & Micro-SaaS",
      "Content & Community-Driven Platforms",
      "Trend-Driven Commerce & Lifestyle Ventures",
      "Consulting & Fractional Innovation Advisory",
    ],
    strengthSuperpowers: [
      "Detecting macro and micro behavioral shifts before they become mainstream",
      "Conducting hyper-lean market experiments with minimal upfront capital expenditure",
      "Pivoting product-market focus swiftly without emotional attachment to initial ideas",
    ],
    developmentalFocus: [
      "Resist the temptation to jump between multiple new ideas; commit to deep execution on the best one",
      "Build sustainable defensive moats around successful early experiments",
    ],
    leadershipStyle: "Collaborative & Inquisitive — Encourages rapid learning and hypothesis testing.",
    executionStrategy: "Lean Experimentation — Tests 10 small hypotheses before committing major resources.",
    startupRoadmap: {
      stage1Ideation: "Map emerging industry friction points and micro-trends across digital communities.",
      stage2Validation: "Launch landing pages with smoke tests to measure organic click-through demand.",
      stage3Execution: "Build lightweight no-code / low-code prototype and iterate with early beta cohorts.",
      stage4Scale: "Solidify core product architecture and transition into repeatable unit economics.",
    },
  },
  GROWTH_ENTREPRENEUR: {
    code: "GROWTH_ENTREPRENEUR",
    title: "The Scalable Growth Entrepreneur",
    subtitle: "High-Grit Scaling Strategist & Resilient Scaleup Champion",
    tagline: "Driven by long-term compounding, relentless resilience, continuous learning, and scalable systems.",
    badgeColor: "#6366F1",
    description:
      "You possess the rare trifecta of immense grit, systematic business acumen, and continuous learning adaptability. You understand that building an enduring venture is a marathon, not a sprint. You thrive in the face of setbacks, continuously optimizing systems, teams, and customer feedback loops.",
    dominantDimensions: ["DIM_RESILIENCE_GRIT", "DIM_GROWTH_MINDSET", "DIM_EXECUTION_INIT"],
    idealVentureTypes: [
      "High-Growth Technology Scaleups",
      "Industrial & Cleantech Ventures",
      "Healthcare & EdTech Platforms",
      "Multi-City Franchise & Retail Networks",
    ],
    strengthSuperpowers: [
      "Enduring tough market conditions, fundraising dry spells, and operational crises with composure",
      "Constantly self-educating and upgrading mental models to match new business growth stages",
      "Combining high grit with rigorous metrics to drive compounded month-over-month growth",
    ],
    developmentalFocus: [
      "Practice strategic delegation early to prevent personal founder burnout",
      "Celebrate milestone wins with the team to sustain long-term organizational morale",
    ],
    leadershipStyle: "Resilient & Coaching-Oriented — Leads by example with indefatigable determination.",
    executionStrategy: "Systematic Compounding — Focuses on repeatable playbooks, metrics, and flywheel effects.",
    startupRoadmap: {
      stage1Ideation: "Conduct deep industry discovery with a 5-to-10-year compounding horizon.",
      stage2Validation: "Stress-test customer retention and Net Promoter Score (NPS) with initial pilot groups.",
      stage3Execution: "Build the foundational leadership team and codify operating standard operating procedures (SOPs).",
      stage4Scale: "Deploy growth flywheels, institutional capital, and category leadership initiatives.",
    },
  },
};

// 3. Assessment Sections
export const ENTREPRENEUR_DEVELOPMENT_SECTIONS: AssessmentSectionCatalogItem[] = [
  {
    code: "SEC_BEHAVIORAL_SCALE",
    name: "Section 1: Entrepreneurial Behavioral Self-Assessment",
    description: "Evaluates your core entrepreneurial instincts, initiative, risk appetite, and creative drive across 50 psychometric scale items.",
    displayOrder: 1,
    weight: 0.7,
  },
  {
    code: "SEC_SITUATIONAL_SCENARIOS",
    name: "Section 2: Situational Startup & Founder Scenarios",
    description: "Evaluates your real-world judgment, strategic trade-offs, crisis management, and commercial decision-making across 10 realistic founder scenarios.",
    displayOrder: 2,
    weight: 0.3,
  },
];

// Standard 5-Point Likert Options
const LIKERT_5_OPTIONS: AssessmentOptionCatalogItem[] = [
  { optionKey: "1", optionText: "Strongly Disagree", scoreValue: 1, displayOrder: 1 },
  { optionKey: "2", optionText: "Disagree", scoreValue: 2, displayOrder: 2 },
  { optionKey: "3", optionText: "Neutral / Unsure", scoreValue: 3, displayOrder: 3 },
  { optionKey: "4", optionText: "Agree", scoreValue: 4, displayOrder: 4 },
  { optionKey: "5", optionText: "Strongly Agree", scoreValue: 5, displayOrder: 5 },
];

// 4. Complete 60 Questions (50 Likert Scale + 10 Situational Judgment Scenarios)
export const ENTREPRENEUR_DEVELOPMENT_QUESTIONS: AssessmentQuestionCatalogItem[] = [
  // ==========================================
  // SECTION 1: 50 BEHAVIORAL LIKERT ITEMS (5 per Dimension)
  // ==========================================

  // DIM_ENTR_INTEREST (Q1 - Q5)
  {
    code: "ED_Q01",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_ENTR_INTEREST",
    questionType: "likert_1_5",
    questionText: "I frequently think about starting my own business or launching an independent venture rather than following a traditional career path.",
    displayOrder: 1,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q02",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_ENTR_INTEREST",
    questionType: "likert_1_5",
    questionText: "Having full autonomy and decision-making freedom in my daily work is far more fulfilling to me than job security alone.",
    displayOrder: 2,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q03",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_ENTR_INTEREST",
    questionType: "likert_1_5",
    questionText: "I am energized by reading founder stories, studying business case studies, and tracking high-growth startups.",
    displayOrder: 3,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q04",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_ENTR_INTEREST",
    questionType: "likert_1_5",
    questionText: "I would gladly accept higher initial effort and uncertain income if it means building an asset that I personally own.",
    displayOrder: 4,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q05",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_ENTR_INTEREST",
    questionType: "likert_1_5",
    questionText: "I actively seek out projects where I can take complete accountability for the commercial and operational outcome.",
    displayOrder: 5,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_OPP_RECOGNITION (Q6 - Q10)
  {
    code: "ED_Q06",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_OPP_RECOGNITION",
    questionType: "likert_1_5",
    questionText: "When I experience a frustrating product or bad customer service, I immediately analyze how a better company could solve it.",
    displayOrder: 6,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q07",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_OPP_RECOGNITION",
    questionType: "likert_1_5",
    questionText: "I consistently notice emerging consumer habits and technology trends before they become widely recognized.",
    displayOrder: 7,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q08",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_OPP_RECOGNITION",
    questionType: "likert_1_5",
    questionText: "I enjoy exploring underserved niche markets where existing large corporations are failing to satisfy customer demands.",
    displayOrder: 8,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q09",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_OPP_RECOGNITION",
    questionType: "likert_1_5",
    questionText: "I regularly ask people about their daily frustrations to understand real problems that might represent business opportunities.",
    displayOrder: 9,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q10",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_OPP_RECOGNITION",
    questionType: "likert_1_5",
    questionText: "I can quickly identify the unique selling proposition (USP) that separates a thriving business from an average one.",
    displayOrder: 10,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_INNOVATION_CREAT (Q11 - Q15)
  {
    code: "ED_Q11",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_INNOVATION_CREAT",
    questionType: "likert_1_5",
    questionText: "I naturally generate novel and unconventional ideas when faced with a problem that standard approaches cannot solve.",
    displayOrder: 11,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q12",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_INNOVATION_CREAT",
    questionType: "likert_1_5",
    questionText: "I enjoy borrowing concepts and business models from unrelated industries to create innovative hybrid offerings.",
    displayOrder: 12,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q13",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_INNOVATION_CREAT",
    questionType: "likert_1_5",
    questionText: "I often question traditional 'best practices' and look for simpler, faster, or more disruptive alternatives.",
    displayOrder: 13,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q14",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_INNOVATION_CREAT",
    questionType: "likert_1_5",
    questionText: "I am comfortable experimenting with unfinished prototypes to quickly test creative concepts with real users.",
    displayOrder: 14,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q15",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_INNOVATION_CREAT",
    questionType: "likert_1_5",
    questionText: "I find deep satisfaction in designing elegant solutions that dramatically reduce cost, complexity, or user effort.",
    displayOrder: 15,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_BUSINESS_THINKING (Q16 - Q20)
  {
    code: "ED_Q16",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_BUSINESS_THINKING",
    questionType: "likert_1_5",
    questionText: "I instinctively evaluate how much customers would realistically pay for a product before investing time in building it.",
    displayOrder: 16,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q17",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_BUSINESS_THINKING",
    questionType: "likert_1_5",
    questionText: "I understand the difference between gross revenue and net profit margin, and prioritize unit economics from day one.",
    displayOrder: 17,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q18",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_BUSINESS_THINKING",
    questionType: "likert_1_5",
    questionText: "I use data, conversion metrics, and financial calculations rather than emotional intuition to validate strategic decisions.",
    displayOrder: 18,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q19",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_BUSINESS_THINKING",
    questionType: "likert_1_5",
    questionText: "I think carefully about customer acquisition channels, referral loops, and scalable distribution advantages.",
    displayOrder: 19,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q20",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_BUSINESS_THINKING",
    questionType: "likert_1_5",
    questionText: "I can structure a clear business model canvas outlining key value propositions, cost drivers, and revenue streams.",
    displayOrder: 20,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_LEADERSHIP_INFL (Q21 - Q25)
  {
    code: "ED_Q21",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_LEADERSHIP_INFL",
    questionType: "likert_1_5",
    questionText: "I am comfortable taking the lead in ambiguous group situations and providing clear direction when others are uncertain.",
    displayOrder: 21,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q22",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_LEADERSHIP_INFL",
    questionType: "likert_1_5",
    questionText: "I can inspire talented peers to contribute their skills toward an ambitious project even before financial compensation is available.",
    displayOrder: 22,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q23",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_LEADERSHIP_INFL",
    questionType: "likert_1_5",
    questionText: "I delegate key tasks effectively and trust team members to execute without needing to micromanage them.",
    displayOrder: 23,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q24",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_LEADERSHIP_INFL",
    questionType: "likert_1_5",
    questionText: "When team conflicts arise, I facilitate constructive dialogue to resolve tensions while keeping our shared mission intact.",
    displayOrder: 24,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q25",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_LEADERSHIP_INFL",
    questionType: "likert_1_5",
    questionText: "I hold myself to the highest standard of accountability and readily take responsibility when our team experiences a shortfall.",
    displayOrder: 25,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_COMM_PITCHING (Q26 - Q30)
  {
    code: "ED_Q26",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_COMM_PITCHING",
    questionType: "likert_1_5",
    questionText: "I can explain a complex technical or business concept in simple, persuasive terms that captivate any audience.",
    displayOrder: 26,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q27",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_COMM_PITCHING",
    questionType: "likert_1_5",
    questionText: "I feel confident presenting pitches to investors, business partners, or high-level executives under scrutiny.",
    displayOrder: 27,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q28",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_COMM_PITCHING",
    questionType: "likert_1_5",
    questionText: "When someone raises objections to my proposal, I listen actively and address their underlying concerns with composure.",
    displayOrder: 28,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q29",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_COMM_PITCHING",
    questionType: "likert_1_5",
    questionText: "I craft compelling written proposals, executive summaries, and pitch decks that highlight clear value propositions.",
    displayOrder: 29,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q30",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_COMM_PITCHING",
    questionType: "likert_1_5",
    questionText: "I can tailor my communication style seamlessly depending on whether I am speaking to customers, engineers, or financiers.",
    displayOrder: 30,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_EXECUTION_INIT (Q31 - Q35)
  {
    code: "ED_Q31",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_EXECUTION_INIT",
    questionType: "likert_1_5",
    questionText: "I have a strong bias toward action; I prefer testing a working draft immediately over spending weeks refining theory.",
    displayOrder: 31,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q32",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_EXECUTION_INIT",
    questionType: "likert_1_5",
    questionText: "When resources or budget are limited, I find creative ways to bootstrap and build solutions with whatever tools are available.",
    displayOrder: 32,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q33",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_EXECUTION_INIT",
    questionType: "likert_1_5",
    questionText: "I consistently break down ambitious annual goals into actionable weekly tasks and track them rigorously to completion.",
    displayOrder: 33,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q34",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_EXECUTION_INIT",
    questionType: "likert_1_5",
    questionText: "I proactively take initiative without waiting for approval or instructions when I spot an urgent task that needs solving.",
    displayOrder: 34,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q35",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_EXECUTION_INIT",
    questionType: "likert_1_5",
    questionText: "I maintain high daily work velocity and resist procrastination by focusing strictly on the highest-leverage activities.",
    displayOrder: 35,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_RISK_TOLERANCE (Q36 - Q40)
  {
    code: "ED_Q36",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RISK_TOLERANCE",
    questionType: "likert_1_5",
    questionText: "I am comfortable making high-stakes decisions with only 70% of the information available rather than delaying indefinitely.",
    displayOrder: 36,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q37",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RISK_TOLERANCE",
    questionType: "likert_1_5",
    questionText: "I design experiments so that potential upside is exponential while maximum downside risk is capped and manageable.",
    displayOrder: 37,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q38",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RISK_TOLERANCE",
    questionType: "likert_1_5",
    questionText: "The fear of missing out on a transformational market opportunity outweighs my fear of making a reversible operational mistake.",
    displayOrder: 38,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q39",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RISK_TOLERANCE",
    questionType: "likert_1_5",
    questionText: "I can maintain psychological clarity and make rational choices during unpredictable market fluctuations.",
    displayOrder: 39,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q40",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RISK_TOLERANCE",
    questionType: "likert_1_5",
    questionText: "I prepare structured contingency plans for critical project vulnerabilities before committing major financial resources.",
    displayOrder: 40,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_RESILIENCE_GRIT (Q41 - Q45)
  {
    code: "ED_Q41",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RESILIENCE_GRIT",
    questionType: "likert_1_5",
    questionText: "When a major client or key investor rejects my proposal, I quickly regroup, extract constructive lessons, and keep moving forward.",
    displayOrder: 41,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q42",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RESILIENCE_GRIT",
    questionType: "likert_1_5",
    questionText: "I view business setbacks and failed campaigns as valuable data points rather than personal inadequacies.",
    displayOrder: 42,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q43",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RESILIENCE_GRIT",
    questionType: "likert_1_5",
    questionText: "I possess the long-term stamina to persevere through months of grinding foundational work before seeing public recognition.",
    displayOrder: 43,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q44",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RESILIENCE_GRIT",
    questionType: "likert_1_5",
    questionText: "During high-pressure crises, I remain calm, analytical, and supportive of my team members.",
    displayOrder: 44,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q45",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_RESILIENCE_GRIT",
    questionType: "likert_1_5",
    questionText: "I have a proven track record of completing difficult, long-term personal or academic commitments despite severe obstacles.",
    displayOrder: 45,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // DIM_GROWTH_MINDSET (Q46 - Q50)
  {
    code: "ED_Q46",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_GROWTH_MINDSET",
    questionType: "likert_1_5",
    questionText: "I actively seek out blunt, critical customer feedback because it reveals exactly where my product or strategy needs to improve.",
    displayOrder: 46,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q47",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_GROWTH_MINDSET",
    questionType: "likert_1_5",
    questionText: "I can quickly pivot our venture's core offering if real customer data disproves my initial assumptions.",
    displayOrder: 47,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q48",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_GROWTH_MINDSET",
    questionType: "likert_1_5",
    questionText: "I invest dedicated hours each week learning entirely new domain skills (e.g., coding, marketing, legal, finance) required for growth.",
    displayOrder: 48,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q49",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_GROWTH_MINDSET",
    questionType: "likert_1_5",
    questionText: "I believe entrepreneurial ability is developed through relentless practice, reflection, and feedback rather than fixed innate talent alone.",
    displayOrder: 49,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },
  {
    code: "ED_Q50",
    sectionCode: "SEC_BEHAVIORAL_SCALE",
    dimensionCode: "DIM_GROWTH_MINDSET",
    questionType: "likert_1_5",
    questionText: "I celebrate the achievements of competing entrepreneurs and study their successes to upgrade my own strategic playbook.",
    displayOrder: 50,
    isMandatory: true,
    scoringMethod: "DIRECT",
    options: LIKERT_5_OPTIONS,
  },

  // ==========================================
  // SECTION 2: 10 SITUATIONAL JUDGMENT SCENARIOS (1 per Dimension)
  // ==========================================

  // Scenario 1 (DIM_ENTR_INTEREST)
  {
    code: "ED_Q51",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_ENTR_INTEREST",
    questionType: "mcq_text",
    questionText:
      "Scenario: You receive a lucrative job offer with great salary and light workload at a corporate firm, but you just developed a validated prototype for a problem you care deeply about. What is your primary reaction?",
    displayOrder: 51,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Commit fully to building your venture full-time, seeking incubator support and customer pre-orders.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Take the job temporarily while establishing strict evening/weekend milestones to launch the venture within 6 months.",
        scoreValue: 4,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Try to license or sell the prototype to an existing company so you can take the stable corporate role without risk.",
        scoreValue: 3,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Accept the corporate job and shelve the prototype indefinitely because steady compensation is paramount.",
        scoreValue: 1,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 2 (DIM_OPP_RECOGNITION)
  {
    code: "ED_Q52",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_OPP_RECOGNITION",
    questionType: "mcq_text",
    questionText:
      "Scenario: You notice local high school students spending hours searching through disorganized social media groups for peer tutoring and study notes. How do you evaluate this opportunity?",
    displayOrder: 52,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Interview 25 students and parents immediately to quantify their specific pain points, willingness-to-pay, and test a simple WhatsApp/Discord pilot.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Spend 2 months designing a comprehensive mobile application with advanced gamification before speaking to users.",
        scoreValue: 2,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Check if existing large edtech platforms already operate in the city and decide there is no room for a new entrant.",
        scoreValue: 1,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Create a simple landing page to collect email sign-ups and gauge interest from both tutors and students.",
        scoreValue: 4,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 3 (DIM_INNOVATION_CREAT)
  {
    code: "ED_Q53",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_INNOVATION_CREAT",
    questionType: "mcq_text",
    questionText:
      "Scenario: Your team is launching an eco-friendly consumer product, but competing brands have 10x your marketing budget. How do you innovate your go-to-market strategy?",
    displayOrder: 53,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Design a viral grassroots recycling challenge with gamified community rewards that turns every buyer into an active ambassador.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Partner exclusively with local campus clubs and micro-influencers through zero-cost revenue-sharing affiliate models.",
        scoreValue: 4,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Take out high-interest personal loans to match the competitor's paid digital ad spend across social media.",
        scoreValue: 1,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Wait until you secure angel investor funding before executing any marketing activities.",
        scoreValue: 2,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 4 (DIM_BUSINESS_THINKING)
  {
    code: "ED_Q54",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_BUSINESS_THINKING",
    questionType: "mcq_text",
    questionText:
      "Scenario: Your SaaS platform acquires 5,000 free users in month 1, but server costs are growing rapidly and only 1% convert to the paid $10/month tier. What is your primary strategic move?",
    displayOrder: 54,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Analyze power-user behavior, restructure the pricing tiers around high-value premium features, and cap free tier resource consumption.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Conduct deep exit interviews with free users to identify which specific enterprise features they would gladly pay for.",
        scoreValue: 4,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Double down on acquiring 50,000 more free users hoping advertising revenue will eventually cover server costs.",
        scoreValue: 2,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Shut down the product immediately because a 1% conversion rate means the idea has failed completely.",
        scoreValue: 1,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 5 (DIM_LEADERSHIP_INFL)
  {
    code: "ED_Q55",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_LEADERSHIP_INFL",
    questionType: "mcq_text",
    questionText:
      "Scenario: Two of your key co-founders are locked in a heated dispute regarding whether to prioritize enterprise clients or consumer retail. Morale is suffering. How do you lead?",
    displayOrder: 55,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Facilitate a structured 24-hour evaluation matrix analyzing customer acquisition cost, sales cycle length, and cash runway to let data decide the single priority.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Align the team around a temporary 60-day sprint on the highest-margin segment while keeping the second as an exploratory backlog.",
        scoreValue: 4,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Split the company's focus 50/50 so both co-founders stay happy, even if resources are stretched thin.",
        scoreValue: 2,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Avoid getting involved and wait for the co-founders to sort out the disagreement on their own.",
        scoreValue: 1,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 6 (DIM_COMM_PITCHING)
  {
    code: "ED_Q56",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_COMM_PITCHING",
    questionType: "mcq_text",
    questionText:
      "Scenario: You have 3 minutes in an elevator with a prominent venture capitalist who could fund your pre-seed round. How do you structure your pitch?",
    displayOrder: 56,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "State the multi-billion dollar problem in 1 sentence, explain your unique solution, share early traction metrics, and request a follow-up coffee meeting.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Explain the deep technical backend algorithms and code architecture of your product in detail.",
        scoreValue: 2,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Ask for immediate wire transfer commitment on the spot without presenting customer traction.",
        scoreValue: 1,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Share an authentic customer story illustrating the problem, your revenue model, and hand over a crisp one-pager card.",
        scoreValue: 4,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 7 (DIM_EXECUTION_INIT)
  {
    code: "ED_Q57",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_EXECUTION_INIT",
    questionType: "mcq_text",
    questionText:
      "Scenario: You want to launch an online marketplace for verified vintage electronics, but you do not know how to build a complex payment escrow platform yet. What do you do this weekend?",
    displayOrder: 57,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Launch a curated Notion/Airtable catalog with manual WhatsApp checkout and personally fulfill the first 10 transactions to prove demand.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Use no-code tools (Shopify / Webflow) to build a functional front store and start onboarding 5 trusted local sellers.",
        scoreValue: 4,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Spend 9 months enrolled in computer science bootcamps before attempting to list a single product.",
        scoreValue: 2,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Give up on the marketplace idea because you don't currently have a dedicated full-time engineering team.",
        scoreValue: 1,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 8 (DIM_RISK_TOLERANCE)
  {
    code: "ED_Q58",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_RISK_TOLERANCE",
    questionType: "mcq_text",
    questionText:
      "Scenario: A critical enterprise pilot contract requires you to customize your software specifically for their infrastructure, but doing so will consume 80% of your engineering bandwidth for 3 months. How do you decide?",
    displayOrder: 58,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Require a non-refundable upfront implementation fee and ensure the core features developed remain reusable for all future clients.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Negotiate a standardized API integration that meets 90% of their needs without custom branching your codebase.",
        scoreValue: 4,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Accept all their custom demands for free hoping they will sign a multi-year deal later.",
        scoreValue: 2,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Reject the enterprise pilot outright because enterprise clients are too demanding.",
        scoreValue: 1,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 9 (DIM_RESILIENCE_GRIT)
  {
    code: "ED_Q59",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_RESILIENCE_GRIT",
    questionType: "mcq_text",
    questionText:
      "Scenario: You pitched your startup to 15 angel investors over 2 months, and all 15 said 'No' citing lack of proven retention. How do you respond?",
    displayOrder: 59,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Synthesize their feedback, pause fundraising, focus 100% of energy on fixing product retention with existing 100 users, and return with concrete cohort proof.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Launch weekly user satisfaction interviews to discover why users churn and ship targeted feature updates.",
        scoreValue: 4,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "Pitch 50 more investors immediately with the exact same deck hoping someone doesn't care about retention.",
        scoreValue: 2,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Conclude that investors do not understand your vision and abandon the startup entirely.",
        scoreValue: 1,
        displayOrder: 4,
      },
    ],
  },

  // Scenario 10 (DIM_GROWTH_MINDSET)
  {
    code: "ED_Q60",
    sectionCode: "SEC_SITUATIONAL_SCENARIOS",
    dimensionCode: "DIM_GROWTH_MINDSET",
    questionType: "mcq_text",
    questionText:
      "Scenario: You spent 6 months building an AI study planner, but analytics reveal users only use the flashcard generator feature and ignore the planner. What is your response?",
    displayOrder: 60,
    isMandatory: true,
    scoringMethod: "WEIGHTED_CHOICE",
    options: [
      {
        optionKey: "A",
        optionText: "Embrace the market signal, pivot the entire product into the ultimate AI flashcard platform, and double down on what users actually love.",
        scoreValue: 5,
        displayOrder: 1,
      },
      {
        optionKey: "B",
        optionText: "Create a dedicated onboarding tutorial explaining why users should use the study planner feature instead.",
        scoreValue: 2,
        displayOrder: 2,
      },
      {
        optionKey: "C",
        optionText: "A/B test streamlining the flashcard feature while surveying users about why they prefer flashcards over planning.",
        scoreValue: 4,
        displayOrder: 3,
      },
      {
        optionKey: "D",
        optionText: "Feel frustrated by user behavior and blame them for not understanding the value of your complete system.",
        scoreValue: 1,
        displayOrder: 4,
      },
    ],
  },
];
