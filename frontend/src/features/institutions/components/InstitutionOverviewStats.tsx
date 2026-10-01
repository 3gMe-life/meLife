"use client";

import React from "react";
import { MetricCard } from "@/features/dashboard/components/common/MetricCard";
import { InstitutionOverviewStats as StatsType, InstitutionProfile } from "../types/institution.types";

interface InstitutionOverviewStatsProps {
  stats: StatsType;
  institution: InstitutionProfile;
}

export const InstitutionOverviewStats: React.FC<InstitutionOverviewStatsProps> = ({
  stats,
  institution,
}) => {
  const capacity = institution?.studentCapacity || 1500;
  const totalStudents = stats?.totalStudents ?? 0;
  const activeStudents = stats?.activeStudents ?? 0;
  const totalClasses = stats?.totalClasses ?? 0;
  const completionRate = stats?.assessmentCompletionRate ?? 0;
  const pendingAssessments = stats?.pendingAssessmentsCount ?? 0;
  const upcomingSessions = stats?.upcomingSessionsCount ?? 0;
  const completedSessions = stats?.completedSessionsCount ?? 0;
  const connectedParents = stats?.connectedParentsCount ?? 0;

  const capacityPercent = Math.round((totalStudents / Math.max(1, capacity)) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Enrolled Students */}
      <MetricCard
        id="total-students"
        title="Total Enrolled Students"
        value={totalStudents.toLocaleString()}
        subtitle={`School Capacity: ${capacity.toLocaleString()}`}
        iconName="GraduationCap"
        accentColor="emerald"
        trend={{
          value: `${capacityPercent}% capacity`,
          isPositive: true,
        }}
      />

      {/* 2. Active Students */}
      <MetricCard
        id="active-students"
        title="Active Students"
        value={activeStudents.toLocaleString()}
        subtitle="Currently enrolled & active"
        iconName="Users"
        accentColor="teal"
        trend={{
          value: "100% active",
          isPositive: true,
        }}
      />

      {/* 3. Total Cohorts / Classes */}
      <MetricCard
        id="total-classes"
        title="Active Classes / Cohorts"
        value={totalClasses.toString()}
        subtitle="Across Grades 9 - 12"
        iconName="School"
        accentColor="indigo"
      />

      {/* 4. Assessment Completion Rate */}
      <MetricCard
        id="assessment-completion"
        title="Assessment Completion"
        value={`${completionRate}%`}
        subtitle="Psychometric completion"
        iconName="LineChart"
        accentColor="emerald"
        trend={{
          value: `${completionRate >= 50 ? "Healthy" : "In Progress"}`,
          isPositive: completionRate >= 50,
        }}
      />

      {/* 5. Pending Assessments */}
      <MetricCard
        id="pending-assessments"
        title="Pending Assessments"
        value={pendingAssessments.toLocaleString()}
        subtitle="Students awaiting evaluation"
        iconName="Clock"
        accentColor="amber"
      />

      {/* 6. Upcoming Guidance Sessions */}
      <MetricCard
        id="upcoming-sessions"
        title="Upcoming Guidance"
        value={upcomingSessions.toString()}
        subtitle="Confirmed counsellor sessions"
        iconName="Calendar"
        accentColor="teal"
      />

      {/* 7. Completed Sessions */}
      <MetricCard
        id="completed-sessions"
        title="Completed Guidance"
        value={completedSessions.toString()}
        subtitle="1-on-1 career interventions"
        iconName="Trophy"
        accentColor="blue"
      />

      {/* 8. Connected Parents */}
      <MetricCard
        id="connected-parents"
        title="Connected Parents"
        value={connectedParents.toLocaleString()}
        subtitle="Linked verified guardians"
        iconName="HeartHandshake"
        accentColor="rose"
      />
    </div>
  );
};
