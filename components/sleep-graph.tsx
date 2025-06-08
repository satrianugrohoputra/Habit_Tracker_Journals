"use client"

import type React from "react"

import { useState } from "react"
import { useHabit } from "@/contexts/habit-context"

interface SleepGraphProps {
  currentDate: Date
}

export default function SleepGraph({ currentDate }: SleepGraphProps) {
  const { sleepData, updateSleep } = useHabit()
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  // Generate last 30 days data based on the current date
  const getLast30Days = () => {
    const days = []
    const today = new Date(currentDate)

    // Calculate the actual number of days to show (30 days back from current date)
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split("T")[0]

      // Get the actual day of the month
      const dayOfMonth = date.getDate()

      days.push({
        day: dayOfMonth,
        date: dateKey,
        hours: sleepData[dateKey] || 0, // Default to 0 if no data
        label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date,
      })
    }
    return days
  }

  const days = getLast30Days()

  const handleDayClick = (dateKey: string, currentHours: number) => {
    setEditingDay(dateKey)
    setEditValue(currentHours.toString())
  }

  const handleSave = (dateKey: string) => {
    const hours = Number.parseFloat(editValue) || 0
    if (hours >= 0 && hours <= 24) {
      updateSleep(dateKey, hours)
    }
    setEditingDay(null)
    setEditValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent, dateKey: string) => {
    if (e.key === "Enter") {
      handleSave(dateKey)
    } else if (e.key === "Escape") {
      setEditingDay(null)
      setEditValue("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  // Group days into rows for the grid display
  // We'll create 3 rows of 10 days each
  const dayRows = [
    days.slice(0, 10), // First 10 days
    days.slice(10, 20), // Next 10 days
    days.slice(20, 30), // Last 10 days
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Sleep Hours Last 30 Days</h2>

      {/* Graph */}
      <div className="mb-6">
        <div className="relative h-48 bg-gray-50 rounded-lg p-4">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-2 text-xs text-gray-500">12h</div>
          <div className="absolute left-2 top-8 text-xs text-gray-500">9h</div>
          <div className="absolute left-2 top-16 text-xs text-gray-500">6h</div>
          <div className="absolute left-2 top-24 text-xs text-gray-500">3h</div>
          <div className="absolute left-2 bottom-2 text-xs text-gray-500">0h</div>

          {/* Graph area */}
          <div className="ml-8 h-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Horizontal grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.2" />
              ))}

              {/* Data line */}
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="0.3"
                points={days
                  .map((day, index) => {
                    const x = (index / (days.length - 1)) * 100
                    const y = 100 - (day.hours / 12) * 100
                    return `${x},${y}`
                  })
                  .join(" ")}
              />

              {/* Data points */}
              {days.map((day, index) => {
                const x = (index / (days.length - 1)) * 100
                const y = 100 - (day.hours / 12) * 100
                return <circle key={index} cx={`${x}%`} cy={`${y}%`} r="1" fill="#0d9488" stroke="none" />
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Data input grid */}
      <div className="space-y-1">
        {dayRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-10 gap-1 text-xs">
            {row.map((day, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="text-center">
                <div className="text-gray-500 mb-1 font-medium">{day.day}</div>
                {editingDay === day.date ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={handleInputChange}
                    onBlur={() => handleSave(day.date)}
                    onKeyDown={(e) => handleKeyDown(e, day.date)}
                    className="w-full p-1 text-xs border border-teal-500 rounded text-center focus:outline-none focus:ring-1 focus:ring-teal-500"
                    min="0"
                    max="24"
                    step="0.5"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => handleDayClick(day.date, day.hours)}
                    className="w-full p-1 text-xs bg-gray-100 hover:bg-teal-100 rounded transition-colors text-gray-700 font-medium"
                  >
                    {day.hours || "0"}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-4 text-center">Click on any day to edit sleep hours</div>
    </div>
  )
}
