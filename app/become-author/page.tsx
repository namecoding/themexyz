"use client"

import { useState, useEffect } from "react"
import BecomeAuthorLanding from "@/components/author/become-author-landing"
import ScreenLoading from "@/components/screenLoading";
import {useAuthStore} from "@/lib/store/auth";

export default function BecomeAuthorPage() {
  const { isLoggedIn, setIsLoggedIn, user, setUser, token, hasHydrated } = useAuthStore()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(()=>{
    console.log({ isLoggedIn, setIsLoggedIn, user, setUser, token, hasHydrated }, 'zurd')
  },[hasHydrated, user, isLoggedIn])

  if (!hasHydrated) {
    return (
      <ScreenLoading/>
    )
  }

  return <BecomeAuthorLanding />
}
