"use client"

import { useState } from "react"
import { useHabit } from "@/contexts/habit-context"
import { Plus, MoreVertical, Trash2 } from "lucide-react"

interface HabitListProps {
  currentDate: Date
}

export default function HabitList({ currentDate }: HabitListProps) {
  const { habitsList, dailyHabits, toggleHabit, addHabit, removeHabit } = useHabit()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHabit, setNewHabit] = useState("")
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const dateKey = currentDate.toISOString().split("T")[0]
  const dayHabits = dailyHabits[dateKey] || {}

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit(newHabit.trim())
      setNewHabit("")
      setShowAddModal(false)
    }
  }

  const handleRemoveHabit = (habit: string) => {
    removeHabit(habit)
    setShowMenu(null)
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
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isToday() ? "Today's" : "Daily"} Habits
        {!isToday() && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
          </span>
        )}
      </h2>

      <div className="space-y-3 mb-6">
        {habitsList.map((habit) => (
          <div key={habit} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
            <label className="flex items-center gap-3 flex-1 cursor-pointer">
              <input
                type="checkbox"
                checked={dayHabits[habit] || false}
                onChange={() => !isFutureDate() && toggleHabit(dateKey, habit)}
                disabled={isFutureDate()}
                className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 disabled:opacity-50"
              />
              <span
                className={`text-sm font-medium transition-all ${
                  dayHabits[habit] ? "text-gray-500 line-through" : "text-gray-900"
                } ${isFutureDate() ? "opacity-50" : ""}`}
              >
                {habit}
              </span>
            </label>

            <div className="relative">
              <button
                onClick={() => setShowMenu(showMenu === habit ? null : habit)}
                className="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Habit options"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showMenu === habit && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => handleRemoveHabit(habit)}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Habit
      </button>

      {/* Add Habit Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Habit</h3>
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                placeholder="New habit name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddHabit}
                  className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
