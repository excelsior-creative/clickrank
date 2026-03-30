/**
 * Humanization Service
 *
 * Post-processes AI-generated content to make it appear more human-written.
 * Removes obvious AI patterns and adds natural variations.
 * Ported from excelsior-creative-website.
 */

type HumanizationLevel = 'conservative' | 'moderate'

const AI_PATTERNS: Array<[RegExp, string | ((match: string) => string), number]> = [
  [/\s*--\s*/g, ', ', 1.0],
  [/\s*—\s*/g, ', ', 0.8],

  [/\bIn today's digital landscape,?\s*/gi, '', 1.0],
  [/\bIn today's fast-paced world,?\s*/gi, '', 1.0],
  [/\bIn this article,?\s*(we will|we'll|I will|I'll)\s*/gi, "We'll ", 1.0],
  [/\bLet's dive in\.?\s*/gi, '', 1.0],
  [/\bLet's get started\.?\s*/gi, '', 1.0],
  [/\bWithout further ado,?\s*/gi, '', 1.0],

  [/\bFurthermore,\s*/gi, () => randomChoice(['Also, ', 'Plus, ', 'And ']), 0.9],
  [/\bAdditionally,\s*/gi, () => randomChoice(['Also, ', 'Plus, ', '']), 0.9],
  [/\bMoreover,\s*/gi, () => randomChoice(['Also, ', 'And ', '']), 0.9],
  [/\bConsequently,\s*/gi, () => randomChoice(['So, ', 'As a result, ']), 0.9],
  [/\bNevertheless,\s*/gi, () => randomChoice(['Still, ', 'But ', 'Even so, ']), 0.9],
  [/\bIn conclusion,\s*/gi, () => randomChoice(['So, ', 'Bottom line: ', '']), 0.9],
  [/\bTo summarize,\s*/gi, () => randomChoice(['So, ', 'In short, ', '']), 0.9],

  [/\bIt's important to note that\s*/gi, '', 1.0],
  [/\bIt's worth noting that\s*/gi, '', 1.0],
  [/\bIt should be noted that\s*/gi, '', 1.0],
  [/\bIt goes without saying that\s*/gi, '', 1.0],
  [/\bNeedless to say,?\s*/gi, '', 1.0],
  [/\bAs mentioned earlier,?\s*/gi, '', 0.8],
  [/\bAs we discussed,?\s*/gi, '', 0.8],

  [/\butilize\b/gi, 'use', 1.0],
  [/\butilizing\b/gi, 'using', 1.0],
  [/\butilization\b/gi, 'use', 1.0],
  [/\bleverage\b/gi, () => randomChoice(['use', 'take advantage of']), 0.9],
  [/\bleveraging\b/gi, () => randomChoice(['using', 'taking advantage of']), 0.9],
  [/\bfacilitate\b/gi, 'help', 0.9],
  [/\bfacilitating\b/gi, 'helping', 0.9],
  [/\bcommence\b/gi, 'start', 1.0],
  [/\bcommencing\b/gi, 'starting', 1.0],
  [/\bprocure\b/gi, 'get', 1.0],
  [/\bascertain\b/gi, 'find out', 1.0],
  [/\bsubsequently\b/gi, 'then', 0.9],
  [/\bprior to\b/gi, 'before', 0.9],
  [/\bin order to\b/gi, 'to', 0.9],
  [/\bdue to the fact that\b/gi, 'because', 1.0],
  [/\bat this point in time\b/gi, 'now', 1.0],
  [/\bin the event that\b/gi, 'if', 1.0],

  [/\bAbsolutely!\s*/gi, '', 0.9],
  [/\bGreat question!\s*/gi, '', 1.0],
  [/\bThat's a great point!\s*/gi, '', 1.0],
]

const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bdo not\b/gi, "don't"],
  [/\bdoes not\b/gi, "doesn't"],
  [/\bdid not\b/gi, "didn't"],
  [/\bwill not\b/gi, "won't"],
  [/\bwould not\b/gi, "wouldn't"],
  [/\bcould not\b/gi, "couldn't"],
  [/\bshould not\b/gi, "shouldn't"],
  [/\bcan not\b/gi, "can't"],
  [/\bcannot\b/gi, "can't"],
  [/\bis not\b/gi, "isn't"],
  [/\bare not\b/gi, "aren't"],
  [/\bwas not\b/gi, "wasn't"],
  [/\bwere not\b/gi, "weren't"],
  [/\bhas not\b/gi, "hasn't"],
  [/\bhave not\b/gi, "haven't"],
  [/\bhad not\b/gi, "hadn't"],
  [/\bit is\b/gi, "it's"],
  [/\bthat is\b/gi, "that's"],
  [/\bwhat is\b/gi, "what's"],
  [/\bwho is\b/gi, "who's"],
  [/\bwhere is\b/gi, "where's"],
  [/\bthere is\b/gi, "there's"],
  [/\bhere is\b/gi, "here's"],
  [/\blet us\b/gi, "let's"],
  [/\bI am\b/g, "I'm"],
  [/\bI have\b/g, "I've"],
  [/\bI will\b/g, "I'll"],
  [/\bI would\b/g, "I'd"],
  [/\bwe are\b/gi, "we're"],
  [/\bwe have\b/gi, "we've"],
  [/\bwe will\b/gi, "we'll"],
  [/\bthey are\b/gi, "they're"],
  [/\bthey have\b/gi, "they've"],
  [/\bthey will\b/gi, "they'll"],
  [/\byou are\b/gi, "you're"],
  [/\byou have\b/gi, "you've"],
  [/\byou will\b/gi, "you'll"],
]

export function humanizeContent(markdown: string, level: HumanizationLevel = 'moderate'): string {
  let result = markdown

  for (const [pattern, replacement, probability] of AI_PATTERNS) {
    if (Math.random() < probability) {
      result = result.replace(pattern, (match) => {
        if (typeof replacement === 'function') {
          return replacement(match)
        }
        return replacement
      })
    }
  }

  if (level === 'moderate') {
    for (const [pattern, replacement] of CONTRACTIONS) {
      if (Math.random() < 0.8) {
        result = result.replace(pattern, replacement)
      }
    }
  }

  result = cleanupArtifacts(result)

  if (level === 'moderate') {
    result = addNaturalVariations(result)
  }

  return result
}

function cleanupArtifacts(text: string): string {
  let result = text
  result = result.replace(/  +/g, ' ')
  result = result.replace(/\s+([.,;:!?])/g, '$1')
  result = result.replace(/\n{3,}/g, '\n\n')
  result = result.replace(/\.\s+([a-z])/g, (_, letter) => `. ${letter.toUpperCase()}`)
  result = result.replace(/[ \t]+$/gm, '')
  result = result.replace(/,\s*and\s+/gi, (match) => (Math.random() < 0.3 ? ' and ' : match))
  return result
}

function addNaturalVariations(text: string): string {
  let result = text
  const paragraphs = result.split(/\n\n/)
  const modifiedParagraphs = paragraphs.map((para) => {
    if (Math.random() < 0.05 && para.length > 100) {
      para = para.replace(
        /(?<=\. )However,/,
        Math.random() < 0.5 ? 'But' : 'However,',
      )
    }
    return para
  })
  result = modifiedParagraphs.join('\n\n')

  if (Math.random() < 0.1) {
    const casualPhrases = ['Look, ', "Here's the thing: ", 'Honestly, ', 'The truth is, ']
    result = result.replace(
      /\n\n([A-Z][^.]+important|[A-Z][^.]+key|[A-Z][^.]+critical)/,
      (match, sentence) => {
        const phrase = randomChoice(casualPhrases)
        return `\n\n${phrase}${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`
      },
    )
  }

  return result
}

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}
