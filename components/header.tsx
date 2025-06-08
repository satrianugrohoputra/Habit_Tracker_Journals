"use client"

import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import UserDropdown from "./user-dropdown"

interface HeaderProps {
  onProfileClick: () => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

export default function Header({ onProfileClick, currentDate, onDateChange }: HeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateMobile = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const handlePreviousDay = () => {
    const previousDay = new Date(currentDate)
    previousDay.setDate(previousDay.getDate() - 1)
    onDateChange(previousDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(currentDate)
    nextDay.setDate(nextDay.getDate() + 1)
    onDateChange(nextDay)
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 hidden sm:block">HabitTracker</span>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous day"
            type="button"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="text-center min-w-0">
            {/* Desktop date */}
            <h1 className="text-lg font-medium text-gray-900 hidden sm:block whitespace-nowrap">
              {formatDate(currentDate)}
            </h1>
            {/* Mobile date */}
            <h1 className="text-sm font-medium text-gray-900 sm:hidden">{formatDateMobile(currentDate)}</h1>
            {/* Date indicator */}
            <div className="text-xs text-teal-600 font-medium">Today</div>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next day"
            type="button"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* User Dropdown */}
        <UserDropdown onProfileClick={onProfileClick} />
      </div>
    </header>
  )
}
