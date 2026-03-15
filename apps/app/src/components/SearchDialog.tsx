'use client'

import { AnimatePresence, m } from 'framer-motion'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { Input } from './ui/input'
import Link from 'next/link'

type SearchResult = {
  id: string
  title: string
  slug: string
  excerpt?: string
  status: string
}

type SearchDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        // Query the search collection. The search plugin provides a /api/search endpoint.
        const response = await fetch(
          `/api/search?where[status][equals]=published&where[title][contains]=${encodeURIComponent(query)}&limit=5`,
        )
        const data = (await response.json()) as { docs: SearchResult[] }
        setResults(data.docs || [])
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[10vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

          <m.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl overflow-hidden rounded-2xl flex flex-col"
          >
            <div className="flex items-center p-4 border-b">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <Input
                ref={inputRef}
                placeholder="Search blog posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg h-auto p-0 bg-transparent"
              />
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-brand" />
                </div>
              ) : query && results.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No results found for &quot;{query}&quot;
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/blog/${result.slug}`}
                      onClick={onClose}
                      className="flex flex-col p-4 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">
                          {result.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                      </div>
                      {result.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {result.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  {query ? 'Keep typing to search...' : 'Try searching for topics like "Payload" or "Next.js"'}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-muted/30 border-t flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <span>Search Powered by Payload</span>
              <div className="flex gap-2">
                <kbd className="px-1.5 py-0.5 rounded border bg-background">ESC</kbd>
                <span>to close</span>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

export default SearchDialog

