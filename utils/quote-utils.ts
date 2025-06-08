import { quotes, type Quote } from "@/data/quotes"

/**
 * Gets a deterministic quote based on a specific date
 * This ensures the same quote is shown for the same date
 */
export function getQuoteForDate(date: Date): Quote {
  const dayOfYear = getDayOfYear(date)
  const quoteIndex = dayOfYear % quotes.length
  return quotes[quoteIndex]
}

/**
 * Gets a deterministic quote based on the current date
 * This ensures the same quote is shown throughout the day
 */
export function getQuoteForToday(): Quote {
  return getQuoteForDate(new Date())
}

/**
 * Calculate the day of the year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}
