/**
 * ClickBank Service
 *
 * Scrapes the ClickBank marketplace for trending/hot products.
 * Uses Puppeteer for JavaScript-heavy pages that require login.
 *
 * Credentials are read from env vars:
 *   CLICKBANK_EMAIL
 *   CLICKBANK_PASSWORD
 */

export type ClickBankProduct = {
  name: string
  vendor: string
  category: string
  gravity: number
  initialPrice: number
  avgRebill: number
  description: string
  vendorUrl: string
  affiliateUrl: string
}

// ─── Static fallback products ─────────────────────────────────────────────────
// Used when scraping fails or credentials are not configured.
// These represent perennially top-selling ClickBank niches.
const FALLBACK_PRODUCTS: ClickBankProduct[] = [
  {
    name: 'Custom Keto Diet',
    vendor: 'customketodiet',
    category: 'Health & Fitness',
    gravity: 180,
    initialPrice: 37,
    avgRebill: 0,
    description:
      'Personalized keto meal plan with 8-week custom diet program based on food preferences and body type.',
    vendorUrl: 'https://customketodiet.com',
    affiliateUrl: 'https://www.clickbank.com/marketplace/health-fitness',
  },
  {
    name: 'Smoothie Diet',
    vendor: 'smoothiediet',
    category: 'Health & Fitness',
    gravity: 160,
    initialPrice: 47,
    avgRebill: 0,
    description:
      '21-day rapid weight loss program using smoothies. Proven system for fast fat loss.',
    vendorUrl: 'https://thesmoothiediet.com',
    affiliateUrl: 'https://www.clickbank.com/marketplace/health-fitness',
  },
  {
    name: 'Forex Trendy',
    vendor: 'forextrendy',
    category: 'E-business & E-marketing',
    gravity: 120,
    initialPrice: 37,
    avgRebill: 37,
    description:
      'Real-time forex scanner to find the best trending currency pairs and time frames.',
    vendorUrl: 'https://www.forextrendy.com',
    affiliateUrl: 'https://www.clickbank.com/marketplace/e-business-e-marketing',
  },
  {
    name: 'Brain Training For Dogs',
    vendor: 'adrianemoore',
    category: 'Pets & Animals',
    gravity: 95,
    initialPrice: 47,
    avgRebill: 0,
    description:
      'Step-by-step force-free dog training program with brain games that unlock dogs natural intelligence.',
    vendorUrl: 'https://braintraining4dogs.com',
    affiliateUrl: 'https://www.clickbank.com/marketplace/pets-animals',
  },
  {
    name: 'Ted\'s Woodworking',
    vendor: 'tedsplans',
    category: 'Home & Garden',
    gravity: 85,
    initialPrice: 67,
    avgRebill: 0,
    description:
      '16,000 woodworking plans with step-by-step instructions, materials lists, and diagrams.',
    vendorUrl: 'https://www.tedswoodworking.com',
    affiliateUrl: 'https://www.clickbank.com/marketplace/home-garden',
  },
  {
    name: 'Super Affiliate System',
    vendor: 'jcfilippo',
    category: 'E-business & E-marketing',
    gravity: 110,
    initialPrice: 997,
    avgRebill: 0,
    description:
      'Step-by-step affiliate marketing training system with paid traffic strategies and done-for-you campaigns.',
    vendorUrl: 'https://www.superaffiliatesystem.com',
    affiliateUrl: 'https://www.clickbank.com/marketplace/e-business-e-marketing',
  },
  {
    name: 'Dentitox Pro',
    vendor: 'dentitox',
    category: 'Health & Fitness',
    gravity: 140,
    initialPrice: 69,
    avgRebill: 0,
    description:
      'Natural dental health drops formula for supporting healthy teeth and gums.',
    vendorUrl: 'https://dentitox.com',
    affiliateUrl: 'https://www.clickbank.com/marketplace/health-fitness',
  },
  {
    name: 'Manifestation Magic',
    vendor: 'mmanifest',
    category: 'Self-Help',
    gravity: 100,
    initialPrice: 37,
    avgRebill: 27,
    description:
      'Energy orbiting audio tracks based on NLP and hypnosis to shift subconscious blocks and manifest wealth.',
    vendorUrl: 'https://manifestationmagic.co',
    affiliateUrl: 'https://www.clickbank.com/marketplace/self-help',
  },
]

/**
 * Attempt to scrape live trending products from ClickBank marketplace.
 * Falls back gracefully to static data if login/scraping fails.
 */
export async function getTrendingProducts(limit: number = 10): Promise<ClickBankProduct[]> {
  const email = process.env.CLICKBANK_EMAIL
  const password = process.env.CLICKBANK_PASSWORD

  if (!email || !password) {
    console.warn('[clickbankService] No credentials configured, using fallback products')
    return shuffled(FALLBACK_PRODUCTS).slice(0, limit)
  }

  try {
    return await scrapeWithPuppeteer(email, password, limit)
  } catch (err) {
    console.error('[clickbankService] Scraping failed, using fallback:', err)
    return shuffled(FALLBACK_PRODUCTS).slice(0, limit)
  }
}

/**
 * Scrape ClickBank marketplace with Puppeteer.
 */
async function scrapeWithPuppeteer(
  email: string,
  password: string,
  limit: number,
): Promise<ClickBankProduct[]> {
  // Dynamic import — puppeteer is optional; if not installed, throws and we fall back
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let puppeteer: any
  try {
    // @ts-ignore — puppeteer is an optional peer dep
    puppeteer = await import('puppeteer')
  } catch {
    throw new Error('puppeteer not installed — install it or rely on fallback products')
  }

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    )

    // Step 1: Login
    console.log('[clickbankService] Navigating to ClickBank login...')
    await page.goto('https://accounts.clickbank.com/login.htm', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    await page.type('input[name="username"]', email, { delay: 50 })
    await page.type('input[name="password"]', password, { delay: 50 })
    await page.click('button[type="submit"], input[type="submit"]')
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })

    // Step 2: Navigate to marketplace sorted by gravity
    console.log('[clickbankService] Navigating to marketplace...')
    await page.goto(
      'https://www.clickbank.com/marketplace/results/?sortField=GRAVITY&sortOrder=DESC',
      { waitUntil: 'networkidle2', timeout: 30000 },
    )

    // Step 3: Extract product data
    const products = await page.evaluate(() => {
      const results: Array<{
        name: string
        vendor: string
        category: string
        gravity: number
        initialPrice: number
        avgRebill: number
        description: string
        vendorUrl: string
        affiliateUrl: string
      }> = []

      // ClickBank marketplace uses data-* attrs and various class names — adapt as needed
      const items = document.querySelectorAll(
        '.marketplace-results-product, [data-product-id], .product-list-item',
      )

      items.forEach((item) => {
        try {
          const name =
            item.querySelector('.product-title, h2, h3, .title')?.textContent?.trim() ?? ''
          const vendor =
            item.querySelector('.vendor-name, .vendor, [data-vendor]')?.textContent?.trim() ?? ''
          const category =
            item.querySelector('.category, .niche, [data-category]')?.textContent?.trim() ?? ''
          const gravityText =
            item.querySelector('[data-gravity], .gravity, .grav-score')?.textContent?.trim() ?? '0'
          const gravity = parseFloat(gravityText.replace(/[^0-9.]/g, '')) || 0
          const priceText =
            item
              .querySelector('[data-initial-price], .initial-price, .price')
              ?.textContent?.trim() ?? '0'
          const initialPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0
          const rebillText =
            item.querySelector('[data-avg-rebill], .avg-rebill')?.textContent?.trim() ?? '0'
          const avgRebill = parseFloat(rebillText.replace(/[^0-9.]/g, '')) || 0
          const description =
            item
              .querySelector('.product-description, .description, p')
              ?.textContent?.trim() ?? ''
          const vendorUrl =
            (item.querySelector('a[href*="vendor"], a.vendor-link') as HTMLAnchorElement)?.href ??
            ''
          const affiliateUrl =
            (item.querySelector('a[href*="promote"], a.promote-link') as HTMLAnchorElement)
              ?.href ?? ''

          if (name) {
            results.push({
              name,
              vendor,
              category,
              gravity,
              initialPrice,
              avgRebill,
              description,
              vendorUrl,
              affiliateUrl,
            })
          }
        } catch {
          // Skip malformed items
        }
      })

      return results
    })

    console.log(`[clickbankService] Scraped ${products.length} products from marketplace`)

    if (products.length === 0) {
      console.warn('[clickbankService] No products found via scraping, using fallback')
      return shuffled(FALLBACK_PRODUCTS).slice(0, limit)
    }

    // Sort by gravity descending and return top N
    return products
      .sort((a: { gravity: number }, b: { gravity: number }) => b.gravity - a.gravity)
      .slice(0, limit)
  } finally {
    await browser.close()
  }
}

/**
 * Normalize a product name into the canonical token set we use to detect
 * whether it's already been covered. Strips stopwords and review-ish words
 * so "Custom Keto Diet" and "custom-keto-diet-review-2026" collide.
 */
function canonicalTokens(input: string): string[] {
  const stopwords = new Set([
    'review',
    'reviews',
    'the',
    'a',
    'an',
    'of',
    'for',
    'and',
    'is',
    'it',
    'worth',
    'scam',
    'legit',
    'honest',
    '2025',
    '2026',
    '2027',
  ])
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !stopwords.has(token))
}

/**
 * True if a recent slug is about the same product as this candidate.
 * Requires ALL of the candidate's significant tokens to appear in the slug,
 * so single-word overlaps ("diet", "pro") don't cause false positives.
 */
function slugCoversProduct(slug: string, productName: string): boolean {
  const slugTokens = new Set(canonicalTokens(slug))
  const productTokens = canonicalTokens(productName)
  if (productTokens.length === 0) return false
  return productTokens.every((token) => slugTokens.has(token))
}

/**
 * Filter out products whose canonical tokens all appear in a recent slug.
 * Falls back to the full list if nothing survives (better to repeat a
 * product than to crash the cron).
 */
export function filterUnusedProducts(
  products: ClickBankProduct[],
  recentSlugs: string[],
): ClickBankProduct[] {
  const unused = products.filter(
    (product) => !recentSlugs.some((slug) => slugCoversProduct(slug, product.name)),
  )
  return unused.length > 0 ? unused : products
}

/**
 * Pick a trending product that hasn't been written about recently.
 */
export async function pickTrendingProduct(recentSlugs: string[]): Promise<ClickBankProduct> {
  const products = await getTrendingProducts(20)
  const filtered = filterUnusedProducts(products, recentSlugs)
  return filtered[Math.floor(Math.random() * filtered.length)]!
}

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}
