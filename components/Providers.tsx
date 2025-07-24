// components/Providers.tsx
'use client'

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import RehydrateAuth from "@/components/auth/RehydrateAuth"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <RehydrateAuth />
            <Toaster position="top-right" reverseOrder={false} />
            {children}
        </SessionProvider>
    )
}
