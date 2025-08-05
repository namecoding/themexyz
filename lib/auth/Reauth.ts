import { useAuthStore } from "@/lib/store/auth"
import { SERVER_PUBLIC } from "@/lib/utils"

export async function Reauth() {
    const token = localStorage.getItem("token")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn && token) {
        const auth = useAuthStore.getState()
        auth.setIsLoggedIn(true)
        auth.setToken(token)

        try {
            const res = await fetch(`${SERVER_PUBLIC}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()

            if (data.success) {
                auth.setUser(data.user)
            } else {
                auth.setIsLoggedIn(false)
                localStorage.removeItem("token")
                localStorage.removeItem("isLoggedIn")
            }
        } catch (err) {
            console.error("Auth rehydration failed", err)
        } finally {
            useAuthStore.getState().setHasHydrated(true)
        }
    } else {
        useAuthStore.getState().setHasHydrated(true)
    }
}
