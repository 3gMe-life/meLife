import {
  ExplorationDirectionItem,
  InterestProfileResult,
  LearningProfileResult,
  SkillBehaviourResult,
} from "../scoring.types";

export interface ArchetypeDefinition {
  archetypeTitle: string;
  tagline: string;
  strengthSummary: string;
  explorationFraming: string;
  primaryTraits: string[];
}

/**
 * Core Archetype Combinations Matrix (Based on Top 2 RIASEC Intersections)
 */
const ARCHETYPE_MATRIX: Record<string, ArchetypeDefinition> = {
  "BUILDER_R:EXPLORER_I": {
    archetypeTitle: "Practical Explorer",
    tagline: "Bridging scientific curiosity with hands-on technical creation.",
    strengthSummary:
      "You show strong curiosity about how physical and computational systems work, paired with an instinct to construct, assemble, and test practical solutions.",
    explorationFraming:
      "Your current profile shows stronger alignment with engineering, applied robotics, computer hardware, and physical technology exploration areas.",
    primaryTraits: ["Hands-on Problem Solving", "System Diagnostics", "Applied Science"],
  },
  "BUILDER_R:CREATOR_A": {
    archetypeTitle: "Creative Maker & Designer",
    tagline: "Transforming imaginative concepts into tangible structures.",
    strengthSummary:
      "You combine visual and structural creativity with practical craftsmanship, enjoying both the aesthetic design and the physical construction of projects.",
    explorationFraming:
      "Your current profile shows stronger alignment with industrial design, architecture, game environments, and interactive product making.",
    primaryTraits: ["Spatial Design", "Material Craftsmanship", "Visual Realization"],
  },
  "BUILDER_R:ORGANISER_C": {
    archetypeTitle: "Technical Operations Builder",
    tagline: "Constructing reliable, efficient, and well-structured systems.",
    strengthSummary:
      "You appreciate precision, orderly execution, and solid mechanical or technical workflows that function without fail.",
    explorationFraming:
      "Your current profile shows stronger alignment with civil systems, network infrastructure, quality engineering, and technical logistics.",
    primaryTraits: ["Precision Execution", "Structured Building", "Quality Control"],
  },
  "EXPLORER_I:CREATOR_A": {
    archetypeTitle: "Innovative Investigator",
    tagline: "Exploring novel ideas through creative analytical inquiry.",
    strengthSummary:
      "You enjoy uncovering hidden patterns, asking deep questions, and presenting original ideas through creative media, diagrams, or storytelling.",
    explorationFraming:
      "Your current profile shows stronger alignment with data visualization, computational biology, scientific journalism, and UX research.",
    primaryTraits: ["Deep Inquisitiveness", "Conceptual Originality", "Pattern Synthesis"],
  },
  "EXPLORER_I:ORGANISER_C": {
    archetypeTitle: "Analytical Systems Thinker",
    tagline: "Dissecting complex data into clear, systematic insights.",
    strengthSummary:
      "You excel at methodical investigation, quantitative reasoning, and organizing complex sets of facts into logical frameworks.",
    explorationFraming:
      "Your current profile shows stronger alignment with data analytics, software engineering, economics, and computational science.",
    primaryTraits: ["Quantitative Logic", "Methodical Research", "Structured Analysis"],
  },
  "CREATOR_A:HELPER_S": {
    archetypeTitle: "Human-Centered Designer",
    tagline: "Using art, empathy, and communication to enrich lives.",
    strengthSummary:
      "You connect deeply with people's experiences and enjoy using creative arts, writing, and design to inspire, heal, and bring communities together.",
    explorationFraming:
      "Your current profile shows stronger alignment with education media, communication arts, psychology, expressive therapies, and social design.",
    primaryTraits: ["Empathic Storytelling", "Social Creativity", "Inclusive Communication"],
  },
  "HELPER_S:LEADER_E": {
    archetypeTitle: "Empathetic Catalyst & Leader",
    tagline: "Motivating teams toward positive community impact.",
    strengthSummary:
      "You combine interpersonal warmth with the energy to organize initiatives, resolve conflicts, and guide group projects toward shared goals.",
    explorationFraming:
      "Your current profile shows stronger alignment with public service, social entrepreneurship, health leadership, and educational administration.",
    primaryTraits: ["Collaborative Motivation", "Active Empathy", "Public Speaking"],
  },
  "LEADER_E:ORGANISER_C": {
    archetypeTitle: "Strategic Coordinator & Enterprise Planner",
    tagline: "Turning ambitious visions into structured, scalable realities.",
    strengthSummary:
      "You possess strong organizational vision, enjoying project scheduling, resource management, team coordination, and strategic goal setting.",
    explorationFraming:
      "Your current profile shows stronger alignment with enterprise management, business analytics, law, financial operations, and public policy.",
    primaryTraits: ["Strategic Planning", "Project Leadership", "Resource Efficiency"],
  },
  "LEADER_E:CREATOR_A": {
    archetypeTitle: "Visionary Communicator",
    tagline: "Pitching bold ideas and rallying support through persuasive expression.",
    strengthSummary:
      "You bring flair, presentation confidence, and persuasive storytelling to initiatives, inspiring others with innovative directions.",
    explorationFraming:
      "Your current profile shows stronger alignment with brand strategy, digital media leadership, entertainment management, and creative campaigns.",
    primaryTraits: ["Persuasive Expression", "Campaign Vision", "Creative Initiative"],
  },
  "HELPER_S:ORGANISER_C": {
    archetypeTitle: "Community Operations Specialist",
    tagline: "Creating supportive environments through structured care.",
    strengthSummary:
      "You take pride in reliable service, helping peers effectively, and ensuring that community or educational environments run smoothly.",
    explorationFraming:
      "Your current profile shows stronger alignment with healthcare coordination, school counseling services, library informatics, and community welfare.",
    primaryTraits: ["Supportive Dependability", "Empathetic Organization", "Attentive Care"],
  },
};

/**
 * Exploration Pathway Catalog
 */
export const EXPLORATION_CATALOG: Record<
  string,
  {
    clusterTitle: string;
    description: string;
    sampleExplorationAreas: string[];
    suggestedActivities: string[];
  }
> = {
  BUILDER_R: {
    clusterTitle: "Engineering, Applied Technology & Construction",
    description: "Hands-on making, mechanical systems, robotics, architecture, and practical engineering.",
    sampleExplorationAreas: [
      "Robotics & Mechatronics",
      "Civil & Structural Engineering",
      "Physical Product Design",
      "Aeronautics & Automotive Systems",
    ],
    suggestedActivities: [
      "Build modular robotics or Arduino / Raspberry Pi starter kits.",
      "Participate in science & maker fairs or 3D modeling workshops.",
      "Experiment with woodworking, mechanics, or bridge-building physics challenges.",
    ],
  },
  EXPLORER_I: {
    clusterTitle: "Scientific Inquiry, Research & Computing Analytics",
    description: "Analytical investigations, algorithmic problem solving, natural sciences, and data exploration.",
    sampleExplorationAreas: [
      "Data Science & Artificial Intelligence",
      "Biotechnology & Genetics",
      "Astrophysics & Space Exploration",
      "Environmental Science & Chemistry",
    ],
    suggestedActivities: [
      "Conduct home science experiments and record hypotheses.",
      "Learn foundational Python programming and algorithmic logic.",
      "Read science and astronomy journals or participate in Math Olympiads.",
    ],
  },
  CREATOR_A: {
    clusterTitle: "Creative Arts, Digital Media & Innovative Design",
    description: "Visual communication, digital illustration, storytelling, user experience design, and media production.",
    sampleExplorationAreas: [
      "UI/UX & Product Design",
      "Animation & Game Design",
      "Creative Writing & Journalism",
      "Architecture & Spatial Arts",
    ],
    suggestedActivities: [
      "Create digital art, comic strips, or 2D animation clips.",
      "Write short fiction, blog posts, or script small video sketches.",
      "Learn graphic design tools (Figma, Canva, Adobe Creative Suite).",
    ],
  },
  HELPER_S: {
    clusterTitle: "Human Services, Education, Healthcare & Community",
    description: "Mentoring, community wellbeing, healthcare professions, teaching, and counseling.",
    sampleExplorationAreas: [
      "Clinical Psychology & Counseling",
      "Medicine & Public Health",
      "Education & Special Needs Pedagogy",
      "Social Impact & Non-Profit Leadership",
    ],
    suggestedActivities: [
      "Volunteer for peer tutoring or junior student mentoring programs.",
      "Participate in community service, eco-clubs, or first-aid training.",
      "Practice active listening and lead collaborative school club discussions.",
    ],
  },
  LEADER_E: {
    clusterTitle: "Entrepreneurship, Business Strategy & Public Leadership",
    description: "Organizing initiatives, public speaking, negotiation, enterprise management, and team leadership.",
    sampleExplorationAreas: [
      "Business Management & Entrepreneurship",
      "Corporate Law & Public Policy",
      "Marketing & Brand Strategy",
      "Financial Economics & Venture Capital",
    ],
    suggestedActivities: [
      "Lead a school club, sports squad, or science exhibition team.",
      "Participate in debate competitions and Model United Nations (MUN).",
      "Organize a mini-fundraiser or school event project from concept to delivery.",
    ],
  },
  ORGANISER_C: {
    clusterTitle: "Operations, Information Systems & Financial Management",
    description: "System administration, logistics, financial planning, database management, and structured execution.",
    sampleExplorationAreas: [
      "Financial Analysis & Accounting",
      "Cybersecurity & Cloud Infrastructure",
      "Supply Chain & Operations Management",
      "Statistical Quality Control",
    ],
    suggestedActivities: [
      "Manage schedules, budgets, and inventories for school club events.",
      "Explore spreadsheet analytics and structured database tools.",
      "Learn project management techniques such as Kanban and milestone tracking.",
    ],
  },
};

/**
 * Multilingual Translations Dictionary for Result Profiles
 */
export const RESULT_TRANSLATIONS: Record<string, Record<string, string>> = {
  ml: {
    "Practical Explorer": "പ്രാക്ടിക്കൽ എക്സ്പ്ലോറർ (Practical Explorer)",
    "Creative Maker & Designer": "ക്രിയേറ്റീവ് മേക്കർ & ഡിസൈനർ (Creative Maker)",
    "Analytical Systems Thinker": "അനലിറ്റിക്കൽ സിസ്റ്റംസ് തിങ്കർ (Analytical Thinker)",
    "Empathetic Catalyst & Leader": "എംപതറ്റിക് ലീഡർ (Empathetic Leader)",
    "Strategic Coordinator": "സ്ട്രാറ്റജിക് കോർഡിനേറ്റർ (Strategic Coordinator)",
    "Engineering, Applied Technology & Construction": "എഞ്ചിനീയറിംഗ്, സാങ്കേതികവിദ്യ & നിർമ്മാണം",
    "Scientific Inquiry, Research & Computing Analytics": "ശാസ്ത്രീയ ഗവേഷണം, കമ്പ്യூട്ടിംഗ് & അനലിറ്റിക്സ്",
    "Creative Arts, Digital Media & Innovative Design": "ക്രിയേറ്റീവ് ആർട്സ്, ഡിജിറ്റൽ മീഡിയ & ഡിസൈൻ",
    "Human Services, Education, Healthcare & Community": "ഹ്യൂമൻ സർവീസസ്, വിദ്യാഭ്യാസം & ആരോഗ്യം",
    "Entrepreneurship, Business Strategy & Public Leadership": "സംരംഭകത്വം, ബിസിനസ്സ് & നേതൃത്വം",
    "Operations, Information Systems & Financial Management": "ഓപ്പറേഷൻസ്, ഐടി & ഫിനാൻഷ്യൽ മാനേജ്മെന്റ്",
  },
  hi: {
    "Practical Explorer": "प्रैक्टिकल एक्सप्लोरर (Practical Explorer)",
    "Creative Maker & Designer": "क्रिएटिव मेकर एवं डिज़ाइनर",
    "Analytical Systems Thinker": "एनालिटिकल सिस्टम्स थिंकर",
    "Empathetic Catalyst & Leader": "सहानुभूतिपूर्ण लीडर एवं उत्प्रेरक",
    "Strategic Coordinator": "रणनीतिक समन्वयक",
    "Engineering, Applied Technology & Construction": "इंजीनियरिंग, अनुप्रयुक्त प्रौद्योगिकी एवं निर्माण",
    "Scientific Inquiry, Research & Computing Analytics": "वैज्ञानिक अनुसंधान, कंप्यूटिंग एवं डेटा विश्लेषण",
    "Creative Arts, Digital Media & Innovative Design": "सृजनात्मक कलाएं, डिजिटल मीडिया एवं डिज़ाइन",
    "Human Services, Education, Healthcare & Community": "मानव सेवाएं, शिक्षा, स्वास्थ्य एवं समुदाय",
    "Entrepreneurship, Business Strategy & Public Leadership": "उद्यमिता, व्यापार रणनीति एवं नेतृत्व",
    "Operations, Information Systems & Financial Management": "संचालन, सूचना प्रणाली एवं वित्तीय प्रबंधन",
  },
  ar: {
    "Practical Explorer": "المستكشف العملي (Practical Explorer)",
    "Creative Maker & Designer": "المصمم المبدع والصانع",
    "Analytical Systems Thinker": "المفكر التحليلي للأنظمة",
    "Empathetic Catalyst & Leader": "القائد المحفز والمتعاطف",
    "Strategic Coordinator": "المنسق الاستراتيجي",
    "Engineering, Applied Technology & Construction": "الهندسة والتكنولوجيا التطبيقية والإنشاءات",
    "Scientific Inquiry, Research & Computing Analytics": "البحث العلمي والحوسبة وتحليلات البيانات",
    "Creative Arts, Digital Media & Innovative Design": "الفنون الإبداعية والإعلام الرقمي والتصميم",
    "Human Services, Education, Healthcare & Community": "الخدمات الإنسانية والتعليم والرعاية الصحية",
    "Entrepreneurship, Business Strategy & Public Leadership": "ريادة الأعمال واستراتيجية الأعمال والقيادة",
    "Operations, Information Systems & Financial Management": "العمليات ونظم المعلومات والإدارة المالية",
  },
  ta: {
    "Practical Explorer": "நடைமுறை ஆய்வாளர் (Practical Explorer)",
    "Creative Maker & Designer": "படைப்பாற்றல் தயாரிப்பாளர் & வடிவமைப்பாளர்",
    "Analytical Systems Thinker": "பகுப்பாய்வு சிந்தனையாளர்",
    "Empathetic Catalyst & Leader": "பரிவுமிக்க தலைவர்",
    "Strategic Coordinator": "வியூக ஒருங்கிணைப்பாளர்",
    "Engineering, Applied Technology & Construction": "பொறியியல், தொழில்நுட்பம் & கட்டுமானம்",
    "Scientific Inquiry, Research & Computing Analytics": "அறிவியல் ஆராய்ச்சி & தரவு பகுப்பாய்வு",
    "Creative Arts, Digital Media & Innovative Design": "படைப்புக் கலைகள், டிஜிட்டல் ஊடகம் & வடிவமைப்பு",
    "Human Services, Education, Healthcare & Community": "மனித சேவைகள், கல்வி & சுகாதாரம்",
    "Entrepreneurship, Business Strategy & Public Leadership": "தொழில்முனைவு, வணிகம் & தலைமை",
    "Operations, Information Systems & Financial Management": "செயல்பாடுகள் & நிதி மேலாண்மை",
  },
  kn: {
    "Practical Explorer": "ಪ್ರಾಯೋಗಿಕ ಅನ್ವೇಷಕ (Practical Explorer)",
    "Creative Maker & Designer": "ಸೃಜನಶೀಲ ಸೃಷ್ಟಿಕರ್ತ & ವಿನ್ಯಾಸಕ",
    "Analytical Systems Thinker": "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಚಿಂತಕ",
    "Empathetic Catalyst & Leader": "ಸಹಾನುಭೂತಿಯ ನಾಯಕ",
    "Strategic Coordinator": "ಕಾರ್ಯತಂತ್ರದ ಸಂಯೋಜಕ",
    "Engineering, Applied Technology & Construction": "ಎಂಜಿನಿಯರಿಂಗ್, ತಂತ್ರಜ್ಞಾನ & ನಿರ್ಮಾಣ",
    "Scientific Inquiry, Research & Computing Analytics": "ವೈಜ್ಞಾನಿಕ ಸಂಶೋಧನೆ & ಕಂಪ್ಯೂಟಿಂಗ್",
    "Creative Arts, Digital Media & Innovative Design": "ಸೃಜನಶೀಲ ಕಲೆಗಳು & ವಿನ್ಯಾಸ",
    "Human Services, Education, Healthcare & Community": "ಮಾನವ ಸೇವೆಗಳು, ಶಿಕ್ಷಣ & ಆರೋಗ್ಯ",
    "Entrepreneurship, Business Strategy & Public Leadership": "ಉದ್ಯಮಶೀಲತೆ & ನಾಯಕತ್ವ",
    "Operations, Information Systems & Financial Management": "ಕಾರ್ಯಾಚರಣೆಗಳು & ಹಣಕಾಸು ನಿರ್ವಹಣೆ",
  },
};

export class ProfileGenerator {
  /**
   * Generates a student-friendly Learning Profile Archetype from interest and skill results.
   */
  generateLearningProfile(
    interestResult: InterestProfileResult,
    skillResult: SkillBehaviourResult,
    languageCode = "en"
  ): LearningProfileResult {
    const topInterests = interestResult.topClusters || [];
    const firstKey = topInterests[0]?.code || "BUILDER_R";
    const secondKey = topInterests[1]?.code || "EXPLORER_I";

    // Lookup pair or reversed pair
    const pairKey1 = `${firstKey}:${secondKey}`;
    const pairKey2 = `${secondKey}:${firstKey}`;

    const def: ArchetypeDefinition =
      ARCHETYPE_MATRIX[pairKey1] ||
      ARCHETYPE_MATRIX[pairKey2] || {
        archetypeTitle: "Curious Explorer & Builder",
        tagline: "Exploring practical challenges through purposeful curiosity.",
        strengthSummary:
          "You show well-rounded curiosity across both hands-on projects and conceptual problem-solving tasks.",
        explorationFraming:
          "Your current profile shows stronger alignment with science, technology, creative making, and exploratory learning pathways.",
        primaryTraits: ["Curious Mindset", "Versatile Problem Solving", "Active Engagement"],
      };

    const langMap = RESULT_TRANSLATIONS[languageCode] || {};
    const translatedTitle = langMap[def.archetypeTitle] || def.archetypeTitle;

    const primaryTraits = [
      ...def.primaryTraits,
      ...(skillResult.strongestIndicators[0]
        ? [skillResult.strongestIndicators[0].name]
        : []),
    ];

    return {
      archetypeTitle: translatedTitle,
      tagline: def.tagline,
      strengthSummary: def.strengthSummary,
      explorationFraming: def.explorationFraming,
      primaryTraits,
    };
  }

  /**
   * Maps top interest clusters to non-prescriptive Exploration Pathways.
   */
  generateExplorationDirections(
    interestResult: InterestProfileResult,
    languageCode = "en"
  ): ExplorationDirectionItem[] {
    const topClusters = interestResult.topClusters || [];
    const langMap = RESULT_TRANSLATIONS[languageCode] || {};

    return topClusters.map((cluster) => {
      const cat = EXPLORATION_CATALOG[cluster.code] || {
        clusterTitle: cluster.name,
        description: "General exploration pathway.",
        sampleExplorationAreas: ["Multidisciplinary Projects", "Applied Sciences"],
        suggestedActivities: ["Explore club activities and extracurricular hobbies."],
      };

      const translatedTitle = langMap[cat.clusterTitle] || cat.clusterTitle;

      return {
        domain: cluster.name,
        clusterTitle: translatedTitle,
        description: cat.description,
        sampleExplorationAreas: cat.sampleExplorationAreas,
        suggestedActivities: cat.suggestedActivities,
      };
    });
  }

  /**
   * Generates constructive, developmental growth suggestions.
   */
  generateGrowthSuggestions(
    interestResult: InterestProfileResult,
    skillResult: SkillBehaviourResult,
    _languageCode = "en"
  ): string[] {
    const topInterestName = interestResult.topClusters[0]?.name || "applied technology";
    const strongSkillName =
      skillResult.strongestIndicators[0]?.name || "core problem solving";
    const growthOpportunityName =
      skillResult.developmentOpportunities[0]?.name || "collaborative communication";

    return [
      `Engage in hands-on exploration projects aligned with your primary interest in ${topInterestName}.`,
      `Leverage your natural instinct in ${strongSkillName} to lead small team initiatives or science challenges.`,
      `Dedicate time to practice ${growthOpportunityName} through group discussions, presentations, and constructive peer feedback.`,
      `Discuss these findings with a qualified academic and career counselor to plan exploratory high school subject pathways.`,
    ];
  }
}

export const profileGenerator = new ProfileGenerator();
