// components/auth/RehydrateAuth.tsx
"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth"
import {baseUrl} from "@/lib/utils";

export default function RehydrateAuth() {


    useEffect(() => {
        const token = localStorage.getItem("token")
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

        if (isLoggedIn && token) {
            useAuthStore.getState().setIsLoggedIn(true)
            useAuthStore.getState().setToken(token)

            fetch(`${baseUrl}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        useAuthStore.getState().setUser(data.user)
                        console.log(data.user, 'hey i am here')
                    } else {
                        useAuthStore.getState().setIsLoggedIn(false)
                        localStorage.removeItem("token")
                        localStorage.removeItem("isLoggedIn")
                    }

                    // ✅ After finishing login or fallback
                    useAuthStore.getState().setHasHydrated(true)

                })
                .catch(() => {
                    useAuthStore.getState().setHasHydrated(true)
                })
        } else {
            useAuthStore.getState().setHasHydrated(true)
        }
    }, [])


    return null
}
