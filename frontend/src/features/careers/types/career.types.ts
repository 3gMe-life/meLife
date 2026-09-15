/**
 * 3G MeLife Career Pathways & Global Occupational Taxonomy Frontend Types
 */

export type FutureGrowthOutlook = "Very High" | "High" | "Moderate" | "Emerging";

export type CareerTier = "PRIMARY" | "SECONDARY" | "EXPLORE_FURTHER" | "DEVELOPING";

export interface LearningMilestone {
  stage: string;
  title: string;
  description: string;
  focusAreas: string[];
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
  growthCategory?: string;
  educationLevel?: string;
  description: string;
  futureGrowth: FutureGrowthOutlook;
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

export interface CareerRecommendationsResponse {
  recommendations: CareerMatchDTO[];
  primaryRecommendations?: CareerMatchDTO[];
  secondaryRecommendations?: CareerMatchDTO[];
  exploreFurtherRecommendations?: CareerMatchDTO[];
  domainSummaries?: CareerDomainSummary[];
  totalCount?: number;
  isAssessed: boolean;
  assessmentCode?: string;
  completedAssessments?: string[];
  confidenceLevel?: string;
  assessmentCoverage?: string;
}
