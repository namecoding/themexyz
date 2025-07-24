'use client'

import React from 'react'
import '@/styles/globals.css' // Import global styles

interface AnimatedTextProps {
    text: string
    animationClass?: string
    delayStep?: number
    className?: string
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
                                                       text,
                                                       animationClass = 'fade-glow',
                                                       delayStep = 0.1,
                                                       className = '',
                                                   }) => {
    return (
        <div className={`flex space-x-1 text-4xl font-bold tracking-wide ${className}`}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className={`inline-block text-transparent bg-gradient-to-r from-white via-[#82b440] to-white bg-clip-text ${animationClass}`}
                    style={{
                        animationDelay: `${index * delayStep}s`,
                        animationDuration: '1.5s',
                        animationIterationCount: 'infinite',
                    }}
                >
                    {char}
                </span>
            ))}
        </div>
    )
}

export default AnimatedText
