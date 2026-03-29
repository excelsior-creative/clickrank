/**
 * SEO Keywords Configuration
 * ClickBank affiliate niche keywords extracted from reference site (419 articles)
 * Used for topic selection during AI article generation
 */

export type KeywordCategory =
  | 'health'
  | 'wealth'
  | 'relationships'
  | 'hobbies'
  | 'education'
  | 'software'
  | 'home'
  | 'pets'
  | 'cooking'
  | 'survival'

export type KeywordEntry = {
  keyword: string
  category: KeywordCategory
}

export const seoKeywords: KeywordEntry[] = [
  // ── Health & Fitness ──────────────────────────────────────────────────
  { keyword: 'weight loss supplements review', category: 'health' },
  { keyword: 'best keto diet plan for beginners', category: 'health' },
  { keyword: 'diabetes management program', category: 'health' },
  { keyword: 'fat burning supplements that work', category: 'health' },
  { keyword: 'smoothie diet plan for weight loss', category: 'health' },
  { keyword: 'LeanBiome weight loss review', category: 'health' },
  { keyword: 'Alpilean reviews core body temperature', category: 'health' },
  { keyword: 'Ikaria Lean Belly Juice review', category: 'health' },
  { keyword: 'build muscle without weights at home', category: 'health' },
  { keyword: 'high protein recipes for women', category: 'health' },
  { keyword: 'paleo diet plan review', category: 'health' },
  { keyword: 'anabolic cooking muscle building', category: 'health' },
  { keyword: 'leg day training program', category: 'health' },
  { keyword: 'dental health drops Dentitox review', category: 'health' },
  { keyword: 'Cortexi brain health supplement', category: 'health' },
  { keyword: 'mental health online therapy review', category: 'health' },
  { keyword: 'inner child meditation healing', category: 'health' },

  // ── Make Money Online / Wealth ────────────────────────────────────────
  { keyword: 'forex trading robot review', category: 'wealth' },
  { keyword: 'best forex trading system for beginners', category: 'wealth' },
  { keyword: 'Forex Trendy trading signals review', category: 'wealth' },
  { keyword: 'Wallstreet Forex Robot review', category: 'wealth' },
  { keyword: '100 to 10k forex trading strategy', category: 'wealth' },
  { keyword: 'ClickBank affiliate marketing system', category: 'wealth' },
  { keyword: 'super affiliate system review', category: 'wealth' },
  { keyword: 'CB Affiliate Magic review', category: 'wealth' },
  { keyword: 'make money online proven methods', category: 'wealth' },
  { keyword: 'paid online writing jobs review', category: 'wealth' },
  { keyword: 'work from home copywriting jobs', category: 'wealth' },
  { keyword: 'freelance paycheck review', category: 'wealth' },
  { keyword: 'creating and selling ebooks online', category: 'wealth' },
  { keyword: 'info product creation course', category: 'wealth' },
  { keyword: 'millionaire marketing mindset review', category: 'wealth' },
  { keyword: 'horse racing betting profits system', category: 'wealth' },
  { keyword: 'football betting winning strategy', category: 'wealth' },
  { keyword: 'sports betting profits review', category: 'wealth' },
  { keyword: 'stock market investment strategies', category: 'wealth' },
  { keyword: 'Amazon FBA sales rank guide', category: 'wealth' },
  { keyword: 'property tax appeal consulting', category: 'wealth' },
  { keyword: 'real estate bird dog investing', category: 'wealth' },
  { keyword: 'freight broker training program', category: 'wealth' },
  { keyword: 'loot4leads CPA marketing guide', category: 'wealth' },
  { keyword: 'government car auctions savings', category: 'wealth' },
  { keyword: 'flood your site with free traffic', category: 'wealth' },

  // ── Relationships & Self-Improvement ─────────────────────────────────
  { keyword: 'how to get your ex back guide', category: 'relationships' },
  { keyword: 'save my marriage today review', category: 'relationships' },
  { keyword: 'persuasion skills and influence', category: 'relationships' },
  { keyword: 'hypnotic language patterns course', category: 'relationships' },
  { keyword: 'public speaking mastery course', category: 'relationships' },
  { keyword: 'storytelling for business review', category: 'relationships' },
  { keyword: 'divorce survival guide for women', category: 'relationships' },

  // ── Language Learning / Hobbies ───────────────────────────────────────
  { keyword: 'Rocket Languages review', category: 'hobbies' },
  { keyword: 'learn Japanese online fast', category: 'hobbies' },
  { keyword: 'speak fluent English with short stories', category: 'hobbies' },
  { keyword: 'beekeeping for beginners guide', category: 'hobbies' },
  { keyword: 'TedswoodWorking plans review', category: 'hobbies' },
  { keyword: 'ultimate small shop woodworking', category: 'hobbies' },
  { keyword: 'Rocket Piano learn piano online', category: 'hobbies' },
  { keyword: 'learn piano by chords method', category: 'hobbies' },
  { keyword: 'mastering gospel piano course', category: 'hobbies' },
  { keyword: 'acoustic blues guitar lessons online', category: 'hobbies' },
  { keyword: 'guitar fretboard mastery course', category: 'hobbies' },
  { keyword: 'teach yourself guitar tips', category: 'hobbies' },
  { keyword: 'golf swing improvement tips', category: 'hobbies' },
  { keyword: 'golf rangefinder review', category: 'hobbies' },
  { keyword: 'senior golfer tips for better scores', category: 'hobbies' },
  { keyword: 'Croker Golf System review', category: 'hobbies' },
  { keyword: 'online violin fiddle lessons', category: 'hobbies' },
  { keyword: 'learn to draw pencil sketching course', category: 'hobbies' },
  { keyword: 'henna art online course review', category: 'hobbies' },
  { keyword: 'classical sheet music for all levels', category: 'hobbies' },

  // ── Education & Children ──────────────────────────────────────────────
  { keyword: 'homeschool curriculum review', category: 'education' },
  { keyword: 'preschool workbooks learning program', category: 'education' },
  { keyword: 'private school exam prep guide', category: 'education' },
  { keyword: 'CPC medical coding exam prep', category: 'education' },
  { keyword: 'science fair project guide for students', category: 'education' },
  { keyword: 'job interview answer guide', category: 'education' },
  { keyword: 'cover letter writing software review', category: 'education' },
  { keyword: 'American history for kids homeschool', category: 'education' },
  { keyword: 'Pilgrims unit study curriculum review', category: 'education' },

  // ── Software & Digital Tools ──────────────────────────────────────────
  { keyword: 'ClickDesigns graphic design software review', category: 'software' },
  { keyword: 'Graphydo social media marketing toolkit', category: 'software' },
  { keyword: 'Video Surgeon guitar learning software', category: 'software' },
  { keyword: 'SalesVideoCreator review', category: 'software' },
  { keyword: 'Mapify360 lead generation software', category: 'software' },
  { keyword: 'Keyword Researcher long tail keywords tool', category: 'software' },
  { keyword: 'app builder software for non-coders', category: 'software' },
  { keyword: 'Easy Page Buildr website builder', category: 'software' },
  { keyword: 'WP Toolkit WordPress plugins review', category: 'software' },
  { keyword: 'Inboxing Pro email list building', category: 'software' },
  { keyword: 'Vertex42 Excel templates review', category: 'software' },

  // ── Home, Energy & DIY ────────────────────────────────────────────────
  { keyword: 'container home building guide', category: 'home' },
  { keyword: 'tree house building plans for beginners', category: 'home' },
  { keyword: 'DIY solar power system for home', category: 'home' },
  { keyword: 'quick power system green energy', category: 'home' },
  { keyword: 'DIY dish solar energy system', category: 'home' },
  { keyword: 'complete construction home blueprints', category: 'home' },
  { keyword: 'self-sufficient backyard guide', category: 'home' },
  { keyword: 'mammoth green energy system review', category: 'home' },

  // ── Pets & Animals ────────────────────────────────────────────────────
  { keyword: 'dog calming code behavior training', category: 'pets' },
  { keyword: 'brain training for dogs review', category: 'pets' },
  { keyword: 'pet rat care guide', category: 'pets' },
  { keyword: 'English Bull Terrier care guide', category: 'pets' },
  { keyword: 'bake a bone pet bakery business', category: 'pets' },

  // ── Cooking & Recipes ─────────────────────────────────────────────────
  { keyword: 'keto recipe cookbook 500 meals', category: 'cooking' },
  { keyword: 'metabolic cooking fat loss recipes', category: 'cooking' },
  { keyword: 'vegan recipe cookbook plant-based', category: 'cooking' },
  { keyword: '21 day smoothie diet plan review', category: 'cooking' },
  { keyword: 'dairy free smoothie recipes guide', category: 'cooking' },
  { keyword: 'diabetic friendly recipe cookbook', category: 'cooking' },
  { keyword: 'anabolic cooking bodybuilding recipes', category: 'cooking' },
  { keyword: 'keto bread and dessert substitutes', category: 'cooking' },
  { keyword: 'kids cooking course healthy eating', category: 'cooking' },
  { keyword: '500 dessert recipes cookbook review', category: 'cooking' },
  { keyword: 'vegetarian recipes health wellness', category: 'cooking' },

  // ── Survival & Prepping ───────────────────────────────────────────────
  { keyword: 'VIP survival academy membership review', category: 'survival' },
  { keyword: 'tactical survival bag review', category: 'survival' },
  { keyword: 'DIY home defense training', category: 'survival' },
  { keyword: 'gunfight training mistakes guide', category: 'survival' },
]

export function getRandomKeywords(count: number = 5): KeywordEntry[] {
  const shuffled = [...seoKeywords].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getKeywordsByCategory(category: KeywordCategory): KeywordEntry[] {
  return seoKeywords.filter((k) => k.category === category)
}

export function formatKeyword(entry: KeywordEntry): string {
  return entry.keyword
}
