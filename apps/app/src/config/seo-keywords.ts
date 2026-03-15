/**
 * SEO Keywords Configuration
 * Template for topic selection during article generation
 */

export type KeywordCategory = "service" | "problem" | "local";

export type KeywordEntry = {
  keyword: string;
  category: KeywordCategory;
  location?: string;
};

export const seoKeywords: KeywordEntry[] = [
  { keyword: "Web development", category: "service", location: "Orange County" },
  { keyword: "Next.js template", category: "service" },
  { keyword: "Fix slow website", category: "problem" },
];

export function getRandomKeywords(count: number = 5): KeywordEntry[] {
  const shuffled = [...seoKeywords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function formatKeywordWithLocation(entry: KeywordEntry): string {
  return entry.location ? `${entry.keyword} ${entry.location}` : entry.keyword;
}

