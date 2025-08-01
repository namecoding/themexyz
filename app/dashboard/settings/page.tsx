"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SettingsDashboard from "@/components/dashboard/settings-dashboard"
import IsThemely from "@/components/isThemely";
import { useAuthStore } from "@/lib/store/auth";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const { isLoggedIn, user, setUser, setIsLoggedIn, hasHydrated } = useAuthStore()
  const router = useRouter()
  // const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  const handleSwitchAdmin = () => {
    setIsAdminModalOpen(true)
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const savedAdminModalState = localStorage.getItem("isAdminModalOpen")
    const savedConfirmedAdmin = localStorage.getItem("confirmedAdminType")

    const timer = setTimeout(() => {
      if (!loggedIn) {
        router.push("/")
      } else {
        if (isLoggedIn && user) {
          setIsLoading(false)
        }
      }
    }, 150) // slight delay to allow user state to hydrate

    if (savedAdminModalState === "true") {
      setIsAdminModalOpen(true)
    }

    if (savedConfirmedAdmin) {
      //setConfirmedAdminType(savedConfirmedAdmin)
    }

    setIsLoading(false)

    return () => clearTimeout(timer)
  }, [user, router, isLoggedIn])


  const handleLogout = () => {
    //setUser(null)
    setIsLoggedIn(false)

    useAuthStore.getState().setIsLoggedIn(false);
    // useAuthStore.getState().setUser(null);
    // useAuthStore.getState().setToken(null);


    //localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdminModalOpen")
    localStorage.removeItem("confirmedAdminType")
    signOut({
      callbackUrl: '/', // or your desired post-logout page
      redirect: true,
    });

  }

  if (!hasHydrated) {
    return <IsThemely />
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <DashboardLayout currentPage="settings" user={user} onLogout={handleLogout} isAdminModalOpen={isAdminModalOpen}
      onSwitchAdmin={handleSwitchAdmin}>
      <SettingsDashboard user={user} />
    </DashboardLayout>
  )
}
