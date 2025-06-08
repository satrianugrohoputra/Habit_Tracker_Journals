"use client"

import { useState, useEffect } from "react"
import { HabitProvider } from "@/contexts/habit-context"
import { UserProvider } from "@/contexts/user-context"
import Header from "@/components/header"
import MemorableMomentsCard from "@/components/memorable-moments-card"
import HabitList from "@/components/habit-list"
import SleepGraph from "@/components/sleep-graph"
import MonthlyView from "@/components/monthly-view"
import ProfilePage from "@/components/profile-page"
import { ChevronDown } from "lucide-react"
import DailyQuoteServer from "@/components/daily-quote-server"

export default function Dashboard() {
  // Set a fixed date for development/demo purposes - June 8, 2025
  const fixedDate = new Date(2025, 5, 8) // Month is 0-indexed, so 5 = June
  const [currentView, setCurrentView] = useState<"today" | "monthly" | "profile">("today")
  const [currentDate, setCurrentDate] = useState<Date>(fixedDate)

  // Check for date change at midnight
  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const storedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

      if (today.getTime() !== storedDate.getTime()) {
        setCurrentDate(now)
      }
    }

    // For demo purposes, we'll use the fixed date instead of checking
    // checkDateChange()
    // const interval = setInterval(checkDateChange, 60000)
    // return () => clearInterval(interval)
  }, [currentDate])

  const handleProfileClick = () => {
    setCurrentView("profile")
  }

  const handleBackToDashboard = () => {
    setCurrentView("today")
  }

  const handleDateChange = (newDate: Date) => {
    console.log("Date changed to:", newDate.toISOString()) // Debug log
    setCurrentDate(newDate)
  }

  return (
    <UserProvider>
      <HabitProvider currentDate={currentDate}>
        <div className="min-h-screen bg-white">
          {currentView === "profile" ? (
            <ProfilePage onBack={handleBackToDashboard} />
          ) : (
            <>
              <Header onProfileClick={handleProfileClick} currentDate={currentDate} onDateChange={handleDateChange} />

              {/* View Toggle */}
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setCurrentView("today")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === "today" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentView("monthly")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === "monthly"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Monthly View
                  </button>
                </div>

                {currentView === "today" ? (
                  <div className="space-y-8">
                    <MemorableMomentsCard currentDate={currentDate} />
                    <HabitList currentDate={currentDate} />
                    <SleepGraph currentDate={currentDate} />

                    {/* Footer */}
                    <div className="py-6">
                      <hr className="border-gray-200 mb-6" />
                      <DailyQuoteServer currentDate={currentDate} />
                      <div className="text-center pt-2">
                        <button
                          onClick={() => setCurrentView("monthly")}
                          className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2 mx-auto"
                        >
                          View Monthly Summary
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <MonthlyView currentDate={currentDate} />
                )}
              </div>
            </>
          )}
        </div>
      </HabitProvider>
    </UserProvider>
  )
}
