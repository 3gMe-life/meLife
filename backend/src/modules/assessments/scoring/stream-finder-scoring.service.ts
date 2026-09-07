import {
  STREAM_FINDER_SECTIONS,
  STREAM_FINDER_CAREER_CLUSTERS,
  STREAM_MAX_POINTS,
  STREAM_ITEM_KEY_MAP,
  StreamCareerClusterData,
} from "../content/stream-finder-catalog.data";
import { RawResponseItem } from "../../scoring/scoring.types";
import { AppError } from "../../../common/errors/app-error";

export type StreamName = "Science" | "Commerce" | "Humanities" | "Applied / Technical";

export type AlignmentBand =
  | "Very Strong Alignment"
  | "Strong Alignment"
  | "Moderate Alignment"
  | "Developing Alignment"
  | "Low Alignment"
  | "Incomplete";

export type RecommendationClarity =
  | "High Clarity"
  | "Moderate Clarity"
  | "Mixed Profile / Further Exploration"
  | "Incomplete";

export interface StreamScoreDetails {
  stream: StreamName;
  traitPoints: number;
  maxTraitPoints: number;
  choicePoints: number;
  maxChoicePoints: number;
  totalRaw: number;
  maxTotal: number;
  compatibilityPercentage: number; // 0.0 to 1.0 (e.g. 0.82 = 82%)
  displayPercentage: number; // 0 to 100 (e.g. 82)
  alignment: AlignmentBand;
}

export interface SectionStreamBreakdown {
  sectionCode: string;
  sectionName: string;
  questionCount: number;
  answeredCount: number;
  scienceScore: number;
  commerceScore: number;
  humanitiesScore: number;
  appliedScore: number;
}

export interface StreamFinderResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "STREAM_FINDER";
  assessmentName: "Stream Finder";
  versionCode: string | null;
  versionName: string | null;
  completedQuestions: number;
  totalQuestions: 80;
  completionPercentage: number;
  isComplete: boolean;

  // Stream scores
  streamScores: Record<StreamName, StreamScoreDetails>;
  sortedStreams: StreamScoreDetails[];

  // Primary & Secondary Alignment
  primaryStream: StreamName;
  primaryScore: number; // e.g. 0.82
  primaryDisplayPercentage: number; // e.g. 82
  primaryAlignment: AlignmentBand;

  secondaryStream: StreamName;
  secondaryScore: number;
  secondaryDisplayPercentage: number;
  secondaryAlignment: AlignmentBand;

  // Score Gap & Clarity
  scoreGap: number; // e.g. 0.11
  scoreGapPercentage: number; // e.g. 11%
  recommendationConfidence: RecommendationClarity;
  clarity: RecommendationClarity;
  isMixedProfile: boolean;

  // Career Clusters & Guidance
  careerCluster: StreamCareerClusterData;
  secondaryCareerCluster?: StreamCareerClusterData;
  mixedProfileCluster?: StreamCareerClusterData;
  careerClusters: StreamCareerClusterData[];
  counsellingSummary: string;

  // Section Breakdown
  sectionBreakdown: SectionStreamBreakdown[];

  // Academic Evidence & Guidance
  academicEvidenceGuidelines: {
    message: string;
    keySubjects: string[];
    decisionFactors: string[];
    counsellorNote: string;
  };
  academicEvidence: Array<{
    subject: string;
    relevance: string;
    thresholdNote: string;
  }>;

  language: string;
  createdAt: string;
}

export class StreamFinderScoringService {
  /**
   * Calculates the complete Stream Finder result based strictly on Excel Scoring Engine methodology.
   */
  computeStreamFinderResult(
    attemptId: string,
    participantId: string,
    rawResponses: RawResponseItem[],
    options?: {
      versionCode?: string | null;
      versionName?: string | null;
      languageCode?: string;
    }
  ): StreamFinderResultDTO {
    const totalQuestions = 80;
    const answeredCount = rawResponses.length;
    const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);
    const isComplete = answeredCount >= totalQuestions;

    if (!isComplete) {
      throw AppError.badRequest(
        `Complete all 80 responses to generate your final Stream Finder result. Currently answered: ${answeredCount}/80.`,
        "INCOMPLETE_ASSESSMENT_RESPONSES"
      );
    }

    // Index responses by question number
    const responsesByQNum: Record<number, { value: number | string; optionKey?: string }> = {};

    for (const r of rawResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      if (!isNaN(qNum)) {
        let val: number | string = r.response_value || "";
        // Parse numeric for Likert Q1-Q60
        if (qNum <= 60) {
          const numVal = parseInt(String(r.response_value || "0"), 10);
          val = isNaN(numVal) ? 0 : Math.min(5, Math.max(1, numVal));
        } else {
          // Forced Choice Q61-Q80 ('A', 'B', 'C', 'D')
          val = String(r.response_value || "").trim().toUpperCase();
        }
        responsesByQNum[qNum] = { value: val };
      }
    }

    // 1. Calculate Likert Trait Points (Q1–Q60)
    let traitSci = 0;
    let traitComm = 0;
    let traitHum = 0;
    let traitApp = 0;

    for (let q = 1; q <= 60; q++) {
      const resp = responsesByQNum[q];
      const val = typeof resp?.value === "number" ? resp.value : 0;
      const targetStream = STREAM_ITEM_KEY_MAP[q];

      if (targetStream === "Science") traitSci += val;
      else if (targetStream === "Commerce") traitComm += val;
      else if (targetStream === "Humanities") traitHum += val;
      else if (targetStream === "Applied / Technical") traitApp += val;
    }

    // 2. Calculate Forced Choice Points (Q61–Q80)
    let choiceCountSci = 0;
    let choiceCountComm = 0;
    let choiceCountHum = 0;
    let choiceCountApp = 0;

    for (let q = 61; q <= 80; q++) {
      const resp = responsesByQNum[q];
      const choice = String(resp?.value || "").toUpperCase();

      if (choice === "A") choiceCountSci++;
      else if (choice === "B") choiceCountComm++;
      else if (choice === "C") choiceCountHum++;
      else if (choice === "D") choiceCountApp++;
    }

    const choicePointsSci = choiceCountSci * 3;
    const choicePointsComm = choiceCountComm * 3;
    const choicePointsHum = choiceCountHum * 3;
    const choicePointsApp = choiceCountApp * 3;

    // 3. Total Raw Scores
    const rawSci = traitSci + choicePointsSci;
    const rawComm = traitComm + choicePointsComm;
    const rawHum = traitHum + choicePointsHum;
    const rawApp = traitApp + choicePointsApp;

    // 4. Compatibility Percentages
    const compSci = rawSci / STREAM_MAX_POINTS.Science;
    const compComm = rawComm / STREAM_MAX_POINTS.Commerce;
    const compHum = rawHum / STREAM_MAX_POINTS.Humanities;
    const compApp = rawApp / STREAM_MAX_POINTS["Applied / Technical"];

    // Alignment Band Helper
    const getAlignment = (score: number): AlignmentBand => {
      if (score >= 0.8) return "Very Strong Alignment";
      if (score >= 0.7) return "Strong Alignment";
      if (score >= 0.6) return "Moderate Alignment";
      if (score >= 0.5) return "Developing Alignment";
      return "Low Alignment";
    };

    const streamScores: Record<StreamName, StreamScoreDetails> = {
      Science: {
        stream: "Science",
        traitPoints: traitSci,
        maxTraitPoints: 85,
        choicePoints: choicePointsSci,
        maxChoicePoints: 60,
        totalRaw: rawSci,
        maxTotal: STREAM_MAX_POINTS.Science,
        compatibilityPercentage: compSci,
        displayPercentage: Math.round(compSci * 100),
        alignment: getAlignment(compSci),
      },
      Commerce: {
        stream: "Commerce",
        traitPoints: traitComm,
        maxTraitPoints: 75,
        choicePoints: choicePointsComm,
        maxChoicePoints: 60,
        totalRaw: rawComm,
        maxTotal: STREAM_MAX_POINTS.Commerce,
        compatibilityPercentage: compComm,
        displayPercentage: Math.round(compComm * 100),
        alignment: getAlignment(compComm),
      },
      Humanities: {
        stream: "Humanities",
        traitPoints: traitHum,
        maxTraitPoints: 80,
        choicePoints: choicePointsHum,
        maxChoicePoints: 60,
        totalRaw: rawHum,
        maxTotal: STREAM_MAX_POINTS.Humanities,
        compatibilityPercentage: compHum,
        displayPercentage: Math.round(compHum * 100),
        alignment: getAlignment(compHum),
      },
      "Applied / Technical": {
        stream: "Applied / Technical",
        traitPoints: traitApp,
        maxTraitPoints: 60,
        choicePoints: choicePointsApp,
        maxChoicePoints: 60,
        totalRaw: rawApp,
        maxTotal: STREAM_MAX_POINTS["Applied / Technical"],
        compatibilityPercentage: compApp,
        displayPercentage: Math.round(compApp * 100),
        alignment: getAlignment(compApp),
      },
    };

    // Sort streams descending by compatibility percentage
    const sortedStreams = Object.values(streamScores).sort(
      (a, b) => b.compatibilityPercentage - a.compatibilityPercentage
    );

    const primary = sortedStreams[0];
    const secondary = sortedStreams[1];

    const scoreGap = primary.compatibilityPercentage - secondary.compatibilityPercentage;
    const scoreGapPercentage = Math.round(scoreGap * 100);

    let recommendationConfidence: RecommendationClarity = "Mixed Profile / Further Exploration";
    let isMixedProfile = true;

    if (scoreGap >= 0.15) {
      recommendationConfidence = "High Clarity";
      isMixedProfile = false;
    } else if (scoreGap >= 0.08) {
      recommendationConfidence = "Moderate Clarity";
      isMixedProfile = false;
    }

    // 5. Match Career Clusters
    const primaryCluster =
      STREAM_FINDER_CAREER_CLUSTERS.find((c) => c.profileKey === primary.stream) ||
      STREAM_FINDER_CAREER_CLUSTERS[0];

    const secondaryCluster = STREAM_FINDER_CAREER_CLUSTERS.find(
      (c) => c.profileKey === secondary.stream
    );

    // Combination cluster for close scores or exploration
    const comboKey1 = `${primary.stream} + ${secondary.stream}`;
    const comboKey2 = `${secondary.stream} + ${primary.stream}`;

    // Normalize Applied stream key for matching
    const matchCombo = (key: string) => {
      const normalized = key.replace("Applied / Technical", "Applied");
      return STREAM_FINDER_CAREER_CLUSTERS.find(
        (c) =>
          c.profileKey === key ||
          c.profileKey === normalized ||
          c.profileKey.replace("Applied / Technical", "Applied") === normalized
      );
    };

    const mixedProfileCluster = matchCombo(comboKey1) || matchCombo(comboKey2);

    // 6. Section Breakdowns
    const sectionBreakdown: SectionStreamBreakdown[] = STREAM_FINDER_SECTIONS.map((sec) => {
      const [start, end] = sec.questionRange;
      let qCount = end - start + 1;
      let ansCount = 0;
      let sSci = 0;
      let sComm = 0;
      let sHum = 0;
      let sApp = 0;

      for (let q = start; q <= end; q++) {
        const resp = responsesByQNum[q];
        if (resp !== undefined && resp !== null) {
          ansCount++;
          if (q <= 60) {
            const val = typeof resp.value === "number" ? resp.value : 0;
            const targetStream = STREAM_ITEM_KEY_MAP[q];
            if (targetStream === "Science") sSci += val;
            else if (targetStream === "Commerce") sComm += val;
            else if (targetStream === "Humanities") sHum += val;
            else if (targetStream === "Applied / Technical") sApp += val;
          } else {
            const ch = String(resp.value).toUpperCase();
            if (ch === "A") sSci += 3;
            else if (ch === "B") sComm += 3;
            else if (ch === "C") sHum += 3;
            else if (ch === "D") sApp += 3;
          }
        }
      }

      return {
        sectionCode: sec.code,
        sectionName: sec.name,
        questionCount: qCount,
        answeredCount: ansCount,
        scienceScore: sSci,
        commerceScore: sComm,
        humanitiesScore: sHum,
        appliedScore: sApp,
      };
    });

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "STREAM_FINDER",
      assessmentName: "Stream Finder",
      versionCode: options?.versionCode || "STREAM_FINDER_V1",
      versionName: options?.versionName || "Stream Finder Secondary Edition (Class 9-10)",
      completedQuestions: answeredCount,
      totalQuestions: 80,
      completionPercentage,
      isComplete: true,

      streamScores,
      sortedStreams,

      primaryStream: primary.stream,
      primaryScore: primary.compatibilityPercentage,
      primaryDisplayPercentage: primary.displayPercentage,
      primaryAlignment: primary.alignment,

      secondaryStream: secondary.stream,
      secondaryScore: secondary.compatibilityPercentage,
      secondaryDisplayPercentage: secondary.displayPercentage,
      secondaryAlignment: secondary.alignment,

      scoreGap,
      scoreGapPercentage,
      recommendationConfidence,
      clarity: recommendationConfidence,
      isMixedProfile,

      careerCluster: primaryCluster,
      secondaryCareerCluster: secondaryCluster,
      mixedProfileCluster,
      careerClusters: [
        primaryCluster,
        ...(secondaryCluster ? [secondaryCluster] : []),
        ...(mixedProfileCluster ? [mixedProfileCluster] : []),
      ],
      counsellingSummary:
        primaryCluster.counsellingNote ||
        `Strongest alignment with ${primary.stream} (${primary.displayPercentage}%). ${
          scoreGapPercentage >= 15
            ? "Clear primary path with high recommendation clarity."
            : `Close secondary alignment with ${secondary.stream} (${secondary.displayPercentage}%).`
        }`,

      sectionBreakdown,

      academicEvidenceGuidelines: {
        message:
          "Stream selection must combine Stream Finder psychometric evidence with subject-wise academic performance, prerequisite eligibility, student voice, and counsellor guidance. No single score should determine stream selection alone.",
        keySubjects: [
          "Mathematics & Analytical Reasoning",
          "Natural & Physical Sciences",
          "Language, English & Literature",
          "Social Sciences, History & Civics",
        ],
        decisionFactors: [
          "1. Psychometric Stream Alignment (Interests, Problem-Solving, Learning Style)",
          "2. Class 9/10 Academic Performance & Subject-Wise Marks",
          "3. Higher Secondary Subject Prerequisites & Board Criteria",
          "4. Student Occupational Aspiration & Intrinsic Motivation",
          "5. Professional Career Counsellor Review & Parental Guidance",
        ],
        counsellorNote:
          primaryCluster.counsellingNote ||
          "Discuss primary and secondary stream alignments together with academic evidence.",
      },
      academicEvidence: [
        {
          subject: "Mathematics & Numerical Reasoning",
          relevance: "Essential foundation for Pure Science (PCM), Computer Science, Economics, CA/Finance, and Engineering streams.",
          thresholdNote: "Recommended ≥ 70% in Class 10 Board examinations for rigorous quantitative specializations.",
        },
        {
          subject: "Natural & Physical Sciences",
          relevance: "Required for Medical (PCB), Engineering (PCM), Biotechnology, Architecture, and Pure Research tracks.",
          thresholdNote: "Strong conceptual understanding in Physics and Chemistry required for competitive senior secondary curricula.",
        },
        {
          subject: "Social Sciences & Humanities",
          relevance: "Directly aligns with Law, Civil Services, Journalism, Psychology, International Relations, and Policy Design.",
          thresholdNote: "Analytical writing and historical context analysis skills are key indicators of success.",
        },
        {
          subject: "Applied, Computational & Vocational Skills",
          relevance: "Pivotal for Modern IT, Design & Media Tech, Electronics, Applied Arts, and Vocational Diplomas.",
          thresholdNote: "Hands-on project work, digital tool aptitude, and applied design thinking provide major advantage.",
        },
      ],

      language: options?.languageCode || "en",
      createdAt: new Date().toISOString(),
    };
  }
}

export const streamFinderScoringService = new StreamFinderScoringService();
