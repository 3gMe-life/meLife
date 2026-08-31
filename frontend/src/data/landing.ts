export interface NavItem {
  label: string;
  href: string;
}

export interface AudienceItem {
  id: string;
  title: string;
  role: string;
  description: string;
  keyBenefit: string;
  iconName: string;
  badge: string;
}

export interface JourneyStage {
  id: string;
  stageNumber: string;
  title: string;
  age: string;
  targetGroup: string;
  description: string;
  focusAreas: string[];
  isFeatured?: boolean;
}

export interface FeaturedAssessment {
  id: string;
  title: string;
  age: string;
  badge: string;
  tagline: string;
  description: string;
  duration: string;
  outcomes: string[];
  recommendedFor: string;
}

export interface HowItWorksStep {
  step: string;
  number: string;
  title: string;
  description: string;
  detail: string;
  iconName: string;
}

export interface DimensionItem {
  title: string;
  category: string;
  description: string;
  relevance: string;
  iconName: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Assessments", href: "#assessments" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Dimensions", href: "#dimensions" },
  { label: "For Institutions", href: "#institutions" },
  { label: "Contact", href: "#contact" },
];

export const AUDIENCE_DATA: AudienceItem[] = [
  {
    id: "students",
    title: "Students",
    role: "Ages 10 to 18+",
    description: "Understand your strengths, learning styles, and natural inclinations to explore educational and career pathways with clarity.",
    keyBenefit: "Self-discovery without examination stress or arbitrary labels",
    iconName: "GraduationCap",
    badge: "Learner Focused",
  },
  {
    id: "parents",
    title: "Parents",
    role: "Educational Champions",
    description: "Support your child's critical academic and career choices with structured, objective evidence instead of peer pressure or guesswork.",
    keyBenefit: "Constructive discussions backed by multi-dimensional insights",
    iconName: "Users",
    badge: "Family Support",
  },
  {
    id: "counsellors",
    title: "Counsellors",
    role: "Career Mentors",
    description: "Access longitudinal assessment data and structured evidence to facilitate deeply impactful, personalized guidance sessions.",
    keyBenefit: "Actionable diagnostic profiles and standardized discussion frameworks",
    iconName: "Compass",
    badge: "Guidance Evidence",
  },
  {
    id: "institutions",
    title: "Institutions",
    role: "Schools & Universities",
    description: "Deploy scalable, reliable psychometric evaluations and career readiness frameworks across cohorts with administrative analytics.",
    keyBenefit: "Cohort analytics, batch management, and institutional benchmarking",
    iconName: "Building2",
    badge: "Institutional Scale",
  },
];

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "skill-finder",
    stageNumber: "01",
    title: "Skill Finder",
    age: "Age 10–13",
    targetGroup: "Middle School (Grades 5–8)",
    description: "Discover emerging interests, curiosities, and foundational cognitive problem-solving tendencies.",
    focusAreas: ["Curiosity Mapping", "Cognitive Styles", "Exploratory Interests"],
    isFeatured: true,
  },
  {
    id: "stream-finder",
    stageNumber: "02",
    title: "Stream Finder",
    age: "Age 14–15",
    targetGroup: "Secondary School (Grades 9–10)",
    description: "Evaluate aptitude and interest alignment for academic stream selection (Science, Commerce, Humanities).",
    focusAreas: ["Subject Orientation", "Logical & Verbal Reasoning", "Stream Compatibility"],
    isFeatured: true,
  },
  {
    id: "engg-finder",
    stageNumber: "03",
    title: "Engineering Branch Finder",
    age: "Age 16–17",
    targetGroup: "Senior Secondary (Grades 11–12)",
    description: "Align spatial, algorithmic, and applied technical aptitudes with specialized engineering domains.",
    focusAreas: ["Spatial Reasoning", "Domain Specifics", "Systems Thinking"],
  },
  {
    id: "commerce-finder",
    stageNumber: "04",
    title: "Commerce Career Finder",
    age: "Age 16–17",
    targetGroup: "Senior Secondary (Grades 11–12)",
    description: "Evaluate numerical aptitude, managerial orientation, financial literacy, and entrepreneurial interests.",
    focusAreas: ["Quantitative Aptitude", "Financial Orientation", "Managerial Traits"],
  },
  {
    id: "humanities-finder",
    stageNumber: "05",
    title: "Humanities Career Finder",
    age: "Age 16–17",
    targetGroup: "Senior Secondary (Grades 11–12)",
    description: "Unpack creative expression, critical reasoning, sociological interest, and verbal synthesis strengths.",
    focusAreas: ["Verbal Synthesis", "Critical Inquiry", "Social Awareness"],
  },
  {
    id: "right-career",
    stageNumber: "06",
    title: "Right Career Finder",
    age: "Age 18+",
    targetGroup: "Higher Education & Graduates",
    description: "Synthesize multi-dimensional personality, aptitude, and work-value profiles for career specialization.",
    focusAreas: ["Work Values", "Comprehensive Aptitude", "Industry Fit"],
    isFeatured: true,
  },
  {
    id: "ai-job-risk",
    stageNumber: "07",
    title: "AI Job Risk Finder",
    age: "Age 18+",
    targetGroup: "Graduates & Early Professionals",
    description: "Assess future-readiness, human-centric skill moats, and adaptive capacity in an evolving AI economy.",
    focusAreas: ["Technological Resilience", "Human-Core Moats", "Adaptability Quotient"],
  },
];

export const FEATURED_ASSESSMENTS: FeaturedAssessment[] = [
  {
    id: "skill-finder",
    title: "Skill Finder",
    age: "Age 10–13",
    badge: "Foundational Exploration",
    tagline: "Uncover natural curiosities and early aptitude strengths.",
    description: "An engaging, low-stress discovery experience that helps younger learners articulate what they enjoy and where their cognitive inclinations naturally shine.",
    duration: "25–30 mins",
    outcomes: ["Interest radar profile", "Cognitive problem-solving tendencies", "Recommended hobby & learning pathways"],
    recommendedFor: "Middle school students starting to explore their individual talents.",
  },
  {
    id: "stream-finder",
    title: "Stream Finder",
    age: "Age 14–15",
    badge: "High Impact Milestone",
    tagline: "Objective guidance for 10th-grade stream and subject choices.",
    description: "Comprehensive evaluation aligning subject interest with analytical, numerical, and verbal reasoning to guide confident selection among Science, Commerce, and Arts.",
    duration: "40–45 mins",
    outcomes: ["Stream affinity breakdown", "Reasoning vs. interest alignment", "Curated subject combination guidance"],
    recommendedFor: "Grade 9 and 10 students preparing for secondary board choices.",
  },
  {
    id: "right-career",
    title: "Right Career Finder",
    age: "Age 18+",
    badge: "Comprehensive Diagnostic",
    tagline: "Multi-dimensional career mapping for college students & graduates.",
    description: "A robust psychometric synthesis connecting cognitive abilities, core work motivators, personality patterns, and real-world industry requirements.",
    duration: "50–60 mins",
    outcomes: ["Multi-dimensional career cluster matches", "Work-values hierarchy", "Actionable transition and upskilling roadmap"],
    recommendedFor: "Undergraduates and young professionals seeking strategic career direction.",
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: "Step 01",
    number: "1",
    title: "Understand the Student",
    description: "Identify current academic stage, guiding questions, and individual context before starting.",
    detail: "Age-calibrated questionnaires ensure questions are developmentally appropriate.",
    iconName: "UserCheck",
  },
  {
    step: "Step 02",
    number: "2",
    title: "Complete the Assessment",
    description: "Engage in structured psychometric and reasoning exercises in a calm, timed or untimed interface.",
    detail: "Universal runner supports Likert scales, situational judgement, and reasoning tasks.",
    iconName: "FileCheck2",
  },
  {
    step: "Step 03",
    number: "3",
    title: "Build the Profile",
    description: "Multi-dimensional synthesis across interests, aptitudes, learning patterns, and self-efficacy.",
    detail: "Evidence is structured into clear developmental dimensions rather than a single label.",
    iconName: "Layers",
  },
  {
    step: "Step 04",
    number: "4",
    title: "Explore Suitable Directions",
    description: "Receive a clear, actionable report for informed exploration and counsellor discussions.",
    detail: "Designed to facilitate meaningful dialogue with parents, mentors, and advisors.",
    iconName: "Compass",
  },
];

export const DIMENSIONS_DATA: DimensionItem[] = [
  {
    title: "Interests",
    category: "Intrinsic Motivation",
    description: "What energizes the learner and sustains genuine curiosity over extended periods.",
    relevance: "Predicts sustained engagement and satisfaction in study and work.",
    iconName: "Sparkles",
  },
  {
    title: "Aptitude / Reasoning",
    category: "Cognitive Processing",
    description: "Analytical, numerical, spatial, and verbal reasoning capabilities.",
    relevance: "Highlights natural problem-solving strengths and processing speed.",
    iconName: "BrainCircuit",
  },
  {
    title: "Strength Profile",
    category: "Execution Capabilities",
    description: "Demonstrated strengths across creative, logical, social, and operational domains.",
    relevance: "Provides actionable insight into where the learner executes most effectively.",
    iconName: "ShieldCheck",
  },
  {
    title: "Self-Efficacy",
    category: "Confidence & Agency",
    description: "Individual belief in one's capacity to master challenges and acquire new skills.",
    relevance: "Crucial for navigating difficult academic transitions and building resilience.",
    iconName: "Target",
  },
  {
    title: "Academic Readiness",
    category: "Foundational Preparation",
    description: "Curricular comfort and conceptual baseline for prospective academic pathways.",
    relevance: "Ensures realistic planning alongside aspirational career goals.",
    iconName: "BookOpenCheck",
  },
  {
    title: "Learning Behaviour",
    category: "Work & Study Habits",
    description: "Preferred learning modalities, self-regulation, and collaborative tendencies.",
    relevance: "Informs optimal study environments and developmental mentoring.",
    iconName: "Activity",
  },
  {
    title: "Career Values & Motivators",
    category: "Long-Term Purpose",
    description: "What the individual values most: autonomy, innovation, social impact, stability, or leadership.",
    relevance: "Guides sustainable long-term career satisfaction.",
    iconName: "HeartHandshake",
  },
  {
    title: "Context & Environment",
    category: "Ecosystem Factors",
    description: "Educational opportunities, family dynamics, and geographical exploration realities.",
    relevance: "Grounds guidance in authentic, practical decision-making contexts.",
    iconName: "Globe",
  },
];

export const FOOTER_DATA: { columns: FooterColumn[] } = {
  columns: [
    {
      title: "Platform",
      links: [
        { label: "About MeLife", href: "#about" },
        { label: "Assessment Ecosystem", href: "#assessments" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Assessment Dimensions", href: "#dimensions" },
        { label: "Sample Report", href: "#report-preview" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "For Students (Ages 10–18+)", href: "#students" },
        { label: "For Parents & Families", href: "#parents" },
        { label: "For Career Counsellors", href: "#counsellors" },
        { label: "For Schools & Institutions", href: "#institutions" },
        { label: "Skill & Stream Finder", href: "#assessments" },
      ],
    },
    {
      title: "Company & Trust",
      links: [
        { label: "Contact Us", href: "#contact" },
        { label: "Responsible Guidance Ethics", href: "#ethics" },
        { label: "Student Data Privacy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
      ],
    },
  ],
};
