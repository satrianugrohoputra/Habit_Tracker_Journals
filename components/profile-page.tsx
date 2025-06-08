"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Camera, Check } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface ProfilePageProps {
  onBack: () => void
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, updateUser } = useUser()
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    timeZone: user.timeZone,
    notifications: { ...user.notifications },
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const timeZones = [
    "GMT-12:00",
    "GMT-11:00",
    "GMT-10:00",
    "GMT-09:00",
    "GMT-08:00",
    "GMT-07:00",
    "GMT-06:00",
    "GMT-05:00",
    "GMT-04:00",
    "GMT-03:00",
    "GMT-02:00",
    "GMT-01:00",
    "GMT+00:00",
    "GMT+01:00",
    "GMT+02:00",
    "GMT+03:00",
    "GMT+04:00",
    "GMT+05:00",
    "GMT+06:00",
    "GMT+07:00",
    "GMT+08:00",
    "GMT+09:00",
    "GMT+10:00",
    "GMT+11:00",
    "GMT+12:00",
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith("notifications.")) {
      const notificationKey = field.split(".")[1] as keyof typeof formData.notifications
      setFormData((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
    setHasChanges(true)
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string
        updateUser({ avatarUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    updateUser({
      fullName: formData.fullName,
      email: formData.email,
      timeZone: formData.timeZone,
      notifications: formData.notifications,
    })
    setHasChanges(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      timeZone: user.timeZone,
      notifications: { ...user.notifications },
    })
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {showSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-green-700 font-medium">Profile updated successfully!</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Profile Photo Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl font-semibold text-gray-600">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-colors"
                aria-label="Change photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <p className="text-sm text-gray-500 mt-2">Click the camera icon to change your photo</p>
          </div>

          {/* User Details Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select
                id="timeZone"
                value={formData.timeZone}
                onChange={(e) => handleInputChange("timeZone", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                {timeZones.map((tz) => (
                  <option key={tz} value={tz}>
                    ({tz}) {tz.replace("GMT", "UTC")}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Preferences */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications.dailyReminder}
                    onChange={(e) => handleInputChange("notifications.dailyReminder", e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Daily habit reminder email</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications.weeklySummary}
                    onChange={(e) => handleInputChange("notifications.weeklySummary", e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Weekly progress summary</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications.journalPrompt}
                    onChange={(e) => handleInputChange("notifications.journalPrompt", e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Nightly journaling prompt</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              disabled={!hasChanges}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
