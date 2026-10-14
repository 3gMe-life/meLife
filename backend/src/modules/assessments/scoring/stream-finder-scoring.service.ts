import {
  STREAM_FINDER_SECTIONS,
  STREAM_FINDER_CAREER_CLUSTERS,
  STREAM_MAX_POINTS_V1,
  STREAM_MAX_POINTS_V2_CORE,
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
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  // Two-Stage Architecture Evidence Metadata
  assessmentMode?: "CORE" | "EXTENDED" | "V1_LEGACY";
  coreAttemptId?: string;
  extensionAttemptId?: string;
  totalEvidenceQuestions?: number;
  isExtensionAvailable?: boolean;
  extensionRecommended?: boolean;

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
  completedAt: string;
}

export class StreamFinderScoringService {
  /**
   * Calculates the complete Stream Finder result based on psychometric methodology
   * supporting both Stage 1 Core (48 items, balanced 88 max pts per stream)
   * and Stage 2 Extended (80 items evidence base, 145/135/140/120 max pts).
   */
  computeStreamFinderResult(
    attemptId: string,
    participantId: string,
    rawResponses: RawResponseItem[],
    options?: {
      versionCode?: string | null;
      versionName?: string | null;
      languageCode?: string;
      coreAttemptId?: string;
      extensionAttemptId?: string;
      assessmentMode?: "CORE" | "EXTENDED" | "V1_LEGACY";
    }
  ): StreamFinderResultDTO {
    const rawVersionCode = options?.versionCode;
    const isV2Core =
      rawVersionCode === "STREAM_FINDER_V2_CORE" ||
      (!rawVersionCode && rawResponses.length === 48);

    const isExtended =
      rawVersionCode === "STREAM_FINDER_V2_EXTENDED" ||
      options?.assessmentMode === "EXTENDED";

    const expectedQuestions = isV2Core ? 48 : 80;
    const answeredCount = rawResponses.length;
    const completionPercentage = Math.round((answeredCount / expectedQuestions) * 100);
    const isComplete = answeredCount >= expectedQuestions;

    if (!isComplete) {
      throw AppError.badRequest(
        `Complete all ${expectedQuestions} responses to generate your final Stream Finder result. Currently answered: ${answeredCount}/${expectedQuestions}.`,
        "INCOMPLETE_ASSESSMENT_RESPONSES"
      );
    }

    // Index responses by question number
    const responsesByQNum: Record<number, { value: number | string; optionKey?: string }> = {};

    for (const r of rawResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      if (!isNaN(qNum)) {
        let val: number | string = r.response_value || "";
        // Strict validation for Likert Q1-Q60 (no silent clamping)
        if (qNum <= 60) {
          const rawStr = String(r.response_value ?? "").trim();
          const numVal = parseInt(rawStr, 10);
          if (isNaN(numVal) || numVal < 1 || numVal > 5 || String(numVal) !== rawStr) {
            throw AppError.badRequest(
              `Invalid psychometric response for Likert Question ${qNum}. Expected value 1 to 5, received '${r.response_value}'.`,
              "INVALID_PSYCHOMETRIC_RESPONSE"
            );
          }
          val = numVal;
        } else {
          // Strict validation for Forced Choice Q61-Q80 ('A', 'B', 'C', 'D')
          const ch = String(r.response_value ?? "").trim().toUpperCase();
          if (!["A", "B", "C", "D"].includes(ch)) {
            throw AppError.badRequest(
              `Invalid psychometric response for Forced Choice Question ${qNum}. Expected 'A', 'B', 'C', or 'D', received '${r.response_value}'.`,
              "INVALID_PSYCHOMETRIC_RESPONSE"
            );
          }
          val = ch;
        }
        responsesByQNum[qNum] = { value: val };
      }
    }

    // 1. Calculate Likert Trait Points
    let traitSci = 0;
    let traitComm = 0;
    let traitHum = 0;
    let traitApp = 0;

    // 2. Calculate Forced Choice Points
    let choiceCountSci = 0;
    let choiceCountComm = 0;
    let choiceCountHum = 0;
    let choiceCountApp = 0;

    for (const [qStr, item] of Object.entries(responsesByQNum)) {
      const q = parseInt(qStr, 10);
      if (q <= 60) {
        const val = typeof item.value === "number" ? item.value : 0;
        const targetStream = STREAM_ITEM_KEY_MAP[q];

        if (targetStream === "Science") traitSci += val;
        else if (targetStream === "Commerce") traitComm += val;
        else if (targetStream === "Humanities") traitHum += val;
        else if (targetStream === "Applied / Technical") traitApp += val;
      } else {
        const choice = String(item.value || "").toUpperCase();

        if (choice === "A") choiceCountSci++;
        else if (choice === "B") choiceCountComm++;
        else if (choice === "C") choiceCountHum++;
        else if (choice === "D") choiceCountApp++;
      }
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

    // 4. Max Points based on version mode
    const maxPointsMap = isV2Core ? STREAM_MAX_POINTS_V2_CORE : STREAM_MAX_POINTS_V1;
    const traitMaxPoints = isV2Core
      ? { Science: 40, Commerce: 40, Humanities: 40, "Applied / Technical": 40 }
      : { Science: 85, Commerce: 75, Humanities: 80, "Applied / Technical": 60 };
    const choiceMaxPoints = isV2Core
      ? { Science: 48, Commerce: 48, Humanities: 48, "Applied / Technical": 48 }
      : { Science: 60, Commerce: 60, Humanities: 60, "Applied / Technical": 60 };

    // 5. Compatibility Percentages
    const compSci = rawSci / maxPointsMap.Science;
    const compComm = rawComm / maxPointsMap.Commerce;
    const compHum = rawHum / maxPointsMap.Humanities;
    const compApp = rawApp / maxPointsMap["Applied / Technical"];

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
        maxTraitPoints: traitMaxPoints.Science,
        choicePoints: choicePointsSci,
        maxChoicePoints: choiceMaxPoints.Science,
        totalRaw: rawSci,
        maxTotal: maxPointsMap.Science,
        compatibilityPercentage: compSci,
        displayPercentage: Math.round(compSci * 100),
        alignment: getAlignment(compSci),
      },
      Commerce: {
        stream: "Commerce",
        traitPoints: traitComm,
        maxTraitPoints: traitMaxPoints.Commerce,
        choicePoints: choicePointsComm,
        maxChoicePoints: choiceMaxPoints.Commerce,
        totalRaw: rawComm,
        maxTotal: maxPointsMap.Commerce,
        compatibilityPercentage: compComm,
        displayPercentage: Math.round(compComm * 100),
        alignment: getAlignment(compComm),
      },
      Humanities: {
        stream: "Humanities",
        traitPoints: traitHum,
        maxTraitPoints: traitMaxPoints.Humanities,
        choicePoints: choicePointsHum,
        maxChoicePoints: choiceMaxPoints.Humanities,
        totalRaw: rawHum,
        maxTotal: maxPointsMap.Humanities,
        compatibilityPercentage: compHum,
        displayPercentage: Math.round(compHum * 100),
        alignment: getAlignment(compHum),
      },
      "Applied / Technical": {
        stream: "Applied / Technical",
        traitPoints: traitApp,
        maxTraitPoints: traitMaxPoints["Applied / Technical"],
        choicePoints: choicePointsApp,
        maxChoicePoints: choiceMaxPoints["Applied / Technical"],
        totalRaw: rawApp,
        maxTotal: maxPointsMap["Applied / Technical"],
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

    // 6. Match Career Clusters
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

    // 7. Section Breakdowns
    const sectionBreakdown: SectionStreamBreakdown[] = STREAM_FINDER_SECTIONS.map((sec) => {
      const [start, end] = sec.questionRange;
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

      const qCount = isV2Core
        ? (sec.code === "ACADEMIC_INTEREST" ? 12 :
           sec.code === "PROBLEM_SOLVING" ? 7 :
           sec.code === "LEARNING_STYLE" ? 5 :
           sec.code === "CAREER_ORIENTATION" ? 8 :
           sec.code === "APTITUDE_PREFERENCE" ? 8 : 8)
        : (end - start + 1);

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

    const isExtensionAvailable = isV2Core;
    const extensionRecommended = isV2Core && (isMixedProfile || scoreGap < 0.15);
    const assessmentMode: "CORE" | "EXTENDED" | "V1_LEGACY" = isV2Core
      ? "CORE"
      : isExtended
      ? "EXTENDED"
      : "V1_LEGACY";
    const totalEvidenceQuestions = isV2Core ? 48 : 80;

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "STREAM_FINDER",
      assessmentName: "Stream Finder",
      versionCode:
        rawVersionCode ||
        (isV2Core
          ? "STREAM_FINDER_V2_CORE"
          : isExtended
          ? "STREAM_FINDER_V2_EXTENDED"
          : "STREAM_FINDER_V1"),
      versionName:
        options?.versionName ||
        (isV2Core
          ? "Stream Finder — Core Edition (Class 9-10)"
          : isExtended
          ? "Stream Finder — Extension Battery (+32 Items)"
          : "Stream Finder Secondary Edition (Class 9-10)"),
      completedQuestions: answeredCount,
      totalQuestions: expectedQuestions,
      completionPercentage,
      isComplete: true,

      assessmentMode,
      coreAttemptId: options?.coreAttemptId,
      extensionAttemptId: options?.extensionAttemptId,
      totalEvidenceQuestions,
      isExtensionAvailable,
      extensionRecommended,

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
      completedAt: new Date().toISOString(),
    };
  }
}

export const streamFinderScoringService = new StreamFinderScoringService();
