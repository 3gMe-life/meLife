import React from "react";

interface SkillTagsProps {
  skills: string[];
  maxVisible?: number;
  size?: "sm" | "md";
  variant?: "default" | "subtle" | "teal";
}

export const SkillTags: React.FC<SkillTagsProps> = ({
  skills,
  maxVisible = 4,
  size = "sm",
  variant = "default",
}) => {
  if (!skills || skills.length === 0) return null;

  const visibleSkills = skills.slice(0, maxVisible);
  const remainingCount = skills.length - maxVisible;

  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-0.5 text-[10px] md:text-[11px]"
      : "px-3 py-1 text-xs";

  let variantClasses =
    "bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]";
  if (variant === "teal") {
    variantClasses =
      "bg-[#00BFA5]/10 dark:bg-[#00BFA5]/15 border border-[#00BFA5]/30 text-[#008F83] dark:text-[#00BFA5] font-semibold";
  } else if (variant === "subtle") {
    variantClasses =
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleSkills.map((skill, idx) => (
        <span
          key={idx}
          className={`rounded-lg font-medium transition-colors shadow-2xs ${sizeClasses} ${variantClasses}`}
        >
          {skill}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="rounded-lg bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};
