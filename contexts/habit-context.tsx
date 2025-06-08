"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface HabitContextType {
  dailyJournal: Record<string, string>
  habitsList: string[]
  dailyHabits: Record<string, Record<string, boolean>>
  sleepData: Record<string, number>
  updateJournal: (date: string, content: string) => void
  addHabit: (habit: string) => void
  removeHabit: (habit: string) => void
  toggleHabit: (date: string, habit: string) => void
  updateSleep: (date: string, hours: number) => void
  getMonthlyStats: (month: string) => {
    totalHabits: number
    completedHabits: number
    averageSleep: number
    journalDays: number
  }
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

const defaultHabits = ["Drink Water", "Morning Stretch", "Read 20 minutes", "Write Journal", "Exercise"]

interface HabitProviderProps {
  children: React.ReactNode
  currentDate?: Date
}

export function HabitProvider({ children, currentDate }: HabitProviderProps) {
  const [dailyJournal, setDailyJournal] = useState<Record<string, string>>({})
  const [habitsList, setHabitsList] = useState<string[]>(defaultHabits)
  const [dailyHabits, setDailyHabits] = useState<Record<string, Record<string, boolean>>>({})
  const [sleepData, setSleepData] = useState<Record<string, number>>({})

  // Load data from localStorage on mount
  useEffect(() => {
    const savedJournal = localStorage.getItem("habitTracker_journal")
    const savedHabits = localStorage.getItem("habitTracker_habits")
    const savedDailyHabits = localStorage.getItem("habitTracker_dailyHabits")
    const savedSleep = localStorage.getItem("habitTracker_sleep")

    if (savedJournal) setDailyJournal(JSON.parse(savedJournal))
    if (savedHabits) setHabitsList(JSON.parse(savedHabits))
    if (savedDailyHabits) setDailyHabits(JSON.parse(savedDailyHabits))
    if (savedSleep) setSleepData(JSON.parse(savedSleep))
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("habitTracker_journal", JSON.stringify(dailyJournal))
  }, [dailyJournal])

  useEffect(() => {
    localStorage.setItem("habitTracker_habits", JSON.stringify(habitsList))
  }, [habitsList])

  useEffect(() => {
    localStorage.setItem("habitTracker_dailyHabits", JSON.stringify(dailyHabits))
  }, [dailyHabits])

  useEffect(() => {
    localStorage.setItem("habitTracker_sleep", JSON.stringify(sleepData))
  }, [sleepData])

  const updateJournal = (date: string, content: string) => {
    setDailyJournal((prev) => ({ ...prev, [date]: content }))
  }

  const addHabit = (habit: string) => {
    if (!habitsList.includes(habit)) {
      setHabitsList((prev) => [...prev, habit])
    }
  }

  const removeHabit = (habit: string) => {
    setHabitsList((prev) => prev.filter((h) => h !== habit))
    // Remove from all daily habits
    setDailyHabits((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((date) => {
        delete updated[date][habit]
      })
      return updated
    })
  }

  const toggleHabit = (date: string, habit: string) => {
    setDailyHabits((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [habit]: !prev[date]?.[habit],
      },
    }))
  }

  const updateSleep = (date: string, hours: number) => {
    console.log("Updating sleep for", date, "to", hours) // Debug log
    setSleepData((prev) => {
      const updated = { ...prev, [date]: hours }
      console.log("Updated sleep data:", updated) // Debug log
      return updated
    })
  }

  const getMonthlyStats = (month: string) => {
    const year = new Date().getFullYear()
    const monthNum = new Date(`${month} 1, ${year}`).getMonth()
    const daysInMonth = new Date(year, monthNum + 1, 0).getDate()

    let totalHabits = 0
    let completedHabits = 0
    let totalSleep = 0
    let sleepDays = 0
    let journalDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

      // Count habits
      const dayHabits = dailyHabits[date] || {}
      totalHabits += habitsList.length
      completedHabits += Object.values(dayHabits).filter(Boolean).length

      // Count sleep
      if (sleepData[date]) {
        totalSleep += sleepData[date]
        sleepDays++
      }

      // Count journal entries
      if (dailyJournal[date]) {
        journalDays++
      }
    }

    return {
      totalHabits,
      completedHabits,
      averageSleep: sleepDays > 0 ? totalSleep / sleepDays : 0,
      journalDays,
    }
  }

  return (
    <HabitContext.Provider
      value={{
        dailyJournal,
        habitsList,
        dailyHabits,
        sleepData,
        updateJournal,
        addHabit,
        removeHabit,
        toggleHabit,
        updateSleep,
        getMonthlyStats,
      }}
    >
      {children}
    </HabitContext.Provider>
  )
}

export function useHabit() {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error("useHabit must be used within a HabitProvider")
  }
  return context
}
