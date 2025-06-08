"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useHabit } from "@/contexts/habit-context"

interface MemorableMomentsCardProps {
  currentDate: Date
}

export default function MemorableMomentsCard({ currentDate }: MemorableMomentsCardProps) {
  const { dailyJournal, updateJournal } = useHabit()
  const [content, setContent] = useState("")
  const dateKey = currentDate.toISOString().split("T")[0]

  useEffect(() => {
    setContent(dailyJournal[dateKey] || "")
  }, [dailyJournal, dateKey])

  const handleSave = () => {
    updateJournal(dateKey, content)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }
  }

  const isToday = () => {
    const today = new Date()
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isFutureDate = () => {
    const today = new Date()
    return currentDate > today
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Memorable Moments
        {!isToday() && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
          </span>
        )}
      </h2>
      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={
            isFutureDate()
              ? "This day hasn't arrived yet..."
              : isToday()
                ? "Write today's highlight..."
                : "What was memorable about this day?"
          }
          className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          rows={3}
          disabled={isFutureDate()}
        />
        <div className="text-xs text-gray-500">
          {isFutureDate()
            ? "You can't write about future days yet"
            : "Press Ctrl+Enter to save, or click outside to auto-save"}
        </div>
      </div>
    </div>
  )
}
