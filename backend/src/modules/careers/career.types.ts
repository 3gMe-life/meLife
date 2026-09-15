/**
 * 3G MeLife Global Career Pathways & Taxonomy Contracts
 */

export type FutureGrowthOutlook = "Very High" | "High" | "Moderate" | "Emerging";
export type CareerTier = "PRIMARY" | "SECONDARY" | "EXPLORE_FURTHER" | "DEVELOPING";
export type SkillCategory = "TECHNICAL" | "ANALYTICAL" | "COMMUNICATION" | "CREATIVE" | "LEADERSHIP" | "RESEARCH" | "CLINICAL";

export interface LearningMilestone {
  stage: string; // e.g. "Stage 1: Foundation (High School)", "Stage 2: Degree / Undergraduate", "Stage 3: Advanced Specialization"
  title: string;
  description: string;
  focusAreas: string[];
}

export interface CareerDomainEntity {
  id: string;
  code: string; // e.g. "TECH_COMPUTING"
  name: string;
  description: string;
  display_order: number;
  icon_name?: string;
  created_at?: string;
}

export interface CareerFamilyEntity {
  id: string;
  domain_id?: string;
  domain_code?: string;
  code: string; // e.g. "SOFTWARE_SYSTEMS"
  name: string;
  description: string;
  display_order: number;
  created_at?: string;
}

export interface CareerClusterEntity {
  id: string;
  family_id?: string;
  family_code?: string;
  code: string; // e.g. "AI_DATA_ARCHITECTURE"
  name: string;
  description: string;
  display_order: number;
  created_at?: string;
}

export interface SkillTaxonomyItem {
  id: string;
  code: string; // e.g. "SKILL_PYTHON_DATA"
  name: string;
  category: SkillCategory;
  description?: string;
}

export interface CareerRelatedDimensions {
  riasec?: Record<string, number>; // e.g. { I: 0.9, R: 0.8, C: 0.6, A: 0.4, E: 0.3, S: 0.2 }
  skills?: Record<string, number>; // e.g. { logical_problem_solving: 0.9, visual_spatial: 0.8, ... }
  aptitude?: Record<string, number>; // e.g. { pattern_logic: 0.9, numerical_reasoning: 0.85, ... }
  development?: Record<string, number>; // e.g. { curiosity: 0.9, persistence: 0.85, ... }
  streams?: Record<string, number>; // e.g. { science_pcm: 0.95, science_pcb: 0.85, commerce: 0.4, humanities: 0.3 }
  archetypes?: string[]; // e.g. ["Analytical Systems Thinker", "Practical Explorer"]
  careerFamilies?: Record<string, number>; // Right Career Finder: TECH_COMPUTING_AI, BUSINESS_FINANCE_ENTERPRISE, HEALTHCARE_LIFE_SCIENCES, etc.
  constructDimensions?: Record<string, number>; // DIM_TECH_DIGITAL, DIM_BUSINESS_ENTERPRISE, DIM_FINANCE_ANALYTICS, etc.
  engineeringBranches?: Record<string, number>; // CSE_AI, ECE_EMBEDDED, MECH_AUTO, CIVIL_ENV, BIO_CHEM
  commerceDomains?: Record<string, number>; // FINANCE_BANKING, MGMT_ENTERPRISE, ACCT_TAX, ECON_ANALYTICS
  humanitiesDomains?: Record<string, number>; // HB, LAW, MEDIA, EDU
  specialized_dimensions?: Record<string, number>;
}

export interface CareerEntity {
  id: string;
  career_code?: string;
  slug: string;
  title: string;
  short_title?: string;
  category: string; // Legacy and visual grouping
  industry: string;
  domain_id?: string | null;
  domain_code?: string;
  domain_name?: string;
  family_id?: string | null;
  family_code?: string;
  family_name?: string;
  cluster_id?: string | null;
  cluster_code?: string;
  cluster_name?: string;
  specialization?: string;
  growth_category?: string;
  education_level?: string;
  description: string;
  overview: string;
  future_growth: FutureGrowthOutlook;
  education_paths: string[];
  required_skills: string[];
  core_skills?: string[];
  supporting_skills?: string[];
  knowledge_areas?: string[];
  work_activities?: string[];
  interest_areas?: string[];
  work_styles?: string[];
  academic_subjects?: string[];
  recommended_subjects: string[];
  recommended_streams?: string[];
  recommended_degrees?: string[];
  typical_qualifications?: string[];
  career_entry_path?: string[];
  related_occupations?: string[];
  work_environment?: string[];
  technology_areas?: string[];
  career_tags?: string[];
  is_emerging?: boolean;
  version?: string;
  learning_roadmap: LearningMilestone[];
  sample_roles: string[];
  related_dimensions: CareerRelatedDimensions;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CareerMatchDriver {
  constructCode?: string;
  constructName?: string;
  dimensionCode?: string;
  dimensionName?: string;
  normalizedScore?: number;
  weight?: number;
  contributionWeight?: number;
  studentLevel?: string;
  rationale?: string;
}

export interface CareerMatchReasoning {
  summary: string;
  topMatchingFactors: string[];
  alignmentNote: string;
  driverConstructs?: CareerMatchDriver[];
  evidenceSource?: string;
}

export interface MatchPillarBreakdown {
  interestScore: number;
  skillScore: number;
  aptitudeScore: number;
  personalityScore: number;
  streamScore?: number;
  domainScore?: number;
  careerFamilyScore?: number;
}

export interface CareerDomainSummary {
  domainCode: string;
  domainName: string;
  matchCount: number;
  topMatchPercentage: number;
  iconName?: string;
}

export interface CareerMatchDTO {
  id: string;
  careerCode?: string;
  slug: string;
  title: string;
  shortTitle?: string;
  category: string;
  industry: string;
  domainCode?: string;
  domainName?: string;
  familyCode?: string;
  familyName?: string;
  clusterCode?: string;
  clusterName?: string;
  specialization?: string;
  description: string;
  futureGrowth: FutureGrowthOutlook;
  growthCategory?: string;
  educationLevel?: string;
  matchPercentage: number;
  tier: CareerTier;
  keySkills: string[];
  coreSkills?: string[];
  supportingSkills?: string[];
  reasoning: CareerMatchReasoning;
  driverConstructs?: CareerMatchDriver[];
  strengthAlignment?: string[];
  developmentAreas?: string[];
  matchBreakdown?: MatchPillarBreakdown;
  confidence?: "High Confidence" | "Moderate Confidence" | "Baseline Confidence" | "Exploratory";
  assessmentCoverage?: string;
  isEmerging?: boolean;
}

export interface CareerDetailDTO extends CareerMatchDTO {
  overview: string;
  educationPaths: string[];
  requiredSkills: string[];
  recommendedSubjects: string[];
  academicSubjects?: string[];
  recommendedStreams?: string[];
  recommendedDegrees?: string[];
  typicalQualifications?: string[];
  careerEntryPath?: string[];
  workActivities?: string[];
  knowledgeAreas?: string[];
  workEnvironment?: string[];
  technologyAreas?: string[];
  learningRoadmap: LearningMilestone[];
  sampleRoles: string[];
  relatedOccupations?: string[];
  relatedCareers: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    specialization?: string;
    matchPercentage: number;
  }>;
}

export interface CareerTranslationEntity {
  id: string;
  career_id: string;
  language_code: string;
  title: string;
  category: string;
  industry: string;
  specialization?: string;
  description: string;
  overview: string;
  education_paths: string[];
  required_skills: string[];
  recommended_subjects: string[];
  learning_roadmap: LearningMilestone[];
  sample_roles: string[];
  created_at: string;
}
