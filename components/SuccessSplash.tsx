/* SuccessSplash.tsx */
'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'

const LottiePlayer = dynamic(
    () => import('@lottiefiles/react-lottie-player').then(m => m.Player),
    { ssr: false }
)

/* assets */
const CONFETTI_SRC = '/audio/lf20_cbrbre30.json'
const RIBBON_SRC   = '/audio/ribbon.json'   // your local ribbon burst
const CLAP_SRC     = '/audio/clap.mp3'      // short, trimmed applause

interface Props {
    title?: string
    subtitle?: string
    onClose: () => void
}

export default function SuccessSplash ({
                                           title = 'Product successfully created!',
                                           subtitle = 'Your listing is now live and ready for the world 🚀',
                                           onClose
                                       }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    /* helper always rewinds & plays */
    const playClap = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(CLAP_SRC)
            audioRef.current.volume = 0.7
        }
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
        /* stop after 3 s so it never drags on */
        setTimeout(() => audioRef.current?.pause(), 4000)
    }

    /* first mount */
    useEffect(() => {
        playClap()
    }, [])

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center
                    bg-black/40 backdrop-blur-sm p-6">

            {/* full-screen ribbon burst */}
            <LottiePlayer
                autoplay
                keepLastFrame
                src={RIBBON_SRC}
                className="pointer-events-none absolute inset-0"
                style={{ width: '100%', height: '100%' }}
                rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                onEvent={ev => {
                    /* 🔑 pull the event name safely */
                    const name = typeof ev === 'string' ? ev : ev?.type
                    if (name === 'complete' || name === 'loopComplete') playClap()
                }}
            />

            {/* white card */}
            <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl
                      p-6 text-center space-y-4 z-10">

                {/* small confetti on card */}
                <LottiePlayer
                    autoplay
                    keepLastFrame
                    src={CONFETTI_SRC}
                    style={{ width: 180, height: 180 }}
                    rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                />

                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">{subtitle}</p>

                <Button
                    onClick={onClose}
                    className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Awesome – take me back
                </Button>
            </div>
        </div>
    )
}
