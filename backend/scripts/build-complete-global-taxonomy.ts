import fs from "fs";
import path from "path";

// 12 Domains
const DOMAINS = [
  { code: "TECH_COMPUTING", name: "Technology, Software & Intelligent Systems", description: "Designing, building, and securing intelligent computing software, machine learning architectures, and global digital infrastructure.", display_order: 1, icon_name: "Code" },
  { code: "ENGINEERING_MANUFACTURING", name: "Engineering, Hardware & Infrastructure", description: "Applying physical science, robotics, mathematics, and systems design to construct physical devices, infrastructure, and advanced machinery.", display_order: 2, icon_name: "Cpu" },
  { code: "HEALTHCARE_LIFE_SCIENCES", name: "Medicine, Healthcare & Clinical Sciences", description: "Diagnosing, treating, researching, and advancing human health, clinical therapies, pharmacology, and genomic science.", display_order: 3, icon_name: "Activity" },
  { code: "BUSINESS_MANAGEMENT", name: "Business Management, Strategy & Operations", description: "Leading enterprise operations, organizational growth, product innovation, and strategic international market expansion.", display_order: 4, icon_name: "Briefcase" },
  { code: "FINANCE_ECONOMICS", name: "Finance, Banking & Quantitative Economics", description: "Analyzing financial markets, investment modeling, actuarial risk, fintech architectures, and econometric policy.", display_order: 5, icon_name: "TrendingUp" },
  { code: "LAW_GOVERNANCE", name: "Law, Public Policy, Diplomacy & Justice", description: "Advocating for legal rights, drafting corporate contracts, formulating public policy, and conducting international diplomacy.", display_order: 6, icon_name: "Scale" },
  { code: "DESIGN_CREATIVE_MEDIA", name: "Digital Design, Media & Creative Industries", description: "Creating digital experiences, brand identities, interactive user interfaces, industrial products, and multimedia journalism.", display_order: 7, icon_name: "Palette" },
  { code: "PURE_APPLIED_SCIENCES", name: "Pure Sciences, Mathematics & Advanced Research", description: "Conducting scientific inquiry in physics, molecular chemistry, pure mathematics, space exploration, and earth systems.", display_order: 8, icon_name: "Compass" },
  { code: "EDUCATION_HUMAN_DEV", name: "Education, Psychology & Human Services", description: "Facilitating learning, understanding human behaviour, educational counseling, mental wellbeing, and community development.", display_order: 9, icon_name: "GraduationCap" },
  { code: "ENVIRONMENT_SUSTAINABILITY", name: "Climate Science, CleanTech & Sustainability", description: "Mitigating climate change, developing renewable energy infrastructure, ecological conservation, and ESG environmental planning.", display_order: 10, icon_name: "Leaf" },
  { code: "AVIATION_LOGISTICS", name: "Aviation, Logistics & Built Environment", description: "Piloting commercial aircraft, managing global supply chains, optimizing freight networks, and smart city urban planning.", display_order: 11, icon_name: "Navigation" },
  { code: "EMERGING_FRONTIERS", name: "Emerging Frontiers & Frontier Technology", description: "Pioneering breakthroughs in AI safety alignment, quantum algorithms, neural interfaces, synthetic genomics, and deep space systems.", display_order: 12, icon_name: "Sparkles" },
];

// 36 Families
const FAMILIES = [
  { code: "FAM_AI_DATA_SCIENCE", domain_code: "TECH_COMPUTING", name: "Artificial Intelligence & Data Science", description: "Machine learning algorithms, neural models, predictive data science, and big data systems.", display_order: 1 },
  { code: "FAM_SOFTWARE_CLOUD", domain_code: "TECH_COMPUTING", name: "Software Engineering & Cloud Architecture", description: "Full-stack application engineering, cloud infrastructure, microservices, and distributed platforms.", display_order: 2 },
  { code: "FAM_CYBER_NETWORKS", domain_code: "TECH_COMPUTING", name: "Cybersecurity & Digital Forensics", description: "Threat detection, cryptography, network defense, and ethical hacking.", display_order: 3 },

  { code: "FAM_MECH_AEROSPACE", domain_code: "ENGINEERING_MANUFACTURING", name: "Mechanical, Mechatronics & Aerospace", description: "Robotics, aerospace propulsion, thermal systems, and physical hardware.", display_order: 4 },
  { code: "FAM_ELEC_EMBEDDED", domain_code: "ENGINEERING_MANUFACTURING", name: "Electrical & Embedded Systems", description: "VLSI chip design, microelectronics, power distribution, and IoT devices.", display_order: 5 },
  { code: "FAM_CIVIL_INFRA", domain_code: "ENGINEERING_MANUFACTURING", name: "Civil, Structural & Environmental Engineering", description: "Mega-structures, transportation systems, water resources, and geotechnical engineering.", display_order: 6 },

  { code: "FAM_CLINICAL_MEDICINE", domain_code: "HEALTHCARE_LIFE_SCIENCES", name: "Clinical Medicine & Surgery", description: "Patient diagnosis, medical interventions, surgery, and specialist care.", display_order: 7 },
  { code: "FAM_BIOMED_GENOMICS", domain_code: "HEALTHCARE_LIFE_SCIENCES", name: "Biomedical Science & Precision Genomics", description: "Molecular genetics, pharmacology, biotechnology, and diagnostic pathology.", display_order: 8 },
  { code: "FAM_ALLIED_PUBLIC_HEALTH", domain_code: "HEALTHCARE_LIFE_SCIENCES", name: "Allied Health, Therapy & Public Health", description: "Physiotherapy, epidemiology, clinical nutrition, and health administration.", display_order: 9 },

  { code: "FAM_STRATEGY_CONSULTING", domain_code: "BUSINESS_MANAGEMENT", name: "Enterprise Strategy & Consulting", description: "Management consulting, corporate planning, operations, and organizational design.", display_order: 10 },
  { code: "FAM_PRODUCT_INNOVATION", domain_code: "BUSINESS_MANAGEMENT", name: "Product Management & Entrepreneurship", description: "Tech product roadmaps, venture creation, agile management, and innovation.", display_order: 11 },
  { code: "FAM_MARKETING_COMMERCE", domain_code: "BUSINESS_MANAGEMENT", name: "Global Marketing, Brand & Supply Chain", description: "Digital marketing, logistics, consumer psychology, and international trade.", display_order: 12 },

  { code: "FAM_INVESTMENT_BANKING", domain_code: "FINANCE_ECONOMICS", name: "Investment Banking & Capital Markets", description: "Corporate finance, mergers, securities analysis, and wealth portfolio management.", display_order: 13 },
  { code: "FAM_QUANT_FINTECH", domain_code: "FINANCE_ECONOMICS", name: "Quantitative Analytics & FinTech", description: "Algorithmic trading, financial risk modeling, blockchain assets, and actuarial science.", display_order: 14 },
  { code: "FAM_ACCOUNTING_AUDIT", domain_code: "FINANCE_ECONOMICS", name: "Chartered Accounting, Audit & Tax", description: "Financial reporting, forensic audit, corporate taxation, and regulatory compliance.", display_order: 15 },

  { code: "FAM_CORP_CYBER_LAW", domain_code: "LAW_GOVERNANCE", name: "Corporate, IP & Cyber Law", description: "Intellectual property, technology contracts, cross-border commercial litigation.", display_order: 16 },
  { code: "FAM_PUBLIC_POLICY_DIPLOMACY", domain_code: "LAW_GOVERNANCE", name: "Public Policy, Government & International Affairs", description: "Policy formulation, international diplomacy, regulatory governance, and public administration.", display_order: 17 },
  { code: "FAM_CRIMINAL_JUSTICE", domain_code: "LAW_GOVERNANCE", name: "Judicial Studies, Litigation & Civil Rights", description: "Constitutional litigation, human rights advocacy, judicial magistrate practice.", display_order: 18 },

  { code: "FAM_UX_DIGITAL_DESIGN", domain_code: "DESIGN_CREATIVE_MEDIA", name: "UX/UI & Interactive Product Design", description: "User research, digital product interfaces, information architecture, and design systems.", display_order: 19 },
  { code: "FAM_INDUSTRIAL_SPATIAL", domain_code: "DESIGN_CREATIVE_MEDIA", name: "Industrial Design & Spatial Architecture", description: "Physical hardware ergonomics, 3D architectural modeling, and interior design.", display_order: 20 },
  { code: "FAM_MEDIA_COMMUNICATION", domain_code: "DESIGN_CREATIVE_MEDIA", name: "Digital Journalism, Content & Media Production", description: "Investigative reporting, video production, digital broadcasting, and creative direction.", display_order: 21 },

  { code: "FAM_PHYSICAL_SCIENCES", domain_code: "PURE_APPLIED_SCIENCES", name: "Physics, Astronomy & Quantum Sciences", description: "Astrophysics, quantum mechanics, condensed matter, and materials research.", display_order: 22 },
  { code: "FAM_CHEMICAL_MATERIALS", domain_code: "PURE_APPLIED_SCIENCES", name: "Chemistry & Advanced Nanomaterials", description: "Synthetic chemistry, polymers, nanomaterials, and computational molecular modeling.", display_order: 23 },
  { code: "FAM_MATH_STATISTICS", domain_code: "PURE_APPLIED_SCIENCES", name: "Pure & Applied Mathematics", description: "Topology, numerical simulation, statistical computing, and cryptography research.", display_order: 24 },

  { code: "FAM_PSYCHOLOGY_COUNSELLING", domain_code: "EDUCATION_HUMAN_DEV", name: "Psychology & Behavioral Counseling", description: "Cognitive psychology, clinical counseling, psychometrics, and organizational behavior.", display_order: 25 },
  { code: "FAM_EDUCATION_EDTECH", domain_code: "EDUCATION_HUMAN_DEV", name: "Pedagogy, Curriculum & Educational Technology", description: "Learning design, curriculum development, instructional technology, and academic leadership.", display_order: 26 },
  { code: "FAM_SOCIAL_COMMUNITY", domain_code: "EDUCATION_HUMAN_DEV", name: "Social Work & Community Development", description: "Social impact programs, NGO administration, family support, and community advocacy.", display_order: 27 },

  { code: "FAM_RENEWABLE_CLEANTECH", domain_code: "ENVIRONMENT_SUSTAINABILITY", name: "Renewable Energy & Clean Technology", description: "Solar/wind power systems, battery storage, smart grids, and green hydrogen.", display_order: 28 },
  { code: "FAM_CLIMATE_CONSERVATION", domain_code: "ENVIRONMENT_SUSTAINABILITY", name: "Climate Science, Ecology & Conservation", description: "Ecosystem restoration, wildlife conservation, biodiversity mapping, and carbon auditing.", display_order: 29 },
  { code: "FAM_SUSTAINABLE_AGRITECH", domain_code: "ENVIRONMENT_SUSTAINABILITY", name: "Sustainable Agronomy & Food Technology", description: "Precision agriculture, vertical farming, crop genetics, and food biotechnology.", display_order: 30 },

  { code: "FAM_AVIATION_OPERATIONS", domain_code: "AVIATION_LOGISTICS", name: "Commercial Aviation & Flight Operations", description: "Piloting, avionics maintenance, air traffic control, and airport management.", display_order: 31 },
  { code: "FAM_SUPPLY_CHAIN_LOGISTICS", domain_code: "AVIATION_LOGISTICS", name: "Global Supply Chain & Maritime Logistics", description: "Freight logistics, maritime fleet management, port operations, and predictive distribution.", display_order: 32 },
  { code: "FAM_URBAN_CONSTRUCTION", domain_code: "AVIATION_LOGISTICS", name: "Urban Planning & Construction Project Leadership", description: "Smart city masterplanning, construction engineering, and real estate development.", display_order: 33 },

  { code: "FAM_AI_SAFETY_ALIGNMENT", domain_code: "EMERGING_FRONTIERS", name: "AI Safety, Ethics & Cognitive Interaction", description: "Model alignment, prompt engineering, algorithmic fairness, and human-AI governance.", display_order: 34 },
  { code: "FAM_QUANTUM_COMPUTING", domain_code: "EMERGING_FRONTIERS", name: "Quantum Computing & Neural Systems", description: "Qubit algorithms, quantum cryptography, brain-computer interfaces, and synthetic neurobiology.", display_order: 35 },
  { code: "FAM_SPACE_SYNTH_BIO", domain_code: "EMERGING_FRONTIERS", name: "Space Technology & Synthetic Biology", description: "Satellite engineering, orbital mechanics, genetic synthesis, and bio-manufacturing.", display_order: 36 },
];

// 72 Clusters
const CLUSTERS = [
  { code: "CLUS_ML_NEURAL", family_code: "FAM_AI_DATA_SCIENCE", name: "Machine Learning & Neural Architecture", description: "Deep learning models, computer vision, and NLP frameworks.", display_order: 1 },
  { code: "CLUS_BIG_DATA_ENG", family_code: "FAM_AI_DATA_SCIENCE", name: "Big Data & Predictive Analytics", description: "Distributed data pipelines, lakehouses, and business intelligence modeling.", display_order: 2 },
  { code: "CLUS_FULLSTACK_SOFTWARE", family_code: "FAM_SOFTWARE_CLOUD", name: "Full-Stack & Enterprise Software", description: "Modern web/mobile architectures, API microservices, and backend logic.", display_order: 3 },
  { code: "CLUS_CLOUD_DEVOPS", family_code: "FAM_SOFTWARE_CLOUD", name: "Cloud Infrastructure & Platform Engineering", description: "Kubernetes, automated CI/CD pipelines, serverless, and multi-cloud resilience.", display_order: 4 },
  { code: "CLUS_INFOSEC_DEFENSE", family_code: "FAM_CYBER_NETWORKS", name: "Information Security & Threat Defense", description: "Security operations, penetration testing, and zero-trust architecture.", display_order: 5 },
  { code: "CLUS_DIGITAL_FORENSICS", family_code: "FAM_CYBER_NETWORKS", name: "Digital Forensics & Incident Response", description: "Cyber crime investigation, evidence extraction, and malware reverse engineering.", display_order: 6 },

  { code: "CLUS_ROBOTICS_MECHATRONICS", family_code: "FAM_MECH_AEROSPACE", name: "Robotics & Autonomous Systems", description: "Kinematics, sensors, industrial automation, and robotic arms.", display_order: 7 },
  { code: "CLUS_AERO_PROPULSION", family_code: "FAM_MECH_AEROSPACE", name: "Aerospace Systems & Flight Dynamics", description: "Aerodynamics, rocket propulsion, satellite structures, and aircraft design.", display_order: 8 },
  { code: "CLUS_VLSI_SEMICONDUCTOR", family_code: "FAM_ELEC_EMBEDDED", name: "VLSI Design & Semiconductor Engineering", description: "Microchip layout, ASIC design, FPGA verification, and nanoelectronics.", display_order: 9 },
  { code: "CLUS_IOT_EMBEDDED", family_code: "FAM_ELEC_EMBEDDED", name: "Embedded Systems & Smart Hardware", description: "Microcontrollers, RTOS firmware, wireless sensor networks, and connected devices.", display_order: 10 },
  { code: "CLUS_STRUCTURAL_INFRA", family_code: "FAM_CIVIL_INFRA", name: "Structural & Bridge Engineering", description: "High-rise frameworks, seismic design, and advanced construction materials.", display_order: 11 },
  { code: "CLUS_GEO_TRANSPORT_ENG", family_code: "FAM_CIVIL_INFRA", name: "Transportation & Geotechnical Engineering", description: "Highway networks, tunnel mechanics, foundation engineering, and mass transit.", display_order: 12 },

  { code: "CLUS_INTERNAL_SURGICAL", family_code: "FAM_CLINICAL_MEDICINE", name: "Internal Medicine & Surgical Specialties", description: "Hospital medicine, cardiology, neurology, and precision surgical care.", display_order: 13 },
  { code: "CLUS_PEDIATRICS_FAMILY", family_code: "FAM_CLINICAL_MEDICINE", name: "Primary Care, Pediatrics & Emergency", description: "Family medicine, pediatric wellness, urgent care, and trauma management.", display_order: 14 },
  { code: "CLUS_GENOMICS_BIOINFO", family_code: "FAM_BIOMED_GENOMICS", name: "Precision Genomics & Bioinformatics", description: "DNA sequencing, CRISPR editing, computational biology, and targeted therapies.", display_order: 15 },
  { code: "CLUS_PHARMA_DRUG_DISCOVERY", family_code: "FAM_BIOMED_GENOMICS", name: "Pharmacology & Molecular Drug Discovery", description: "Therapeutic synthesis, clinical trials, toxicology, and pharmaceutical formulation.", display_order: 16 },
  { code: "CLUS_PHYSIO_REHAB", family_code: "FAM_ALLIED_PUBLIC_HEALTH", name: "Physiotherapy & Sports Rehabilitation", description: "Musculoskeletal therapy, sports biomechanics, and post-operative recovery.", display_order: 17 },
  { code: "CLUS_EPIDEMIOLOGY_PUBLIC", family_code: "FAM_ALLIED_PUBLIC_HEALTH", name: "Public Health & Epidemiology", description: "Disease surveillance, community health programs, and global health policy.", display_order: 18 },

  { code: "CLUS_MGMT_CONSULTING", family_code: "FAM_STRATEGY_CONSULTING", name: "Strategic Management Consulting", description: "Corporate restructuring, operational efficiency, and board advisory.", display_order: 19 },
  { code: "CLUS_OPS_EXCELLENCE", family_code: "FAM_STRATEGY_CONSULTING", name: "Operations Research & Business Analytics", description: "Workflow optimization, cost modeling, and organizational productivity.", display_order: 20 },
  { code: "CLUS_TECH_PRODUCT_MGMT", family_code: "FAM_PRODUCT_INNOVATION", name: "Digital Product Management", description: "User journey roadmaps, cross-functional engineering leadership, and product discovery.", display_order: 21 },
  { code: "CLUS_VENTURE_CREATION", family_code: "FAM_PRODUCT_INNOVATION", name: "Entrepreneurship & Venture Building", description: "Startup incubation, business model design, fundraising, and scale-up execution.", display_order: 22 },
  { code: "CLUS_BRAND_GROWTH_MKT", family_code: "FAM_MARKETING_COMMERCE", name: "Brand Strategy & Growth Marketing", description: "Customer acquisition, digital advertising, brand positioning, and analytics.", display_order: 23 },
  { code: "CLUS_GLOBAL_TRADE_LOGISTICS", family_code: "FAM_MARKETING_COMMERCE", name: "International Trade & Commercial Distribution", description: "Import/export strategy, channel distribution, and global trade compliance.", display_order: 24 },

  { code: "CLUS_CORP_FIN_IB", family_code: "FAM_INVESTMENT_BANKING", name: "Corporate Finance & M&A Advisory", description: "Valuation, capital raising, IPO underwriting, and deal structuring.", display_order: 25 },
  { code: "CLUS_WEALTH_ASSET_MGMT", family_code: "FAM_INVESTMENT_BANKING", name: "Asset Management & Equity Research", description: "Portfolio construction, mutual funds, equity valuation, and fiduciary management.", display_order: 26 },
  { code: "CLUS_QUANT_RISK_MODELING", family_code: "FAM_QUANT_FINTECH", name: "Quantitative Risk & Financial Modeling", description: "Stochastic modeling, derivatives pricing, credit risk, and stress testing.", display_order: 27 },
  { code: "CLUS_FINTECH_ALGO_TRADING", family_code: "FAM_QUANT_FINTECH", name: "FinTech Innovation & Algorithmic Trading", description: "High-frequency systems, payment gateways, decentralized finance, and robo-advisory.", display_order: 28 },
  { code: "CLUS_CHARTERED_ACCOUNTING", family_code: "FAM_ACCOUNTING_AUDIT", name: "Chartered Accounting & Financial Reporting", description: "GAAP/IFRS financial statements, managerial accounting, and statutory assurance.", display_order: 29 },
  { code: "CLUS_FORENSIC_TAX_AUDIT", family_code: "FAM_ACCOUNTING_AUDIT", name: "Forensic Audit & Corporate Taxation", description: "Fraud investigation, international transfer pricing, and tax optimization.", display_order: 30 },

  { code: "CLUS_CORP_CONTRACT_LAW", family_code: "FAM_CORP_CYBER_LAW", name: "Corporate Law & Commercial Transactions", description: "Contract negotiation, corporate governance, cross-border M&A law, and antitrust.", display_order: 31 },
  { code: "CLUS_CYBER_IP_LAW", family_code: "FAM_CORP_CYBER_LAW", name: "Cyber Law & Intellectual Property", description: "Patent prosecution, trademark defense, digital privacy regulations, and tech licensing.", display_order: 32 },
  { code: "CLUS_POLICY_ANALYSIS", family_code: "FAM_PUBLIC_POLICY_DIPLOMACY", name: "Public Policy Formulation & Analysis", description: "Legislative drafting, economic impact analysis, and government relations.", display_order: 33 },
  { code: "CLUS_INTL_DIPLOMACY", family_code: "FAM_PUBLIC_POLICY_DIPLOMACY", name: "Diplomacy & International Relations", description: "Foreign ministry relations, multilateral treaties, and global conflict resolution.", display_order: 34 },
  { code: "CLUS_CRIMINAL_LITIGATION", family_code: "FAM_CRIMINAL_JUSTICE", name: "Criminal Defense & Trial Litigation", description: "Courtroom trial advocacy, evidence presentation, and criminal law jurisprudence.", display_order: 35 },
  { code: "CLUS_HUMAN_RIGHTS_JUSTICE", family_code: "FAM_CRIMINAL_JUSTICE", name: "Human Rights & Constitutional Law", description: "Public interest litigation, civil liberties defense, and social justice reform.", display_order: 36 },

  { code: "CLUS_UX_RESEARCH_DESIGN", family_code: "FAM_UX_DIGITAL_DESIGN", name: "UX Research & Interaction Design", description: "Qualitative user interviews, wireframing, usability testing, and UX copywriting.", display_order: 37 },
  { code: "CLUS_UI_DESIGN_SYSTEMS", family_code: "FAM_UX_DIGITAL_DESIGN", name: "UI Design & Design Systems Engineering", description: "Visual aesthetics, typography, Figma token architecture, and micro-interactions.", display_order: 38 },
  { code: "CLUS_INDUSTRIAL_PRODUCT_DESIGN", family_code: "FAM_INDUSTRIAL_SPATIAL", name: "Industrial & Consumer Hardware Design", description: "Physical product aesthetics, CAD surfacing, prototyping, and manufacturing ergonomics.", display_order: 39 },
  { code: "CLUS_ARCHITECTURAL_DESIGN", family_code: "FAM_INDUSTRIAL_SPATIAL", name: "Architectural & Interior Spatial Design", description: "Building blueprints, sustainable spatial layouts, 3D rendering, and building codes.", display_order: 40 },
  { code: "CLUS_INVESTIGATIVE_JOURNALISM", family_code: "FAM_MEDIA_COMMUNICATION", name: "Investigative Journalism & Digital Media", description: "Data journalism, investigative reporting, digital news broadcasting, and feature writing.", display_order: 41 },
  { code: "CLUS_ANIMATION_VFX_PRODUCTION", family_code: "FAM_MEDIA_COMMUNICATION", name: "3D Animation, VFX & Creative Production", description: "Motion graphics, CGI visual effects, game art direction, and video editing.", display_order: 42 },

  { code: "CLUS_THEORETICAL_PHYSICS", family_code: "FAM_PHYSICAL_SCIENCES", name: "Theoretical & Experimental Physics", description: "Quantum mechanics, particle physics, laser optics, and thermodynamics.", display_order: 43 },
  { code: "CLUS_ASTROPHYSICS_SPACE", family_code: "FAM_PHYSICAL_SCIENCES", name: "Astrophysics & Planetary Science", description: "Telescope data analysis, cosmology, planetary atmospheres, and orbital mechanics.", display_order: 44 },
  { code: "CLUS_SYNTHETIC_CHEMISTRY", family_code: "FAM_CHEMICAL_MATERIALS", name: "Synthetic & Organic Chemistry", description: "Molecule design, catalytic reactions, polymer synthesis, and spectroscopy.", display_order: 45 },
  { code: "CLUS_NANOTECH_MATERIALS", family_code: "FAM_CHEMICAL_MATERIALS", name: "Nanotechnology & Materials Science", description: "Graphene structures, smart polymers, metamaterials, and semiconductor materials.", display_order: 46 },
  { code: "CLUS_PURE_APPLIED_MATH", family_code: "FAM_MATH_STATISTICS", name: "Applied Mathematics & Mathematical Modeling", description: "Differential equations, computational mathematics, and optimization algorithms.", display_order: 47 },
  { code: "CLUS_BIOSTATISTICS_DATA", family_code: "FAM_MATH_STATISTICS", name: "Biostatistics & Statistical Research", description: "Clinical trial statistics, epidemiological models, and Bayesian inference.", display_order: 48 },

  { code: "CLUS_CLINICAL_PSYCHOLOGY", family_code: "FAM_PSYCHOLOGY_COUNSELLING", name: "Clinical & Cognitive Psychology", description: "Psychological assessment, psychotherapy, cognitive testing, and neuro-rehabilitation.", display_order: 49 },
  { code: "CLUS_CAREER_EDUCATIONAL_COUNSEL", family_code: "FAM_PSYCHOLOGY_COUNSELLING", name: "Educational & Career Counseling", description: "Vocational guidance, student mental health, learning disability diagnosis, and psychometrics.", display_order: 50 },
  { code: "CLUS_CURRICULUM_PEDAGOGY", family_code: "FAM_EDUCATION_EDTECH", name: "Curriculum Architecture & Pedagogy", description: "K-12 & higher-ed syllabus design, assessment frameworks, and teaching methodologies.", display_order: 51 },
  { code: "CLUS_EDTECH_LEARNING_DESIGN", family_code: "FAM_EDUCATION_EDTECH", name: "EdTech Innovation & Instructional Design", description: "Gamified learning platforms, digital course authoring, and LMS analytics.", display_order: 52 },
  { code: "CLUS_COMMUNITY_SOCIAL_WORK", family_code: "FAM_SOCIAL_COMMUNITY", name: "Social Work & Community Welfare", description: "Family welfare programs, rehabilitation case management, and crisis intervention.", display_order: 53 },
  { code: "CLUS_NGO_IMPACT_LEADERSHIP", family_code: "FAM_SOCIAL_COMMUNITY", name: "NGO Leadership & Social Impact", description: "Non-profit strategy, grant writing, global humanitarian aid, and social enterprise.", display_order: 54 },

  { code: "CLUS_SOLAR_WIND_ENERGY", family_code: "FAM_RENEWABLE_CLEANTECH", name: "Solar, Wind & Clean Power Systems", description: "Photovoltaic farm design, wind turbine engineering, and grid storage integration.", display_order: 55 },
  { code: "CLUS_ENERGY_STORAGE_EV", family_code: "FAM_RENEWABLE_CLEANTECH", name: "Energy Storage & Electric Mobility", description: "Lithium battery chemistry, EV powertrain design, and charging infrastructure.", display_order: 56 },
  { code: "CLUS_ECOLOGY_BIODIVERSITY", family_code: "FAM_CLIMATE_CONSERVATION", name: "Ecological Conservation & Marine Biology", description: "Ocean conservation, habitat preservation, forest ecology, and endangered species tracking.", display_order: 57 },
  { code: "CLUS_CARBON_ESG_MGMT", family_code: "FAM_CLIMATE_CONSERVATION", name: "Carbon Accounting & Corporate ESG Strategy", description: "Greenhouse gas audits, corporate sustainability reporting, and carbon credit trading.", display_order: 58 },
  { code: "CLUS_PRECISION_AGRITECH", family_code: "FAM_SUSTAINABLE_AGRITECH", name: "Precision Agronomy & Smart Agriculture", description: "IoT soil sensors, drone crop imaging, hydroponics, and automated irrigation.", display_order: 59 },
  { code: "CLUS_FOOD_BIOTECHNOLOGY", family_code: "FAM_SUSTAINABLE_AGRITECH", name: "Food Science & Sustainable Nutrition", description: "Alternative proteins, food safety analysis, nutritional enhancement, and food packaging.", display_order: 60 },

  { code: "CLUS_COMMERCIAL_PILOT_FLIGHT", family_code: "FAM_AVIATION_OPERATIONS", name: "Commercial Aviation & Flight Crew", description: "Airline pilot navigation, cockpit flight management, and flight safety procedures.", display_order: 61 },
  { code: "CLUS_AIR_TRAFFIC_AVIONICS", family_code: "FAM_AVIATION_OPERATIONS", name: "Air Traffic Management & Avionics Maintenance", description: "Radar air traffic control, avionics diagnostics, and airport runway operations.", display_order: 62 },
  { code: "CLUS_SUPPLY_CHAIN_OPTIMIZATION", family_code: "FAM_SUPPLY_CHAIN_LOGISTICS", name: "Supply Chain Strategy & Fleet Logistics", description: "Warehouse automation, freight forwarding, customs brokerage, and logistics optimization.", display_order: 63 },
  { code: "CLUS_MARITIME_PORT_MGMT", family_code: "FAM_SUPPLY_CHAIN_LOGISTICS", name: "Maritime Fleet Operations & Port Logistics", description: "Container vessel navigation, port terminal management, and marine shipping logistics.", display_order: 64 },
  { code: "CLUS_SMART_URBAN_PLANNING", family_code: "FAM_URBAN_CONSTRUCTION", name: "Smart Urban Planning & City Design", description: "Zoning regulations, public transit integration, green building standards, and urban GIS.", display_order: 65 },
  { code: "CLUS_CONSTRUCTION_PROJECT_MGMT", family_code: "FAM_URBAN_CONSTRUCTION", name: "Construction Project Management", description: "Site construction engineering, subcontractor scheduling, building safety, and BIM.", display_order: 66 },

  { code: "CLUS_AI_ALIGNMENT_SAFETY", family_code: "FAM_AI_SAFETY_ALIGNMENT", name: "AI Alignment & Safety Governance", description: "Frontier model safety testing, red-teaming, interpretability, and AI policy.", display_order: 67 },
  { code: "CLUS_COGNITIVE_PROMPT_ENG", family_code: "FAM_AI_SAFETY_ALIGNMENT", name: "Cognitive Prompt & Human-AI Systems", description: "Complex system prompt architectures, reasoning chains, and AI evaluation benchmarks.", display_order: 68 },
  { code: "CLUS_QUANTUM_ALGORITHMS", family_code: "FAM_QUANTUM_COMPUTING", name: "Quantum Computing & Quantum Software", description: "Qiskit/Cirq quantum algorithms, quantum error correction, and quantum chemistry simulations.", display_order: 69 },
  { code: "CLUS_NEURAL_INTERFACES", family_code: "FAM_QUANTUM_COMPUTING", name: "Neural Interfaces & Neurotechnology", description: "EEG signal processing, brain-computer interfaces, and neural prosthetic engineering.", display_order: 70 },
  { code: "CLUS_SYNTHETIC_BIOLOGY_ENG", family_code: "FAM_SPACE_SYNTH_BIO", name: "Synthetic Biology & Genetic Engineering", description: "De novo DNA assembly, bio-foundry automation, and engineered cellular therapeutics.", display_order: 71 },
  { code: "CLUS_SPACE_SYSTEMS_EXPLORE", family_code: "FAM_SPACE_SYNTH_BIO", name: "Space Systems & Deep Space Tech", description: "Cubesat constellations, lunar rover systems, space debris tracking, and deep space telemetry.", display_order: 72 },
];

console.log("Building comprehensive 108 occupational dataset...");
