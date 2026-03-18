// ─── AI Course Filter ────────────────────────────────────────────────────────
// Extracted from Udemy.tsx — standalone, importable module.

export interface CourseRow {
  "Course Category": string;
  "Course Title"?: string;
  [key: string]: unknown;
}

export interface FilterResult {
  total: number;
  aiCount: number;
  nonAiCount: number;
  aiCourses: CourseRow[];
  nonAiCourses: CourseRow[];
  matchedKeywords: Record<string, string[]>; // courseCategory → keywords that matched
}

// Keyword list — extend as needed.
export const AI_CATEGORY_KEYWORDS: string[] = [
  "ai",
  "machine learning",
  "deep learning",
  "neural",
  "nlp",
  "computer vision",
  "data science",
];

/**
 * Returns true when the row's "Course Category" cell contains at least one
 * AI-related keyword as a whole word (case-insensitive).
 * Handles multi-category cells like "Generative AI for Tech, Machine Learning".
 */
export function isAICourse(row: CourseRow): boolean {
  const category = (row["Course Category"] || "").toLowerCase();
  return AI_CATEGORY_KEYWORDS.some((keyword) => {
    const pattern = new RegExp(`\\b${keyword}\\b`);
    return pattern.test(category);
  });
}

/**
 * Returns the specific keywords that matched for a given category string.
 * Useful for debugging / display.
 */
export function getMatchedKeywords(category: string): string[] {
  const lower = category.toLowerCase();
  return AI_CATEGORY_KEYWORDS.filter((keyword) => {
    const pattern = new RegExp(`\\b${keyword}\\b`);
    return pattern.test(lower);
  });
}

/**
 * Runs the AI filter over an array of course rows and returns a detailed result.
 */
export function applyAIFilter(rows: CourseRow[]): FilterResult {
  const aiCourses: CourseRow[] = [];
  const nonAiCourses: CourseRow[] = [];
  const matchedKeywords: Record<string, string[]> = {};

  for (const row of rows) {
    const category = row["Course Category"] || "";
    const keywords = getMatchedKeywords(category);

    if (keywords.length > 0) {
      aiCourses.push(row);
      if (!matchedKeywords[category]) {
        matchedKeywords[category] = keywords;
      }
    } else {
      nonAiCourses.push(row);
    }
  }

  return {
    total: rows.length,
    aiCount: aiCourses.length,
    nonAiCount: nonAiCourses.length,
    aiCourses,
    nonAiCourses,
    matchedKeywords,
  };
}
