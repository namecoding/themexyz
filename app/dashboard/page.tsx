"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AccountDashboard from "@/components/dashboard/account-dashboard"
import IsThemely from "@/components/isThemely"
import { useAuthStore } from "@/lib/store/auth"
import { signOut, useSession } from "next-auth/react"
import ContentAdminDashboard from "@/components/admin/content-admin-dashboard"
import SuperAdminDashboard from "@/components/admin/super-admin-dashboard"
import AuthorAdminDashboard from "@/components/admin/author-admin-dashboard"
import FeedbackAdminDashboard from "@/components/admin/feedback-admin-dashboard"
import { SERVER_PUBLIC } from "@/lib/utils"

type User = {
  name: string
  email: string
  superAdmin?: boolean
  a?: boolean
  admin?: {
    permission: string[]
  }
}

export default function DashboardPage() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, hasHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [accessCode, setAccessCode] = useState("")
  const [selectedAdminType, setSelectedAdminType] = useState("")
  const [confirmedAdminType, setConfirmedAdminType] = useState("")
  const [accessDenied, setAccessDenied] = useState(false)
  const [checkingAccessCode, setCheckingAccessCode] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const savedAdminModalState = localStorage.getItem("isAdminModalOpen")
    const savedConfirmedAdmin = localStorage.getItem("confirmedAdminType")

    const timer = setTimeout(() => {
      if (!loggedIn) {
        router.push("/")
      } else if (isLoggedIn && user) {
        setIsLoading(false)
      }
    }, 150)

    if (savedAdminModalState === "true") {
      setIsAdminModalOpen(true)
    }

    if (savedConfirmedAdmin) {
      setConfirmedAdminType(savedConfirmedAdmin)
    }

    setIsLoading(false)

    return () => clearTimeout(timer)
  }, [router])

  // useEffect(() => {
  //   localStorage.setItem("isAdminModalOpen", isAdminModalOpen.toString())
  // }, [isAdminModalOpen])

  useEffect(() => {
    if (isAdminModalOpen) {
      localStorage.setItem("isAdminModalOpen", "true");
    } else {
      localStorage.removeItem("isAdminModalOpen");
    }
  }, [isAdminModalOpen]);


  useEffect(() => {
    if (confirmedAdminType) {
      localStorage.setItem("confirmedAdminType", confirmedAdminType)
    } else {
      localStorage.removeItem("confirmedAdminType")
    }
  }, [confirmedAdminType])

  useEffect(() => {
    if (isAdminModalOpen && !confirmedAdminType) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isAdminModalOpen, confirmedAdminType])

  const handleLogout__ = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    localStorage.removeItem("isAdminModalOpen")
    localStorage.removeItem("confirmedAdminType")
    signOut({ callbackUrl: "/", redirect: true })
  }

  const handleLogout = () => {
    //setUser(null)
    setIsLoggedIn(false)

    useAuthStore.getState().setIsLoggedIn(false);
    //useAuthStore.getState().setUser(null);
    //useAuthStore.getState().setToken(null);


    //localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdminModalOpen")
    localStorage.removeItem("confirmedAdminType")
    signOut({
      callbackUrl: '/', // or your desired post-logout page
      redirect: true,
    });
    return;

  }

  const toggleAdminModal = () => {
    if (confirmedAdminType) {
      setConfirmedAdminType("")
      setSelectedAdminType("")
      setAccessCode("")
      setIsAdminModalOpen(false)
      setAccessDenied(false)
      return
    }

    if (isAdminModalOpen) {
      setIsAdminModalOpen(false)
      setSelectedAdminType("")
      setAccessCode("")
      setAccessDenied(false)
    } else {
      setIsAdminModalOpen(true)
      setSelectedAdminType("")
      setConfirmedAdminType("")
      setAccessCode("")
      setAccessDenied(false)
    }
  }



  const verifyAccessCodeWithBackend = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      setCheckingAccessCode(true)

      const response = await fetch(`${SERVER_PUBLIC}/admin/verify-access-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: accessCode,
          adminType: selectedAdminType,
        }),
      })

      const result = await response.json()

      setCheckingAccessCode(false) // ✅ stop loader after successful response

      if (!response.ok) throw new Error(result?.message || "Failed to verify")

      return result.valid === true
    } catch (error) {
      //console.log("Access code verification failed:", error)
      setCheckingAccessCode(false) // ✅ stop loader on failure too
      return false
    }
  }



  const renderAdminDashboard = (type: string) => {
    switch (type) {
      case "super_admin":
        return <SuperAdminDashboard currentUser={user} onClose={() => setIsAdminModalOpen(false)} />
      case "feedback_admin":
        return <FeedbackAdminDashboard currentUser={user} onClose={() => setIsAdminModalOpen(false)} />
      case "author_admin":
        return <AuthorAdminDashboard currentUser={user} onClose={() => setIsAdminModalOpen(false)} />
      case "content_admin":
        return <ContentAdminDashboard currentUser={user} onClose={() => setIsAdminModalOpen(false)} />
      default:
        return <AccountDashboard user={user} />
    }
  }

  if (!hasHydrated) return <IsThemely />

  return (
    <DashboardLayout
      currentPage="account"
      user={user}
      onLogout={handleLogout}
      onSwitchAdmin={user?.admin?.permission ? toggleAdminModal : undefined}
      isAdminModalOpen={isAdminModalOpen}
    >
      {/* Admin Modal */}
      {user?.admin?.permission && isAdminModalOpen && !confirmedAdminType && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Admin Access</h2>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full border rounded-md p-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <select
              value={selectedAdminType}
              onChange={(e) => setSelectedAdminType(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select admin panel</option>
              {user?.admin?.permission?.map((role) => (
                <option key={role} value={role}>

                  {role
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </option>
              ))}
            </select>
            {accessDenied && (
              <p className="text-red-500 text-sm">Invalid access code</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  setIsAdminModalOpen(false)
                  setAccessCode("")
                  setSelectedAdminType("")
                  setConfirmedAdminType("")
                  setAccessDenied(false)
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                disabled={!accessCode || !selectedAdminType}
                // onClick={() => {
                //   if (verifyAccessCode()) {
                //     setConfirmedAdminType(selectedAdminType)
                //     setAccessDenied(false)
                //   } else {
                //     setAccessDenied(true)
                //     setConfirmedAdminType("")
                //   }
                // }}
                onClick={async () => {
                  const isValid = await verifyAccessCodeWithBackend()
                  if (isValid) {
                    setConfirmedAdminType(selectedAdminType)
                    setAccessDenied(false)
                  } else {
                    setAccessDenied(true)
                    setConfirmedAdminType("")
                  }
                }}

              >
                {
                  checkingAccessCode ? "Verifying..." : "Continue"
                }

              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin or Account Dashboard */}
      {user?.admin?.permission && isAdminModalOpen && confirmedAdminType
        ? renderAdminDashboard(confirmedAdminType)
        : <AccountDashboard user={user} />}
    </DashboardLayout>
  )
}
