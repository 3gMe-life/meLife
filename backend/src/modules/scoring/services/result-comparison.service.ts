import { logger } from "../../../common/utils/logger";
import { assessmentContentRepository } from "../../assessments/assessment-content.repository";

export interface DimensionComparisonItem {
  dimensionCode: string;
  dimensionName: string;
  sectionCode: string;
  oldScore: number;
  newScore: number;
  delta: number;
  oldLevel?: string;
  newLevel?: string;
  trend: "IMPROVED" | "STABLE" | "REFOCUSED";
}

export interface GrowthInsight {
  category: "INTEREST" | "SKILL" | "APTITUDE" | "STRENGTH";
  title: string;
  description: string;
  dimensionCode?: string;
  delta?: number;
}

export interface LongitudinalComparisonResultDTO {
  comparisonId?: string;
  studentId: string;
  oldResultId: string;
  newResultId: string;
  oldCompletedDate: string;
  newCompletedDate: string;
  daysBetween: number;
  oldVersionCode?: string | null;
  newVersionCode?: string | null;
  isVersionMismatch: boolean;
  versionNotice?: string | null;
  oldArchetype: {
    title: string;
    description: string;
  };
  newArchetype: {
    title: string;
    description: string;
  };
  hasArchetypeShift: boolean;
  interestComparison: DimensionComparisonItem[];
  skillsComparison: DimensionComparisonItem[];
  aptitudeComparison: DimensionComparisonItem[];
  strengthsComparison: DimensionComparisonItem[];
  profileVectorDelta: Record<string, { old: number; new: number; delta: number }>;
  topGains: DimensionComparisonItem[];
  growthTrajectory: string;
  growthSummary: string;
  narrativeInsights: GrowthInsight[];
}

export class ResultComparisonService {
  /**
   * Compares two completed assessment results and generates longitudinal growth analytics and narrative insights.
   */
  async compareResults(
    studentId: string,
    oldResultEntity: any,
    newResultEntity: any
  ): Promise<LongitudinalComparisonResultDTO> {
    const parsePayload = (entity: any) => {
      if (!entity) return {};
      if (typeof entity.result_data === "string") {
        try {
          return JSON.parse(entity.result_data);
        } catch {
          return entity.result_data;
        }
      }
      if (entity.result_data && typeof entity.result_data === "object") {
        return entity.result_data;
      }
      return entity;
    };

    const oldData = parsePayload(oldResultEntity);
    const newData = parsePayload(newResultEntity);

    const oldVersionCode: string | null =
      oldResultEntity.version_code ||
      oldResultEntity.versionCode ||
      oldData?.versionCode ||
      oldData?.version_code ||
      null;
    const newVersionCode: string | null =
      newResultEntity.version_code ||
      newResultEntity.versionCode ||
      newData?.versionCode ||
      newData?.version_code ||
      null;

    const isVersionMismatch = Boolean(
      oldVersionCode && newVersionCode && oldVersionCode !== newVersionCode
    );
    const versionNotice = isVersionMismatch
      ? "These assessments used different versions. Score differences should be interpreted with this in mind."
      : null;

    const oldDate = new Date(oldResultEntity.completed_at || oldResultEntity.created_at || Date.now());
    const newDate = new Date(newResultEntity.completed_at || newResultEntity.created_at || Date.now());
    const daysBetween = Math.max(0, Math.round((newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24)));

    // 1. Archetype info
    const oldArchetype = {
      title: oldData?.learningProfile?.archetypeTitle || oldResultEntity.profile_type || "Explorer",
      description: oldData?.learningProfile?.strengthSummary || "Broad career exploration and inquiry focus.",
    };
    const newArchetype = {
      title: newData?.learningProfile?.archetypeTitle || newResultEntity.profile_type || "Strategist",
      description: newData?.learningProfile?.strengthSummary || "Structured problem solving and system thinking.",
    };
    const hasArchetypeShift = oldArchetype.title.toLowerCase() !== newArchetype.title.toLowerCase();

    // Helper to map and compare dimension arrays
    const compareDimensionLists = (
      oldList: any[] = [],
      newList: any[] = [],
      sectionCode: string
    ): DimensionComparisonItem[] => {
      const oldMap: Record<string, any> = {};
      for (const d of oldList) {
        const code = d.code || d.dimensionCode || d.name;
        oldMap[code] = d;
      }

      const results: DimensionComparisonItem[] = [];
      const visited = new Set<string>();

      for (const n of newList) {
        const code = n.code || n.dimensionCode || n.name;
        visited.add(code);
        const oldItem = oldMap[code];

        const oldScore = Math.round(
          Number(
            oldItem?.scalePositionPercentage ??
              oldItem?.scorePercentage ??
              oldItem?.score ??
              0
          )
        );
        const newScore = Math.round(
          Number(
            n.scalePositionPercentage ??
              n.scorePercentage ??
              n.score ??
              0
          )
        );
        const delta = newScore - oldScore;

        const trend: "IMPROVED" | "STABLE" | "REFOCUSED" =
          delta >= 4 ? "IMPROVED" : delta <= -4 ? "REFOCUSED" : "STABLE";

        results.push({
          dimensionCode: code,
          dimensionName: n.name || n.dimensionName || code,
          sectionCode,
          oldScore,
          newScore,
          delta,
          oldLevel: oldItem?.level || undefined,
          newLevel: n.level || undefined,
          trend,
        });
      }

      // Add any old dimensions not in new list
      for (const d of oldList) {
        const code = d.code || d.dimensionCode || d.name;
        if (!visited.has(code)) {
          const oldScore = Math.round(
            Number(
              d.scalePositionPercentage ??
                d.scorePercentage ??
                d.score ??
                0
            )
          );
          results.push({
            dimensionCode: code,
            dimensionName: d.name || d.dimensionName || code,
            sectionCode,
            oldScore,
            newScore: 0,
            delta: -oldScore,
            oldLevel: d.level || undefined,
            trend: "REFOCUSED",
          });
        }
      }


      return results;
    };

    // 2. Compare Sections
    const interestComparison = compareDimensionLists(
      oldData?.interestDiscovery?.dimensions,
      newData?.interestDiscovery?.dimensions,
      "SECTION_A"
    );

    const skillsComparison = compareDimensionLists(
      oldData?.skillBehaviour?.dimensions,
      newData?.skillBehaviour?.dimensions,
      "SECTION_B"
    );

    const aptitudeComparison = compareDimensionLists(
      oldData?.demonstratedAptitude?.dimensions,
      newData?.demonstratedAptitude?.dimensions,
      "SECTION_C"
    );

    const strengthsComparison = compareDimensionLists(
      oldData?.developmentalStrengths?.dimensions,
      newData?.developmentalStrengths?.dimensions,
      "SECTION_D"
    );

    // 3. Compare 29-dimension profile vectors
    const parseVector = (v: any) => {
      if (!v) return {};
      if (typeof v === "string") {
        try {
          return JSON.parse(v);
        } catch {
          return {};
        }
      }
      return typeof v === "object" ? v : {};
    };

    const oldVector = parseVector(oldResultEntity.profile_vector || oldData?.profileVector);
    const newVector = parseVector(newResultEntity.profile_vector || newData?.profileVector);
    const profileVectorDelta: Record<string, { old: number; new: number; delta: number }> = {};


    const allVectorKeys = Array.from(
      new Set([...Object.keys(oldVector), ...Object.keys(newVector)])
    );

    for (const k of allVectorKeys) {
      const o = typeof oldVector[k] === "number" ? Math.round(oldVector[k]) : 0;
      const n = typeof newVector[k] === "number" ? Math.round(newVector[k]) : 0;
      profileVectorDelta[k] = {
        old: o,
        new: n,
        delta: n - o,
      };
    }

    // 4. Identify Top Gains across all dimensions
    const allComparisons = [
      ...interestComparison,
      ...skillsComparison,
      ...aptitudeComparison,
      ...strengthsComparison,
    ];

    const topGains = [...allComparisons]
      .filter((d) => d.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3);

    // 5. Generate Positive Psychometric Growth Insights & Summary
    const narrativeInsights: GrowthInsight[] = [];

    // Skill gains insight
    const topSkillGain = skillsComparison.filter((s) => s.delta > 0).sort((a, b) => b.delta - a.delta)[0];
    if (topSkillGain && topSkillGain.delta >= 5) {
      narrativeInsights.push({
        category: "SKILL",
        title: isVersionMismatch ? `${topSkillGain.dimensionName} Score Delta` : `${topSkillGain.dimensionName} Strengthened`,
        description: isVersionMismatch
          ? `Score changed by +${topSkillGain.delta} points in ${topSkillGain.dimensionName}. These assessments used different versions. Score differences should be interpreted with this in mind.`
          : `Your demonstrated score in ${topSkillGain.dimensionName} increased by +${topSkillGain.delta}%, highlighting strengthened problem-solving agility and applied reasoning habits.`,
        dimensionCode: topSkillGain.dimensionCode,
        delta: topSkillGain.delta,
      });
    }

    // Interest evolution insight
    const topInterestGain = interestComparison.filter((i) => i.delta > 0).sort((a, b) => b.delta - a.delta)[0];
    if (topInterestGain && topInterestGain.delta >= 5) {
      narrativeInsights.push({
        category: "INTEREST",
        title: isVersionMismatch ? `${topInterestGain.dimensionName} Score Delta` : `Expansion in ${topInterestGain.dimensionName}`,
        description: isVersionMismatch
          ? `Score changed by +${topInterestGain.delta} points in ${topInterestGain.dimensionName}. These assessments used different versions. Score differences should be interpreted with this in mind.`
          : `Your career curiosity in ${topInterestGain.dimensionName} developed (+${topInterestGain.delta}%), broadening your potential pathways and interdisciplinary affinities.`,
        dimensionCode: topInterestGain.dimensionCode,
        delta: topInterestGain.delta,
      });
    }

    // Aptitude accuracy gain insight
    const topAptitudeGain = aptitudeComparison.filter((a) => a.delta > 0).sort((a, b) => b.delta - a.delta)[0];
    if (topAptitudeGain && topAptitudeGain.delta >= 5) {
      narrativeInsights.push({
        category: "APTITUDE",
        title: isVersionMismatch ? `${topAptitudeGain.dimensionName} Score Delta` : `Cognitive Accuracy Calibration: ${topAptitudeGain.dimensionName}`,
        description: isVersionMismatch
          ? `Score changed by +${topAptitudeGain.delta} points in ${topAptitudeGain.dimensionName}. These assessments used different versions. Score differences should be interpreted with this in mind.`
          : `Your performance in ${topAptitudeGain.dimensionName} showed an improvement of +${topAptitudeGain.delta}%, reflecting stronger pattern recognition and analytical precision.`,
        dimensionCode: topAptitudeGain.dimensionCode,
        delta: topAptitudeGain.delta,
      });
    }

    // Archetype progression insight
    if (hasArchetypeShift) {
      narrativeInsights.push({
        category: "STRENGTH",
        title: `Archetype Maturation: ${newArchetype.title}`,
        description: `Your primary profile has developed from "${oldArchetype.title}" toward "${newArchetype.title}", indicating clear maturation of your cognitive preferences and career focus.`,
      });
    } else {
      narrativeInsights.push({
        category: "STRENGTH",
        title: `Consolidated Profile: ${newArchetype.title}`,
        description: `Your primary archetype "${newArchetype.title}" remains stable and deeply consolidated, showing steady long-term alignment with your core strengths.`,
      });
    }

    // Growth Trajectory Classification
    let growthTrajectory = "Consolidated & Deepening Strengths";
    if (isVersionMismatch) {
      growthTrajectory = "Cross-Version Evaluation";
    } else if (hasArchetypeShift && topGains.length >= 2) {
      growthTrajectory = "Dynamic Growth & Pathway Expansion";
    } else if (topGains.length >= 2) {
      growthTrajectory = "Progressive Skill Acceleration";
    }

    let growthSummary: string;
    if (isVersionMismatch) {
      growthSummary = topGains.length > 0
        ? `Over the course of ${daysBetween} days between evaluations across different assessment versions (${oldVersionCode || "Previous"} and ${newVersionCode || "Current"}), score changed by ${topGains.map((g) => `${g.dimensionName} (+${g.delta} points)`).join(", ")}. These assessments used different versions. Score differences should be interpreted with this in mind.`
        : `Over the course of ${daysBetween} days between evaluations across different assessment versions (${oldVersionCode || "Previous"} and ${newVersionCode || "Current"}), assessment indicators were recorded. These assessments used different versions. Score differences should be interpreted with this in mind.`;
    } else {
      growthSummary = topGains.length > 0
        ? `Over the course of ${daysBetween} days between evaluations, your highest developmental progress occurred in ${topGains.map((g) => `${g.dimensionName} (+${g.delta}%)`).join(", ")}. Your current interests and demonstrated strengths have evolved constructively.`
        : `Your assessment indicators show high stability and well-grounded calibration across all evaluated psychometric constructs over the ${daysBetween}-day interval.`;
    }

    const comparisonResult: LongitudinalComparisonResultDTO = {
      studentId,
      oldResultId: oldResultEntity.id,
      newResultId: newResultEntity.id,
      oldCompletedDate: oldDate.toISOString(),
      newCompletedDate: newDate.toISOString(),
      daysBetween,
      oldVersionCode,
      newVersionCode,
      isVersionMismatch,
      versionNotice,
      oldArchetype,
      newArchetype,
      hasArchetypeShift,
      interestComparison,
      skillsComparison,
      aptitudeComparison,
      strengthsComparison,
      profileVectorDelta,
      topGains,
      growthTrajectory,
      growthSummary,
      narrativeInsights,
    };

    // Cache comparison in database
    try {
      const comparisonId = await assessmentContentRepository.saveComparison(
        studentId,
        oldResultEntity.id,
        newResultEntity.id,
        daysBetween,
        comparisonResult
      );
      comparisonResult.comparisonId = comparisonId;
    } catch (err) {
      logger.warn({ err, studentId }, "Failed to cache assessment comparison");
    }

    return comparisonResult;
  }
}

export const resultComparisonService = new ResultComparisonService();
