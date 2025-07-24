"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import MyProductsDashboard from "@/components/dashboard/my-project-dashboard"
import IsThemely from "@/components/isThemely";
import {useAuthStore} from "@/lib/store/auth";
import {signOut} from "next-auth/react";
// import Loading from "@/app/view-all/[category]/loading";

export default function MyProducts() {
  const { isLoggedIn, user, setUser, setIsLoggedIn, hasHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const timer = setTimeout(() => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"

      if (!loggedIn) {
        router.push("/")
      } else {
        if (isLoggedIn && user) {
          setIsLoading(false)
        }
      }
    }, 150) // slight delay to allow user state to hydrate

    return () => clearTimeout(timer)
  }, [user, router, isLoggedIn])


  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    signOut({
      callbackUrl: '/', // or your desired post-logout page
      redirect: true,
    });
  }

  if (!hasHydrated) {
    return <IsThemely/>
  }

  // if (!user) {
  //   return <Loading/> // Will redirect in useEffect
  // }

  return (
    <DashboardLayout currentPage="my-products" user={user} onLogout={handleLogout}>
      <MyProductsDashboard user={user} />
    </DashboardLayout>
  )
}
