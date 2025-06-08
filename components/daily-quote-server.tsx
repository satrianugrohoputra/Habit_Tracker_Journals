import { getQuoteForDate } from "@/utils/quote-utils"

interface DailyQuoteServerProps {
  currentDate?: Date
}

export default function DailyQuoteServer({ currentDate }: DailyQuoteServerProps) {
  const dailyQuote = getQuoteForDate(currentDate || new Date())

  return (
    <div className="py-6 px-4 text-center">
      <div className="max-w-2xl mx-auto px-6 py-4 rounded-lg bg-gray-50 border-l-4 border-teal-500">
        <blockquote className="text-gray-700">
          <p className="text-sm sm:text-base leading-relaxed">"{dailyQuote.text}"</p>
          {dailyQuote.author && (
            <footer className="mt-2 text-xs sm:text-sm text-gray-500 font-medium">— {dailyQuote.author}</footer>
          )}
        </blockquote>
      </div>
    </div>
  )
}
