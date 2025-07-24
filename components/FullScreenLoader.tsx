// components/FullScreenLoader.tsx

import { useEffect } from "react"
import Image from "next/image"

export default function FullScreenLoader() {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-0">
      <div className="relative w-20 h-20">
        {/* Only top border is visible/spinning */}
        <div className="absolute inset-0 rounded-full border-[3px] border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/favicon.png"
            alt="Loading..."
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  )
}
