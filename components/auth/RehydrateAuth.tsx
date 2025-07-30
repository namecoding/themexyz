// components/auth/RehydrateAuth.tsx
"use client"

import { useEffect } from "react"
import { Reauth } from "@/lib/auth/Reauth"

export default function RehydrateAuth() {

    useEffect(() => {
        Reauth()
    }, [])

    return null
}
