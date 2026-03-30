import { Schema, Type } from '@google/genai'

export const ClickBankProductSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Product name' },
    vendor: { type: Type.STRING, description: 'Vendor/publisher name' },
    category: { type: Type.STRING, description: 'ClickBank category' },
    gravity: { type: Type.NUMBER, description: 'Gravity score (sales velocity)' },
    initialPrice: { type: Type.NUMBER, description: 'Initial sale price' },
    avgRebill: { type: Type.NUMBER, description: 'Average rebill amount if subscription' },
    description: { type: Type.STRING, description: 'Product description' },
    vendorUrl: { type: Type.STRING, description: 'Vendor URL / hop link base' },
    affiliateUrl: { type: Type.STRING, description: 'Affiliate marketplace URL' },
  },
  required: ['name', 'vendor', 'category', 'gravity', 'description'],
}

export const GeneratedArticleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'SEO-optimized article title (60-70 chars)' },
    slug: { type: Type.STRING, description: 'kebab-case-slug-from-title' },
    excerpt: {
      type: Type.STRING,
      description: 'Compelling excerpt under 160 characters',
    },
    content: {
      type: Type.STRING,
      description: 'Full article in Markdown format with ## for H2 and ### for H3',
    },
    metaTitle: { type: Type.STRING, description: 'SEO title tag (max 60 chars)' },
    metaDescription: {
      type: Type.STRING,
      description: 'Meta description (max 160 chars)',
    },
    keywords: { type: Type.STRING, description: 'comma, separated, relevant, keywords' },
  },
  required: ['title', 'slug', 'excerpt', 'content', 'metaTitle', 'metaDescription', 'keywords'],
}

export const TagSuggestionsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tagIds: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: 'Array of tag IDs from the available tags list',
    },
  },
  required: ['tagIds'],
}
