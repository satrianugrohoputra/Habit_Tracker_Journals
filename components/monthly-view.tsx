"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useHabit } from "@/contexts/habit-context"
import DailyQuoteServer from "./daily-quote-server"

interface MonthlyViewProps {
  currentDate?: Date
}

export default function MonthlyView({ currentDate = new Date(2025, 5, 8) }: MonthlyViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const { dailyJournal, dailyHabits, habitsList, sleepData, getMonthlyStats } = useHabit()

  // Update current month when currentDate changes
  useEffect(() => {
    if (currentDate) {
      setCurrentMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    }
  }, [currentDate])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const formatMonth = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateKey = date.toISOString().split("T")[0]
      days.push({
        day,
        dateKey,
        date,
      })
    }

    return days
  }

  const getCompletedHabitsCount = (dateKey: string) => {
    const dayHabits = dailyHabits[dateKey] || {}
    return Object.values(dayHabits).filter(Boolean).length
  }

  const isCurrentDate = (dateKey: string) => {
    if (!currentDate) return false
    const currentDateKey = currentDate.toISOString().split("T")[0]
    return dateKey === currentDateKey
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDayClick = (dateKey: string) => {
    setSelectedDay(dateKey)
  }

  const stats = getMonthlyStats(monthNames[currentMonth.getMonth()])
  const days = getDaysInMonth()

  return (
    <div className="space-y-8">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900">{formatMonth(currentMonth)}</h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  onClick={() => handleDayClick(day.dateKey)}
                  className={`w-full h-full p-2 border rounded-lg transition-colors flex flex-col items-center justify-center ${
                    isCurrentDate(day.dateKey)
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">{day.day}</span>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: Math.min(getCompletedHabitsCount(day.dateKey), 3) }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    ))}
                  </div>
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-teal-600">
              {stats.completedHabits}/{stats.totalHabits}
            </div>
            <div className="text-sm text-gray-600">Total Habits Completed</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all"
                style={{ width: `${stats.totalHabits > 0 ? (stats.completedHabits / stats.totalHabits) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.averageSleep.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Average Sleep</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(stats.averageSleep / 12) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-purple-600">{stats.journalDays}</div>
            <div className="text-sm text-gray-600">Days with Journal Entry</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{
                  width: `${(stats.journalDays / new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Day Summary Modal */}
      {selectedDay && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSelectedDay(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {new Date(selectedDay).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Journal Entry */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Memorable Moment</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {dailyJournal[selectedDay] || "No entry for this day"}
                  </div>
                </div>

                {/* Habits */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Habits</h4>
                  <div className="space-y-2">
                    {habitsList.map((habit) => (
                      <div key={habit} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            dailyHabits[selectedDay]?.[habit] ? "bg-teal-600 border-teal-600" : "border-gray-300"
                          }`}
                        >
                          {dailyHabits[selectedDay]?.[habit] && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm text-gray-700">{habit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sleep */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sleep</h4>
                  <div className="text-sm text-gray-700">
                    {sleepData[selectedDay] ? `${sleepData[selectedDay]} hours` : "No sleep data"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="py-6">
        <hr className="border-gray-200 mb-6" />
        <DailyQuoteServer currentDate={currentDate} />
      </div>
    </div>
  )
}
