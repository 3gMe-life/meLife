import { CareerRelatedDimensions, FutureGrowthOutlook } from "./career.types";

export interface CareerSeedItem {
  slug: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  overview: string;
  future_growth: FutureGrowthOutlook;
  education_paths: string[];
  required_skills: string[];
  recommended_subjects: string[];
  learning_roadmap: Array<{
    stage: string;
    title: string;
    description: string;
    focusAreas: string[];
  }>;
  sample_roles: string[];
  related_dimensions: CareerRelatedDimensions;
  display_order: number;
  translations?: Record<
    string,
    {
      title: string;
      category: string;
      industry: string;
      description: string;
      overview: string;
      required_skills: string[];
      recommended_subjects: string[];
    }
  >;
}

export const SEED_CAREERS: CareerSeedItem[] = [
  {
    slug: "ai-machine-learning-architect",
    title: "AI & Machine Learning Architect",
    category: "STEM / Advanced Computing",
    industry: "Information Technology & Intelligent Systems",
    description: "Designs and builds intelligent computer algorithms that enable systems to learn from data, recognize patterns, and solve complex problems.",
    overview: "As an AI & Machine Learning Architect, you create the models and software frameworks that power autonomous robotics, language assistants, medical diagnostics, and scientific simulations. You combine mathematical logic with software engineering to turn raw data into intelligent actions.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Strong focus on Mathematics, Physics, and Computer Science",
      "Undergraduate: Bachelor's in Computer Science, Data Science, or Artificial Intelligence",
      "Specialization: Master's or hands-on projects in Machine Learning, Neural Networks, or Robotics",
    ],
    required_skills: ["Python & Algorithms", "Mathematical Logic", "Systems Thinking", "Pattern Analysis", "Problem Solving"],
    recommended_subjects: ["Mathematics & Calculus", "Computer Science", "Physics", "Statistics", "Data Structures"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Coding Logic & Computational Math",
        description: "Master foundational programming concepts (Python/JavaScript) and applied algebraic problem-solving.",
        focusAreas: ["Python Basics", "Algebra & Functions", "Algorithmic Puzzles", "Science Fair Coding"],
      },
      {
        stage: "Stage 2: Core Engineering (Undergraduate)",
        title: "Algorithms & Statistical Modeling",
        description: "Build deep expertise in machine learning algorithms, database structures, and matrix mathematics.",
        focusAreas: ["Linear Algebra", "Data Structures", "Supervised Learning", "Open Source Projects"],
      },
      {
        stage: "Stage 3: Advanced Application (Specialization)",
        title: "Autonomous & Intelligent Systems",
        description: "Deploy large-scale neural models, robotics integrations, and ethical AI architectures.",
        focusAreas: ["Deep Learning Frameworks", "Robotics Integration", "AI Ethics & Safety", "Industry Capstone"],
      },
    ],
    sample_roles: ["Machine Learning Engineer", "AI Research Scientist", "Data Systems Architect", "Robotics Software Lead"],
    related_dimensions: {
      riasec: { I: 0.95, R: 0.70, C: 0.65, A: 0.35, E: 0.30, S: 0.20 },
      skills: { logical_problem_solving: 0.95, practical_technical: 0.85, creative_thinking: 0.70, self_management: 0.80, visual_spatial: 0.60 },
      aptitude: { pattern_logic: 0.95, numerical_reasoning: 0.90, spatial_reasoning: 0.80, practical_troubleshooting: 0.75 },
      development: { curiosity: 0.95, persistence: 0.90, learning_independence: 0.90, attention_to_detail: 0.85 },
      streams: { science: 0.95, applied_technical: 0.90, commerce: 0.40, humanities: 0.20 },
      archetypes: ["Analytical Systems Thinker", "Practical Explorer", "Strategic Coordinator"],
    },
    display_order: 1,
    translations: {
      ml: {
        title: "എഐ & മെഷീൻ ലേണിംഗ് ആർക്കിടെക്റ്റ്",
        category: "കമ്പ്യൂട്ടിംഗ് & ടെക്നോളജി",
        industry: "ഇൻഫർമേഷൻ ടെക്നോളജി",
        description: "ഡാറ്റയിൽ നിന്ന് വിവരങ്ങൾ സ്വയം മനസ്സിലാക്കി പ്രവർത്തിക്കുന്ന ഇന്റലിജന്റ് സിസ്റ്റങ്ങൾ നിർമ്മിക്കുന്നു.",
        overview: "ഡാറ്റ വിശകലനം ചെയ്യാനും മനുഷ്യനെപ്പോലെ ചിന്തിക്കാനും തീരുമാനങ്ങളെടുക്കാനും കമ്പ്യൂട്ടറുകളെ പ്രാപ്തമാക്കുന്ന സിസ്റ്റങ്ങൾ വികസിപ്പിക്കുന്നു.",
        required_skills: ["പൈത്തൺ പ്രോഗ്രാമിംഗ്", "ഗണിതശാസ്ത്ര ചിന്ത", "ഡാറ്റ വിശകലനം", "പ്രശ്നപരിഹാര ശേഷി"],
        recommended_subjects: ["മാത്തമാറ്റിക്സ്", "കമ്പ്യൂട്ടർ സയൻസ്", "ഫിസിക്സ്", "സ്റ്റാറ്റിസ്റ്റിക്സ്"],
      },
      hi: {
        title: "एआई एवं मशीन लर्निंग आर्किटेक्ट",
        category: "कंप्यूटिंग एवं उन्नत तकनीक",
        industry: "सूचना प्रौद्योगिकी",
        description: "स्मार्ट कंप्यूटर एल्गोरिदम और बुद्धिमान प्रणालियों का निर्माण और विकास करते हैं।",
        overview: "डेटा को समझकर निर्णय लेने वाले और जटिल समस्याओं को हल करने वाले आधुनिक सॉफ्टवेयर मॉडल तैयार करते हैं।",
        required_skills: ["पायथन कोडिंग", "गणितीय तर्क", "सिस्टम थिंकिंग", "पैटर्न एनालिसिस"],
        recommended_subjects: ["गणित", "कंप्यूटर साइंस", "भौतिक विज्ञान", "सांख्यिकी"],
      },
      ar: {
        title: "مهندس الذكاء الاصطناعي وتعلّم الآلة",
        category: "الحوسبة المتقدمة والتقنية",
        industry: "تكنولوجيا المعلومات والأنظمة الذكية",
        description: "تصميم وتطوير خوارزميات برمجية ذكية قادرة على التعلم وحل المشكلات المعقدة.",
        overview: "بناء الأنظمة الذكية التي تقود الروبوتات والتحليل المتقدم والتشخيص الطبي المعتمد على البيانات الضخمة.",
        required_skills: ["برمجة بايثون", "المنطق الرياضي", "تحليل الأنماط", "التفكير المنظومي"],
        recommended_subjects: ["الرياضيات والتحليل", "علوم الحاسب", "الفيزياء", "الإحصاء"],
      },
      ta: {
        title: "செயற்கை நுண்ணறிவு மற்றும் மெஷின் லேர்னிங் பொறியாளர்",
        category: "கம்ப்யூட்டிங் மற்றும் தொழில்நுட்பம்",
        industry: "தகவல் தொழில்நுட்பம்",
        description: "தரவுகளை பகுப்பாய்வு செய்து தானாக இயங்கும் அறிவார்ந்த மென்பொருட்களை உருவாக்குகிறார்.",
        overview: "சிக்கலான பிரச்சனைகளை தீர்க்கும் நுண்ணறிவு அமைப்புகளையும் வழிமுறைகளையும் உருவாக்குகிறார்.",
        required_skills: ["பைதான் நிரலாக்கம்", "கணித தர்க்கம்", "பிரச்சனை தீர்க்கும் திறன்", "தரவு பகுப்பாய்வு"],
        recommended_subjects: ["கணிதம்", "கணினி அறிவியல்", "இயற்பியல்", "புள்ளியியல்"],
      },
      kn: {
        title: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಮೆಷಿನ್ ಲರ್ನಿಂಗ್ ಇಂಜಿನಿಯರ್",
        category: "ಕಂಪ್ಯೂಟಿಂಗ್ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ",
        industry: "ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ",
        description: "ಡೇಟಾ ವಿಶ್ಲೇಷಿಸಿ ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಕೆಲಸ ಮಾಡುವ ಸಾಫ್ಟ್‌ವೇರ್ ಸಿಸ್ಟಮ್‌ಗಳನ್ನು ರೂಪಿಸುತ್ತಾರೆ.",
        overview: "ಸಂಕೀರ್ಣ ಸಮಸ್ಯೆಗಳಿಗೆ ತಂತ್ರಜ್ಞಾನ ಆಧಾರಿತ ಬುದ್ಧಿವಂತ ಪರಿಹಾರಗಳನ್ನು ಒದಗಿಸುವ ವ್ಯವಸ್ಥೆ ನಿರ್ಮಿಸುತ್ತಾರೆ.",
        required_skills: ["ಪೈಥಾನ್ ಪ್ರೋಗ್ರಾಮಿಂಗ್", "ಗಣಿತ ತರ್ಕ", "ಸಿಸ್ಟಮ್ಸ್ ಥಿಂಕಿಂಗ್", "ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ"],
        recommended_subjects: ["ಗಣಿತ", "ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್", "ಭೌತಶಾಸ್ತ್ರ", "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ"],
      },
    },
  },

  {
    slug: "robotics-autonomous-systems-engineer",
    title: "Robotics & Autonomous Systems Engineer",
    category: "Engineering & Automation",
    industry: "Advanced Manufacturing & Robotics",
    description: "Combines mechanical design, electronics, and smart programming to build autonomous machines that assist in space, healthcare, and industry.",
    overview: "Robotics Engineers bring machines to life. You integrate sensors, mechanical linkages, microcontrollers, and computer vision so robots can navigate environments, assist surgeons, inspect pipelines, or explore distant planets.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Physics, Mathematics, Chemistry, Computer Science",
      "Undergraduate: Bachelor's in Mechatronics, Robotics, Mechanical, or Electrical Engineering",
      "Specialization: Embedded Systems, Control Theory, Computer Vision, or Autonomous Navigation",
    ],
    required_skills: ["Microcontrollers & Circuits", "CAD 3D Modeling", "C++ / Python", "Spatial Intuition", "Kinematics & Physics"],
    recommended_subjects: ["Physics (Mechanics)", "Mathematics", "Computer Science", "Electronics", "Applied Mechanics"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Hands-on Electronics & Maker Kits",
        description: "Experiment with Arduino, basic sensors, motor drivers, and mechanical building kits.",
        focusAreas: ["Arduino & Sensors", "Circuit Fundamentals", "Basic Coding", "Robotics Clubs"],
      },
      {
        stage: "Stage 2: Core Engineering (Undergraduate)",
        title: "Mechatronics & Embedded Control",
        description: "Study kinematics, circuit design, sensor fusion, and real-time operating systems.",
        focusAreas: ["Control Systems", "CAD Design", "Microprocessor Architecture", "ROS (Robot Operating System)"],
      },
      {
        stage: "Stage 3: Advanced Specialization",
        title: "Autonomous Navigation & Perception",
        description: "Design fully autonomous mobile robots, robotic arms, and drone navigation algorithms.",
        focusAreas: ["Computer Vision", "Path Planning & SLAM", "Feedback Control", "Industrial Automation"],
      },
    ],
    sample_roles: ["Robotics Engineer", "Mechatronics Specialist", "Automation Architect", "Autonomous Vehicle Systems Engineer"],
    related_dimensions: {
      riasec: { R: 0.95, I: 0.85, C: 0.60, A: 0.45, E: 0.30, S: 0.20 },
      skills: { practical_technical: 0.95, logical_problem_solving: 0.90, visual_spatial: 0.85, creative_thinking: 0.75 },
      aptitude: { spatial_reasoning: 0.95, practical_troubleshooting: 0.95, pattern_logic: 0.85, numerical_reasoning: 0.85 },
      development: { persistence: 0.95, curiosity: 0.90, learning_independence: 0.85, attention_to_detail: 0.90 },
      streams: { science: 0.95, applied_technical: 0.95, commerce: 0.30, humanities: 0.20 },
      archetypes: ["Practical Explorer", "Analytical Systems Thinker", "Creative Maker"],
    },
    display_order: 2,
    translations: {
      ml: {
        title: "റോബോട്ടിക്സ് & ഓട്ടോണമസ് സിസ്റ്റംസ് എൻജിനീയർ",
        category: "എൻജിനീയറിംഗ് & ഓട്ടോമേഷൻ",
        industry: "റോബോട്ടിക്സ് & മാനുഫാക്ചറിംഗ്",
        description: "യന്ത്രസാമഗ്രികളും കമ്പ്യൂട്ടർ പ്രോഗ്രാമിംഗും സംയോജിപ്പിച്ച് സ്വയം പ്രവർത്തിക്കുന്ന റോബോട്ടുകളെ നിർമ്മിക്കുന്നു.",
        overview: "ആരോഗ്യരംഗം, വ്യവസായം, ബഹിരാകാശ ഗവേഷണം എന്നിവയ്ക്കായി ബുദ്ധിപരമായ റോബോട്ടിക് സംവിധാനങ്ങൾ രൂപകൽപ്പന ചെയ്യുന്നു.",
        required_skills: ["സർക്യൂട്ട് നിർമ്മാണം", "3D മോഡലിംഗ്", "റോബോട്ടിക് പ്രോഗ്രാമിംഗ്", "ഫിസിക്സ്"],
        recommended_subjects: ["ഫിസിക്സ്", "മാത്തമാറ്റിക്സ്", "കമ്പ്യൂട്ടർ സയൻസ്", "ഇലക്ട്രോണിക്സ്"],
      },
      hi: {
        title: "रोबोटिक्स एवं ऑटोनॉमस सिस्टम्स इंजीनियर",
        category: "इंजीनियरिंग एवं स्वचालन",
        industry: "रोबोटिक्स व उन्नत विनिर्माण",
        description: "यांत्रिक डिजाइन, इलेक्ट्रॉनिक्स और प्रोग्रामिंग को मिलाकर रोबोट और स्वचालित मशीनें बनाते हैं।",
        overview: "उद्योग, अंतरिक्ष अनुसंधान और चिकित्सा क्षेत्र के लिए स्मार्ट और स्वायत्त रोबोटिक समाधान विकसित करते हैं।",
        required_skills: ["माइक्रोकंट्रोलर", "3D कैड डिजाइन", "सी++/पायथन", "स्थानिक समझ"],
        recommended_subjects: ["भौतिकी (यांत्रिकी)", "गणित", "कंप्यूटर साइंस", "इलेक्ट्रॉनिक्स"],
      },
      ar: {
        title: "مهندس الروبوتات والأنظمة الذاتية القيادة",
        category: "الهندسة والأتمتة",
        industry: "الروبوتات والتصنيع المتقدم",
        description: "دمج الهندسة الميكانيكية والإلكترونيات والبرمجة لبناء آلات ذكية ذاتية الحركة.",
        overview: "تصميم أنظمة متكاملة للروبوتات الطبية، والمسابير الفضائية، وخطوط الإنتاج الصناعي الذكية.",
        required_skills: ["الدوائر المدمجة", "التصميم ثلاثي الأبعاد", "التحكم الحركي", "الفيزياء التطبيقية"],
        recommended_subjects: ["الفيزياء الميكانيكية", "الرياضيات", "علوم الحاسب", "الإلكترونيات"],
      },
    },
  },

  {
    slug: "biomedical-genomic-data-scientist",
    title: "Biomedical & Genomic Data Scientist",
    category: "Health Sciences & Bio-Computing",
    industry: "Biotechnology & Precision Medicine",
    description: "Applies computer algorithms and statistics to biological and genetic data to discover new medical treatments and understand human health.",
    overview: "Biomedical Data Scientists bridge the gap between biology and computing. By analyzing DNA sequences, protein interactions, and clinical data, you help doctors identify disease markers and customize personalized therapies for patients.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Biology, Mathematics, Chemistry, Computer Science",
      "Undergraduate: Biotechnology, Bioinformatics, Molecular Biology, or Biomedical Engineering",
      "Specialization: Computational Genomics, Biostatistics, or Health Informatics",
    ],
    required_skills: ["Biological Systems Knowledge", "Data Analysis (R/Python)", "Statistical Genetics", "Scientific Inquiry", "Critical Thinking"],
    recommended_subjects: ["Biology & Genetics", "Chemistry", "Mathematics & Statistics", "Computer Science"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Life Sciences & Analytical Computing",
        description: "Develop strong comprehension of cellular biology and basic data scripting.",
        focusAreas: ["Cell Biology & DNA", "Spreadsheet Analytics", "Introductory Python", "Science Projects"],
      },
      {
        stage: "Stage 2: Core Interdisciplinary Study",
        title: "Genomics & Bio-Algorithms",
        description: "Learn molecular modeling, genomic databases, and statistical testing methodologies.",
        focusAreas: ["Genetics & Biochemistry", "Bioinformatics Databases (NCBI)", "Statistical Inference", "R Programming"],
      },
      {
        stage: "Stage 3: Advanced Translational Science",
        title: "Precision Medicine & Therapeutics",
        description: "Analyze large-scale patient cohort data to discover personalized drug targets.",
        focusAreas: ["Next-Gen Sequencing Analytics", "Machine Learning in Biology", "Clinical Trial Design", "Research Publication"],
      },
    ],
    sample_roles: ["Bioinformatics Scientist", "Genomics Data Analyst", "Computational Biologist", "Clinical Research Data Lead"],
    related_dimensions: {
      riasec: { I: 0.95, R: 0.60, C: 0.75, S: 0.50, A: 0.35, E: 0.25 },
      skills: { logical_problem_solving: 0.95, self_management: 0.90, communication: 0.70, practical_technical: 0.75 },
      aptitude: { pattern_logic: 0.90, numerical_reasoning: 0.90, planning_estimation: 0.85, verbal_reasoning: 0.75 },
      development: { attention_to_detail: 0.95, persistence: 0.90, curiosity: 0.95, learning_independence: 0.85 },
      streams: { science: 0.95, applied_technical: 0.75, commerce: 0.40, humanities: 0.30 },
      archetypes: ["Analytical Systems Thinker", "Curious Researcher", "Strategic Coordinator"],
    },
    display_order: 3,
  },

  {
    slug: "renewable-energy-sustainable-engineer",
    title: "Renewable Energy & Sustainable Systems Engineer",
    category: "CleanTech & Environmental Engineering",
    industry: "Energy Transition & Climate Tech",
    description: "Designs clean power systems including solar, wind, hydrogen, and smart grids to accelerate global sustainability and protect our climate.",
    overview: "Renewable Energy Engineers build the sustainable infrastructure of tomorrow. You evaluate wind and solar resources, design efficient energy storage batteries, and develop smart energy grids that power entire cities with zero emissions.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Physics, Chemistry, Mathematics, Environmental Studies",
      "Undergraduate: Bachelor's in Electrical, Energy, Mechanical, or Environmental Engineering",
      "Specialization: Photovoltaics, Grid Storage, Hydrogen Systems, or Sustainable Architecture",
    ],
    required_skills: ["Thermodynamics & Energy Flow", "Environmental Impact Assessment", "Electrical Power Systems", "Sustainability Mindset", "Simulation Tools"],
    recommended_subjects: ["Physics (Electricity & Magnetism)", "Chemistry", "Mathematics", "Environmental Science"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Energy Principles & Ecological Science",
        description: "Understand conservation of energy, renewable technologies, and climate impact models.",
        focusAreas: ["Physics of Energy", "Solar Cell Experiments", "Environmental Ecology", "Science Fair Projects"],
      },
      {
        stage: "Stage 2: Core Engineering Study",
        title: "Power Electronics & Energy Storage",
        description: "Study battery chemistry, electrical generation, power conversion, and fluid dynamics.",
        focusAreas: ["Circuit Analysis", "Fluid & Thermal Dynamics", "Battery Tech", "Energy Policy & Economics"],
      },
      {
        stage: "Stage 3: Advanced CleanTech Systems",
        title: "Smart Grids & Decarbonization",
        description: "Architect utility-scale solar/wind farms and micro-grid energy distribution networks.",
        focusAreas: ["Grid Integration", "Hydrogen & Fuel Cells", "Carbon Modeling", "Life Cycle Engineering"],
      },
    ],
    sample_roles: ["Renewable Energy Engineer", "Solar Systems Designer", "Smart Grid Specialist", "Sustainability Consultant"],
    related_dimensions: {
      riasec: { R: 0.90, I: 0.85, S: 0.50, C: 0.55, E: 0.40, A: 0.35 },
      skills: { practical_technical: 0.90, logical_problem_solving: 0.85, visual_spatial: 0.80, social_teamwork: 0.70 },
      aptitude: { practical_troubleshooting: 0.90, spatial_reasoning: 0.85, pattern_logic: 0.80, numerical_reasoning: 0.80 },
      development: { initiative: 0.90, persistence: 0.85, collaboration: 0.80, curiosity: 0.85 },
      streams: { science: 0.95, applied_technical: 0.90, commerce: 0.45, humanities: 0.40 },
      archetypes: ["Practical Explorer", "Impact Catalyst", "Analytical Systems Thinker"],
    },
    display_order: 4,
  },

  {
    slug: "ux-creative-technologist",
    title: "Human-Centered UX & Creative Technologist",
    category: "Digital Design & Creative Arts",
    industry: "Interactive Media & Human-Computer Interaction",
    description: "Combines psychology, visual aesthetics, and interactive technology to design intuitive apps, virtual environments, and digital products.",
    overview: "Creative Technologists make digital experiences enjoyable and accessible. You understand user behaviour, create interactive prototypes, conduct user research, and blend visual design with modern front-end technology.",
    future_growth: "High",
    education_paths: [
      "Secondary: Arts, Design, Computer Applications, Psychology, English",
      "Undergraduate: Bachelor's in Interaction Design, Human-Computer Interaction (HCI), Fine Arts, or Digital Media",
      "Specialization: User Research, AR/VR Experience Design, or Design Systems Architecture",
    ],
    required_skills: ["User Empathy & Research", "Visual Layout & Typography", "Interactive Prototyping (Figma)", "Front-end Basics", "Creative Storytelling"],
    recommended_subjects: ["Design & Visual Arts", "Psychology / Human Behaviour", "Computer Science", "Media Studies"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Visual Design & Empathy Mapping",
        description: "Learn principles of visual balance, color theory, digital sketching, and user problem interviews.",
        focusAreas: ["Figma & Canva", "Color & Typography", "User Empathy Interviews", "Portfolio Sketching"],
      },
      {
        stage: "Stage 2: Core Interaction Design",
        title: "Usability Testing & Wireframing",
        description: "Master user flows, wireframes, accessibility standards (WCAG), and responsive prototyping.",
        focusAreas: ["Information Architecture", "Usability Testing", "Design Systems", "HTML/CSS Basics"],
      },
      {
        stage: "Stage 3: Advanced Creative Tech",
        title: "Spatial & Immersive UI",
        description: "Design multi-platform mobile ecosystems, augmented reality interfaces, and voice interactions.",
        focusAreas: ["Spatial UI (AR/VR)", "Micro-interactions", "UX Analytics", "Product Strategy"],
      },
    ],
    sample_roles: ["UX/UI Designer", "Product Designer", "Creative Technologist", "Design Researcher"],
    related_dimensions: {
      riasec: { A: 0.95, I: 0.70, S: 0.65, E: 0.50, R: 0.40, C: 0.30 },
      skills: { creative_thinking: 0.95, visual_spatial: 0.90, communication: 0.85, social_teamwork: 0.80, logical_problem_solving: 0.70 },
      aptitude: { creative_performance: 0.95, spatial_reasoning: 0.85, social_judgment: 0.85, verbal_reasoning: 0.80 },
      development: { curiosity: 0.95, adaptability: 0.90, collaboration: 0.85, initiative: 0.80 },
      streams: { humanities: 0.85, applied_technical: 0.85, science: 0.60, commerce: 0.65 },
      archetypes: ["Creative Maker", "Empathetic Catalyst", "Practical Explorer"],
    },
    display_order: 5,
  },

  {
    slug: "quantitative-economic-strategist",
    title: "Quantitative Economic & Financial Strategist",
    category: "Economics, Analytics & FinTech",
    industry: "Global Markets & Economic Strategy",
    description: "Uses mathematical models, econometric data, and algorithms to analyze global market trends, forecast economic shifts, and optimize resource allocation.",
    overview: "Quantitative Strategists decode the financial world using mathematics and computational modeling. You formulate statistical trading algorithms, evaluate sovereign economic policies, and build risk prevention models for global institutions.",
    future_growth: "High",
    education_paths: [
      "Secondary: Mathematics, Economics, Business Studies, Statistics",
      "Undergraduate: Economics, Quantitative Finance, Applied Mathematics, or Statistics",
      "Specialization: Econometrics, Financial Engineering, or Computational Game Theory",
    ],
    required_skills: ["Statistical Modeling", "Economic Principles", "Quantitative Logic", "Risk Management", "Data Analytics (Python/R)"],
    recommended_subjects: ["Advanced Mathematics", "Economics", "Statistics", "Computer Science", "Business Studies"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Economic Reasoning & Quantitative Math",
        description: "Master supply and demand dynamics, macroeconomic indicators, and probability calculus.",
        focusAreas: ["Micro & Macro Economics", "Probability & Statistics", "Spreadsheet Modeling", "Economic Debates"],
      },
      {
        stage: "Stage 2: Core Quantitative Study",
        title: "Econometrics & Algorithmic Modeling",
        description: "Build time-series forecasting models, stochastic calculus, and capital allocation frameworks.",
        focusAreas: ["Econometrics", "Time-Series Analysis", "Python for Finance", "Corporate Finance"],
      },
      {
        stage: "Stage 3: Advanced Global Strategy",
        title: "Risk Engineering & Macro Strategy",
        description: "Design systemic risk controls, algorithmic execution mechanisms, and policy simulations.",
        focusAreas: ["Stochastic Calculus", "Macro Forecasting", "Quantitative Risk Models", "FinTech Strategy"],
      },
    ],
    sample_roles: ["Quantitative Analyst (Quant)", "Economic Strategist", "Portfolio Risk Manager", "Policy Economist"],
    related_dimensions: {
      riasec: { C: 0.90, I: 0.85, E: 0.80, R: 0.20, A: 0.30, S: 0.40 },
      skills: { logical_problem_solving: 0.95, leadership_initiative: 0.85, communication: 0.80, self_management: 0.85 },
      aptitude: { numerical_reasoning: 0.95, pattern_logic: 0.90, planning_estimation: 0.90, verbal_reasoning: 0.80 },
      development: { attention_to_detail: 0.95, persistence: 0.85, initiative: 0.90, learning_independence: 0.85 },
      streams: { commerce: 0.95, science: 0.70, applied_technical: 0.60, humanities: 0.50 },
      archetypes: ["Strategic Coordinator", "Analytical Systems Thinker", "Enterprising Leader"],
    },
    display_order: 6,
  },

  {
    slug: "aerospace-autonomous-flight-engineer",
    title: "Aerospace & Autonomous Flight Engineer",
    category: "Aviation & Applied Physics",
    industry: "Aerospace Defense & Space Exploration",
    description: "Designs spacecraft, supersonic aircraft, satellites, and autonomous aerial drones built to operate in extreme atmospheric and orbital environments.",
    overview: "Aerospace Engineers push the frontiers of human flight and space discovery. You design aerodynamic wings, rocket propulsion chambers, heat shields, and automated satellite navigation systems.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Physics, Mathematics, Chemistry, Computer Science",
      "Undergraduate: Bachelor's in Aerospace, Aeronautical, or Mechanical Engineering",
      "Specialization: Orbital Mechanics, Propulsion Dynamics, Hypersonic Aerodynamics, or Avionics",
    ],
    required_skills: ["Aerodynamics & Fluid Simulation", "Orbital Mechanics", "CAD & Thermal Modeling", "Avionics Systems", "Structural Physics"],
    recommended_subjects: ["Physics (Mechanics & Waves)", "Mathematics (Calculus)", "Chemistry", "Computer Science"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Classical Mechanics & Model Flight",
        description: "Study Newton's laws of motion, fluid lift, model rocketry, and digital 3D drafting.",
        focusAreas: ["Newtonian Physics", "Model Rocketry", "Basic 3D CAD", "Astronomy & Flight Clubs"],
      },
      {
        stage: "Stage 2: Core Engineering Study",
        title: "Aerodynamics & Propulsion",
        description: "Learn Navier-Stokes fluid simulations, gas turbine cycles, stress analysis, and flight dynamics.",
        focusAreas: ["Incompressible Flow", "Structural Mechanics", "Propulsion Thermodynamics", "MATLAB / Python"],
      },
      {
        stage: "Stage 3: Advanced Space & Flight Systems",
        title: "Orbital Mechanics & Autonomous Avionics",
        description: "Develop satellite attitude control systems, space payload architectures, and autonomous drone guidance.",
        focusAreas: ["Orbital Trajectories", "Avionics Software", "Composite Materials", "Space Mission Design"],
      },
    ],
    sample_roles: ["Aerospace Engineer", "Propulsion Specialist", "Flight Control Systems Engineer", "Satellite Systems Architect"],
    related_dimensions: {
      riasec: { R: 0.95, I: 0.90, C: 0.70, A: 0.30, E: 0.30, S: 0.20 },
      skills: { visual_spatial: 0.95, logical_problem_solving: 0.95, practical_technical: 0.90, self_management: 0.85 },
      aptitude: { spatial_reasoning: 0.95, numerical_reasoning: 0.95, pattern_logic: 0.90, practical_troubleshooting: 0.85 },
      development: { attention_to_detail: 0.95, persistence: 0.95, curiosity: 0.90, learning_independence: 0.85 },
      streams: { science: 0.95, applied_technical: 0.95, commerce: 0.30, humanities: 0.15 },
      archetypes: ["Analytical Systems Thinker", "Practical Explorer", "Creative Maker"],
    },
    display_order: 7,
  },

  {
    slug: "cybersecurity-digital-forensics-architect",
    title: "Cybersecurity & Digital Forensics Specialist",
    category: "Information Defense & Networks",
    industry: "Information Security & Infrastructure Defense",
    description: "Protects critical digital networks, hospitals, and national infrastructure from cyber attacks while analyzing digital crime traces.",
    overview: "Cybersecurity Specialists are the defenders of the modern digital realm. You discover software vulnerabilities before attackers do, build impenetrable encryption keys, and investigate security breaches using forensic evidence.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Computer Science, Mathematics, Physics, English",
      "Undergraduate: Bachelor's in Cybersecurity, Computer Networks, or Computer Science",
      "Specialization: Ethical Hacking, Network Defense, Cryptography, or Digital Forensics",
    ],
    required_skills: ["Network Protocols (TCP/IP)", "Ethical Hacking & Penetration", "Cryptographic Logic", "Incident Forensics", "Analytical Investigation"],
    recommended_subjects: ["Computer Science & Networks", "Mathematics (Discrete Math)", "Physics", "Legal / Ethics Studies"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Computer Networks & System Architecture",
        description: "Understand operating systems (Linux), packet routing, and safe digital hygiene.",
        focusAreas: ["Linux Command Line", "Networking Basics", "Logic & Scripting", "Capture The Flag (CTF) Puzzles"],
      },
      {
        stage: "Stage 2: Core Defense & Testing",
        title: "Penetration Testing & Cryptography",
        description: "Study security auditing, public key encryption, malware reverse engineering, and threat hunting.",
        focusAreas: ["Network Security", "Cryptography", "Vulnerability Assessment", "Python Scripting"],
      },
      {
        stage: "Stage 3: Advanced Architecture & Forensics",
        title: "Incident Response & Zero-Trust Defense",
        description: "Architect multi-cloud zero-trust architectures and conduct deep forensic evidence extraction.",
        focusAreas: ["Zero-Trust Networks", "Cloud Security", "Memory Forensics", "Security Governance"],
      },
    ],
    sample_roles: ["Security Operations Lead", "Penetration Tester / Ethical Hacker", "Digital Forensics Investigator", "Chief Information Security Architect"],
    related_dimensions: {
      riasec: { I: 0.90, C: 0.85, R: 0.70, E: 0.40, A: 0.30, S: 0.20 },
      skills: { logical_problem_solving: 0.95, self_management: 0.90, practical_technical: 0.85, creative_thinking: 0.75 },
      aptitude: { pattern_logic: 0.95, practical_troubleshooting: 0.90, numerical_reasoning: 0.85, planning_estimation: 0.80 },
      development: { persistence: 0.95, attention_to_detail: 0.95, curiosity: 0.90, learning_independence: 0.85 },
      streams: { science: 0.90, applied_technical: 0.95, commerce: 0.50, humanities: 0.20 },
      archetypes: ["Analytical Systems Thinker", "Strategic Coordinator", "Practical Explorer"],
    },
    display_order: 8,
  },

  {
    slug: "environmental-climate-data-analyst",
    title: "Environmental & Climate Data Analyst",
    category: "Earth & Atmospheric Sciences",
    industry: "Ecological Conservation & Climate Intelligence",
    description: "Analyzes satellite weather data, ocean currents, and biodiversity indicators to protect ecosystems and guide sustainable climate policies.",
    overview: "Climate Analysts use data science to safeguard planet Earth. You examine satellite radar imagery, track greenhouse emissions, model rising sea levels, and advise international organizations on climate adaptation strategies.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Geography, Biology, Chemistry, Mathematics, Environmental Science",
      "Undergraduate: Bachelor's in Environmental Science, Geospatial Technologies, or Meteorology",
      "Specialization: Remote Sensing, Geographic Information Systems (GIS), or Earth System Modeling",
    ],
    required_skills: ["GIS & Spatial Mapping", "Environmental Chemistry", "Data Visualization", "Scientific Reporting", "Ecological Passion"],
    recommended_subjects: ["Environmental Science", "Geography / GIS", "Chemistry", "Mathematics", "Biology"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Earth Systems & Geospatial Inquiry",
        description: "Explore water cycles, satellite weather mapping, atmospheric layers, and local ecological field studies.",
        focusAreas: ["Earth Science Basics", "Google Earth & Maps", "Ecology Projects", "Scientific Observation"],
      },
      {
        stage: "Stage 2: Core Geospatial Analysis",
        title: "Remote Sensing & GIS Analytics",
        description: "Master satellite data processing (ArcGIS / QGIS), statistical climatology, and water resource modeling.",
        focusAreas: ["GIS Software", "Remote Sensing", "Environmental Statistics", "Hydrology & Soil Science"],
      },
      {
        stage: "Stage 3: Advanced Climate Modeling",
        title: "Earth System Simulation & Policy",
        description: "Build global climate projection models and design regional biodiversity protection initiatives.",
        focusAreas: ["Global Climate Models", "Carbon Budget Analytics", "Environmental Policy", "Ecosystem Restoration"],
      },
    ],
    sample_roles: ["Climate Data Scientist", "GIS Specialist", "Ecological Impact Evaluator", "Atmospheric Modeling Analyst"],
    related_dimensions: {
      riasec: { I: 0.95, R: 0.70, S: 0.60, C: 0.65, A: 0.40, E: 0.30 },
      skills: { logical_problem_solving: 0.90, communication: 0.80, practical_technical: 0.75, visual_spatial: 0.75 },
      aptitude: { pattern_logic: 0.90, numerical_reasoning: 0.85, spatial_reasoning: 0.85, verbal_reasoning: 0.80 },
      development: { curiosity: 0.95, collaboration: 0.85, persistence: 0.85, initiative: 0.80 },
      streams: { science: 0.95, applied_technical: 0.80, humanities: 0.60, commerce: 0.45 },
      archetypes: ["Empathetic Catalyst", "Analytical Systems Thinker", "Practical Explorer"],
    },
    display_order: 9,
  },

  {
    slug: "industrial-product-designer",
    title: "Industrial Product & Smart Hardware Designer",
    category: "Industrial Design & Ergonomics",
    industry: "Consumer Electronics & Physical Products",
    description: "Designs the physical shape, ergonomics, materials, and intuitive feel of products—from electric vehicles to smart wearable devices.",
    overview: "Industrial Designers imagine how physical objects are shaped and experienced. You sketch futuristic product concepts, sculpt ergonomic prototypes, select sustainable polymers and metals, and collaborate with engineers to mass-produce smart hardware.",
    future_growth: "High",
    education_paths: [
      "Secondary: Design, Physics, Mathematics, Visual Arts",
      "Undergraduate: Bachelor's in Industrial Design, Product Design, or Ergonomic Engineering",
      "Specialization: Sustainable Materials, Smart Wearables, or Automotive Design",
    ],
    required_skills: ["Concept Sketching & Rendering", "3D CAD & Prototyping", "Ergonomics & Human Factors", "Material Science", "Creative Problem Solving"],
    recommended_subjects: ["Visual Arts & Sketching", "Physics", "Design & Technology", "Mathematics"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Form, Sketching & Material Craft",
        description: "Practice rapid perspective drawing, clay sculpting, foam prototyping, and understanding product aesthetics.",
        focusAreas: ["Freehand Sketching", "Model Making & Foam", "Design History", "Creative Portfolios"],
      },
      {
        stage: "Stage 2: Core Industrial Design",
        title: "Ergonomics & Digital Surface Modeling",
        description: "Master parametric 3D software (Rhino, SolidWorks), human body measurements (ergonomics), and manufacturing tooling.",
        focusAreas: ["3D CAD & Surface Modeling", "Ergonomics & Usability", "Manufacturing Processes", "Rapid 3D Printing"],
      },
      {
        stage: "Stage 3: Advanced Hardware Innovation",
        title: "Smart Hardware & Circular Product Ecosystems",
        description: "Integrate sensors, smart lighting, biodegradable composites, and full cradle-to-cradle lifecycle engineering.",
        focusAreas: ["Circular Design & Recyclability", "Smart Hardware Enclosures", "Design Brand Identity", "Design Exhibitions"],
      },
    ],
    sample_roles: ["Industrial Designer", "Consumer Hardware Designer", "Ergonomics Specialist", "Automotive Exterior/Interior Designer"],
    related_dimensions: {
      riasec: { A: 0.95, R: 0.85, I: 0.60, E: 0.50, S: 0.40, C: 0.35 },
      skills: { visual_spatial: 0.95, creative_thinking: 0.95, practical_technical: 0.85, communication: 0.75 },
      aptitude: { spatial_reasoning: 0.95, creative_performance: 0.95, practical_troubleshooting: 0.80, pattern_logic: 0.75 },
      development: { curiosity: 0.95, adaptability: 0.90, persistence: 0.85, attention_to_detail: 0.85 },
      streams: { applied_technical: 0.95, science: 0.65, humanities: 0.70, commerce: 0.50 },
      archetypes: ["Creative Maker", "Practical Explorer", "Analytical Systems Thinker"],
    },
    display_order: 10,
  },

  {
    slug: "cognitive-educational-technologist",
    title: "Cognitive Science & Educational Technologist",
    category: "Learning Sciences & Psychology",
    industry: "EdTech & Cognitive Innovation",
    description: "Blends human psychology, brain learning science, and interactive software to design adaptive educational tools and gamified learning platforms.",
    overview: "Educational Technologists revolutionize how humans learn. You study how the brain processes memory and attention, and build intelligent adaptive learning platforms that make learning fun, engaging, and personalized for every student.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Psychology, English, Computer Science, Biology, Social Studies",
      "Undergraduate: Bachelor's in Cognitive Science, Psychology, Education, or Computer Science",
      "Specialization: Adaptive Learning Systems, Gamification, or Human Learning Analytics",
    ],
    required_skills: ["Cognitive Psychology Principles", "Curriculum Architecture", "Gamified Learning Design", "Empathy & Communication", "User Analytics"],
    recommended_subjects: ["Psychology", "Computer Science / Media", "Biology (Neuroscience)", "English / Linguistics"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Human Psychology & Interactive Media",
        description: "Explore cognitive memory tricks, peer tutoring experiments, interactive quizzes, and social psychology.",
        focusAreas: ["Introductory Psychology", "Interactive Storytelling", "Peer Mentorship", "EdTech Tools"],
      },
      {
        stage: "Stage 2: Core Learning Science",
        title: "Cognitive Architecture & Gamification",
        description: "Study memory retention curves, cognitive load theory, game mechanics, and learner assessment psychology.",
        focusAreas: ["Cognitive Science", "Instructional Design", "Gamification Mechanics", "Learning Analytics"],
      },
      {
        stage: "Stage 3: Advanced Adaptive EdTech",
        title: "AI-Powered Adaptive Learning Platforms",
        description: "Architect dynamic educational systems that adapt difficulty, pacing, and feedback in real time.",
        focusAreas: ["Adaptive Learning Algorithms", "Accessibility in Education", "Neuroscience in Learning", "EdTech Product Management"],
      },
    ],
    sample_roles: ["Learning Experience Designer (LXD)", "Cognitive Science Researcher", "EdTech Product Lead", "Educational Psychologist"],
    related_dimensions: {
      riasec: { S: 0.95, I: 0.80, A: 0.70, E: 0.50, C: 0.40, R: 0.20 },
      skills: { communication: 0.95, social_teamwork: 0.95, creative_thinking: 0.85, logical_problem_solving: 0.75 },
      aptitude: { verbal_reasoning: 0.95, social_judgment: 0.95, creative_performance: 0.85, planning_estimation: 0.75 },
      development: { collaboration: 0.95, curiosity: 0.90, adaptability: 0.90, initiative: 0.85 },
      streams: { humanities: 0.95, applied_technical: 0.70, commerce: 0.50, science: 0.50 },
      archetypes: ["Empathetic Catalyst", "Creative Maker", "Strategic Coordinator"],
    },
    display_order: 11,
  },

  {
    slug: "healthcare-precision-medicine-technologist",
    title: "Healthcare Systems & Precision Medicine Technologist",
    category: "Clinical Healthcare & Innovation",
    industry: "Smart Hospital Systems & Medical Diagnostics",
    description: "Designs connected medical devices, diagnostic biosensors, and digital hospital technologies to enhance patient care and clinical accuracy.",
    overview: "Precision Medicine Technologists build the next generation of patient care tools. You integrate wearable heart monitors, automated ICU alerts, telemedicine networks, and surgical navigation tools to help doctors save lives with greater precision.",
    future_growth: "Very High",
    education_paths: [
      "Secondary: Biology, Physics, Chemistry, Mathematics, Computer Science",
      "Undergraduate: Bachelor's in Biomedical Engineering, Medical Technology, or Health Informatics",
      "Specialization: Medical Imaging, Biosensor Tech, or Clinical Automation",
    ],
    required_skills: ["Biosensors & Medical Instrumentation", "Clinical Workflow Understanding", "Healthcare Data Privacy (HIPAA)", "Problem Solving", "Compassion & Empathy"],
    recommended_subjects: ["Biology & Physiology", "Physics", "Chemistry", "Computer Science", "Mathematics"],
    learning_roadmap: [
      {
        stage: "Stage 1: Foundation (High School)",
        title: "Human Biology & Medical Technology",
        description: "Study human anatomy, vital signs instrumentation, basic sensors, and hospital volunteer insights.",
        focusAreas: ["Human Physiology", "Sensors & Measurement", "Health & Hygiene Projects", "Science Competitions"],
      },
      {
        stage: "Stage 2: Core Biomedical Engineering",
        title: "Medical Instrumentation & Imaging",
        description: "Learn ECG/EEG biosignal processing, MRI/Ultrasound imaging physics, and clinical safety standards.",
        focusAreas: ["Biosignals & Systems", "Medical Imaging", "Biomaterials", "Clinical Ethics & Compliance"],
      },
      {
        stage: "Stage 3: Advanced Clinical Innovation",
        title: "Connected Health & Tele-Diagnostics",
        description: "Architect remote patient telemetry ecosystems, AI-assisted radiology, and smart surgical tools.",
        focusAreas: ["Smart Medical Devices", "Point-of-Care Diagnostics", "Robotic Surgical Tools", "Hospital IoT"],
      },
    ],
    sample_roles: ["Clinical Systems Engineer", "Medical Device Developer", "Healthcare Technology Consultant", "Biomedical Specialist"],
    related_dimensions: {
      riasec: { I: 0.95, S: 0.85, R: 0.70, C: 0.70, E: 0.30, A: 0.30 },
      skills: { logical_problem_solving: 0.90, self_management: 0.90, communication: 0.85, practical_technical: 0.80 },
      aptitude: { pattern_logic: 0.90, numerical_reasoning: 0.85, verbal_reasoning: 0.85, practical_troubleshooting: 0.80 },
      development: { attention_to_detail: 0.95, persistence: 0.90, collaboration: 0.85, curiosity: 0.90 },
      streams: { science: 0.95, applied_technical: 0.75, humanities: 0.60, commerce: 0.30 },
      archetypes: ["Empathetic Catalyst", "Practical Explorer", "Analytical Systems Thinker"],
    },
    display_order: 12,
  },
];
