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
// ClickBank affiliate nickname — used to construct hop links.
const AFFILIATE_NICK = process.env.CLICKBANK_AFFILIATE_NICK || 'clickrankn'

function hopLink(vendor: string): string {
  return `https://hop.clickbank.net/?affiliate=${AFFILIATE_NICK}&vendor=${vendor}`
}

const FALLBACK_PRODUCTS: ClickBankProduct[] = [
  // ── Health & Fitness ────────────────────────────────────────────────────────
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
    affiliateUrl: hopLink('customketodiet'),
  },
  {
    name: 'Smoothie Diet',
    vendor: 'smoothiediet',
    category: 'Health & Fitness',
    gravity: 160,
    initialPrice: 47,
    avgRebill: 0,
    description:
      '21-day rapid weight loss program using smoothie recipes designed for fast, healthy fat loss.',
    vendorUrl: 'https://thesmoothiediet.com',
    affiliateUrl: hopLink('smoothiediet'),
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
    affiliateUrl: hopLink('dentitox'),
  },
  {
    name: 'Ikaria Lean Belly Juice',
    vendor: 'ikarialean',
    category: 'Health & Fitness',
    gravity: 170,
    initialPrice: 69,
    avgRebill: 0,
    description:
      'Powdered supplement designed to support healthy weight loss by targeting ceramides and metabolism.',
    vendorUrl: 'https://ikarialean.com',
    affiliateUrl: hopLink('ikarialean'),
  },
  {
    name: 'Java Burn',
    vendor: 'javaburn',
    category: 'Health & Fitness',
    gravity: 200,
    initialPrice: 69,
    avgRebill: 0,
    description:
      'Tasteless powder packet added to morning coffee to support metabolism and energy levels.',
    vendorUrl: 'https://javaburn.com',
    affiliateUrl: hopLink('javaburn'),
  },
  {
    name: 'Prodentim',
    vendor: 'prodentim',
    category: 'Health & Fitness',
    gravity: 190,
    initialPrice: 69,
    avgRebill: 0,
    description:
      'Probiotic supplement designed to support oral health with beneficial bacteria strains for teeth and gums.',
    vendorUrl: 'https://prodentim.com',
    affiliateUrl: hopLink('prodentim'),
  },
  {
    name: 'Glucotrust',
    vendor: 'glucotrust',
    category: 'Health & Fitness',
    gravity: 150,
    initialPrice: 69,
    avgRebill: 0,
    description:
      'Dietary supplement with a blend of natural ingredients designed to support healthy blood sugar levels.',
    vendorUrl: 'https://glucotrust.com',
    affiliateUrl: hopLink('glucotrust'),
  },
  {
    name: 'Yoga Burn',
    vendor: 'yogaburn',
    category: 'Health & Fitness',
    gravity: 120,
    initialPrice: 47,
    avgRebill: 0,
    description:
      'Dynamic sequencing yoga program for women that adapts and increases in challenge as fitness improves.',
    vendorUrl: 'https://yoga-burn.net',
    affiliateUrl: hopLink('yogaburn'),
  },
  // ── E-business & E-marketing ────────────────────────────────────────────────
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
    affiliateUrl: hopLink('forextrendy'),
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
    affiliateUrl: hopLink('jcfilippo'),
  },
  {
    name: 'Commission Hero',
    vendor: 'commhero',
    category: 'E-business & E-marketing',
    gravity: 95,
    initialPrice: 997,
    avgRebill: 0,
    description:
      'High-ticket affiliate marketing course teaching Facebook ad strategies for ClickBank product promotion.',
    vendorUrl: 'https://commissionhero.com',
    affiliateUrl: hopLink('commhero'),
  },
  {
    name: 'Perpetual Income 365',
    vendor: 'pi365',
    category: 'E-business & E-marketing',
    gravity: 130,
    initialPrice: 47,
    avgRebill: 47,
    description:
      'Affiliate marketing system built around a plug-and-play email funnel for generating recurring commissions.',
    vendorUrl: 'https://perpetualincome365.com',
    affiliateUrl: hopLink('pi365'),
  },
  // ── Self-Help ───────────────────────────────────────────────────────────────
  {
    name: 'Manifestation Magic',
    vendor: 'mmanifest',
    category: 'Self-Help',
    gravity: 100,
    initialPrice: 37,
    avgRebill: 27,
    description:
      'Audio tracks combining NLP techniques and brainwave entrainment designed for personal development and mindset shifts.',
    vendorUrl: 'https://manifestationmagic.co',
    affiliateUrl: hopLink('mmanifest'),
  },
  {
    name: 'Billionaire Brain Wave',
    vendor: 'billbrainwave',
    category: 'Self-Help',
    gravity: 160,
    initialPrice: 39,
    avgRebill: 0,
    description:
      'Audio program claiming to activate theta brain waves associated with creativity and intuition for personal success.',
    vendorUrl: 'https://billionairebrainwave.com',
    affiliateUrl: hopLink('billbrainwave'),
  },
  {
    name: 'His Secret Obsession',
    vendor: 'hissecretobs',
    category: 'Self-Help',
    gravity: 130,
    initialPrice: 47,
    avgRebill: 0,
    description:
      'Relationship guide for women focusing on understanding male psychology and building deeper emotional connections.',
    vendorUrl: 'https://hissecretobsession.com',
    affiliateUrl: hopLink('hissecretobs'),
  },
  // ── Pets & Animals ──────────────────────────────────────────────────────────
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
    affiliateUrl: hopLink('adrianemoore'),
  },
  {
    name: 'Cat Spraying No More',
    vendor: 'catspraying',
    category: 'Pets & Animals',
    gravity: 50,
    initialPrice: 37,
    avgRebill: 0,
    description:
      'Guide to understanding and stopping cat spraying behavior using veterinarian-informed techniques.',
    vendorUrl: 'https://catsprayingnomore.com',
    affiliateUrl: hopLink('catspraying'),
  },
  // ── Home & Garden ───────────────────────────────────────────────────────────
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
    affiliateUrl: hopLink('tedsplans'),
  },
  {
    name: 'Power Efficiency Guide',
    vendor: 'pefficguide',
    category: 'Home & Garden',
    gravity: 60,
    initialPrice: 49,
    avgRebill: 0,
    description:
      'DIY guide to building a home power generation device to reduce electricity bills.',
    vendorUrl: 'https://powerefficiencyguide.com',
    affiliateUrl: hopLink('pefficguide'),
  },
  // ── Spirituality, New Age & Alternative Beliefs ─────────────────────────────
  {
    name: 'Numerologist',
    vendor: 'numerolgst',
    category: 'Spirituality, New Age & Alternative Beliefs',
    gravity: 90,
    initialPrice: 37,
    avgRebill: 19,
    description:
      'Personalized numerology readings and reports based on birth date and name analysis.',
    vendorUrl: 'https://numerologist.com',
    affiliateUrl: hopLink('numerolgst'),
  },
  // ── Education & Languages ───────────────────────────────────────────────────
  {
    name: 'Rocket Languages',
    vendor: 'rocketlang',
    category: 'Languages',
    gravity: 70,
    initialPrice: 99,
    avgRebill: 0,
    description:
      'Interactive language learning software covering 14 languages with speech recognition and cultural lessons.',
    vendorUrl: 'https://www.rocketlanguages.com',
    affiliateUrl: hopLink('rocketlang'),
  },
  // ── Cooking, Food & Wine ────────────────────────────────────────────────────
  {
    name: 'Metabolic Cooking',
    vendor: 'metacooking',
    category: 'Cooking, Food & Wine',
    gravity: 55,
    initialPrice: 29,
    avgRebill: 0,
    description:
      'Collection of fat-burning recipes designed around the metabolic thermo-charge of specific food combinations.',
    vendorUrl: 'https://metaboliccooking.com',
    affiliateUrl: hopLink('metacooking'),
  },
  // ── Sports ──────────────────────────────────────────────────────────────────
  {
    name: 'Vert Shock',
    vendor: 'vertshock',
    category: 'Sports',
    gravity: 65,
    initialPrice: 67,
    avgRebill: 0,
    description:
      'Vertical jump training program using plyometrics to increase jumping height for basketball players.',
    vendorUrl: 'https://vertshock.com',
    affiliateUrl: hopLink('vertshock'),
  },
  // ── Software & Services ─────────────────────────────────────────────────────
  {
    name: 'VideoProc Converter',
    vendor: 'videoproc',
    category: 'Software & Services',
    gravity: 45,
    initialPrice: 45,
    avgRebill: 0,
    description:
      'GPU-accelerated video processing software for converting, editing, and downloading videos.',
    vendorUrl: 'https://www.videoproc.com',
    affiliateUrl: hopLink('videoproc'),
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

/**
 * Canonical slug for a ClickBank product, used as the key in `/go/[slug]`
 * outbound tracking links. Lowercased, alphanum-and-dash, stopword-free.
 * Example: "Custom Keto Diet" → "custom-keto-diet".
 */
export function productSlug(product: Pick<ClickBankProduct, 'name'>): string {
  return product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Look up a fallback/known product by its canonical slug. Used by the
 * /go/[slug] redirect route to resolve a slug to an affiliate URL.
 *
 * Returns undefined if no product matches. Callers should treat missing
 * lookups as a 404.
 */
export function getProductBySlug(slug: string): ClickBankProduct | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '')
  return FALLBACK_PRODUCTS.find((p) => productSlug(p) === normalized)
}

/**
 * Read-only view of the fallback product list. Exposed so other callers
 * (e.g., tracking, category hubs) can iterate without re-declaring the list.
 */
export function listFallbackProducts(): ReadonlyArray<ClickBankProduct> {
  return FALLBACK_PRODUCTS
}

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}
