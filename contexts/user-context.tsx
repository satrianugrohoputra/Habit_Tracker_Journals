"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  timeZone: string
  notifications: {
    dailyReminder: boolean
    weeklySummary: boolean
    journalPrompt: boolean
  }
}

interface UserContextType {
  user: User
  updateUser: (updates: Partial<User>) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const defaultUser: User = {
  id: "1",
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  avatarUrl: null,
  timeZone: "GMT+07:00",
  notifications: {
    dailyReminder: true,
    weeklySummary: true,
    journalPrompt: false,
  },
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("habitTracker_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user data:", error)
      }
    }
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("habitTracker_user", JSON.stringify(user))
  }, [user])

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  const logout = () => {
    // Clear user data
    localStorage.removeItem("habitTracker_user")
    localStorage.removeItem("habitTracker_journal")
    localStorage.removeItem("habitTracker_habits")
    localStorage.removeItem("habitTracker_dailyHabits")
    localStorage.removeItem("habitTracker_sleep")

    // Reset to default user
    setUser(defaultUser)

    // In a real app, you would redirect to login page
    console.log("User logged out")
  }

  return <UserContext.Provider value={{ user, updateUser, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
