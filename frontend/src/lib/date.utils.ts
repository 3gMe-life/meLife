/**
 * Robust date formatting utility for assessment reports and profiles.
 * Prevents "Invalid Date" errors across all browsers, SSR contexts, and locales.
 */
export function formatAssessmentDate(
  dateInput: string | number | Date | null | undefined,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  if (!dateInput) {
    const fallback = new Date();
    return fallback.toLocaleDateString(locale, defaultOptions);
  }

  try {
    const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return new Date().toLocaleDateString(locale, defaultOptions);
    }
    return d.toLocaleDateString(locale, defaultOptions);
  } catch {
    return new Date().toLocaleDateString(locale, defaultOptions);
  }
}

export function formatFullAssessmentDate(
  dateInput: string | number | Date | null | undefined,
  locale: string = "en-US"
): string {
  return formatAssessmentDate(dateInput, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
