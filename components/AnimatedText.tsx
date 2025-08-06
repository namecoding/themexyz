'use client'

import React from 'react'
import '@/styles/globals.css' // Import global styles

interface AnimatedTextProps {
    text: string
    animationClass?: string
    delayStep?: number
    className?: string
    iconAnimationClass?: string
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
    text,
    animationClass = 'fade-glow',
    delayStep = 0.1,
    className = '',
}) => {
    return (
        <div className={`flex space-x-1 text-4xl font-bold tracking-wide ${className}`}>
            <svg
                width="34"
                height="34"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g fill="#00C853">
                    <path className="svg-part" style={{ animationDelay: '0s' }} d="M32 4L4 16L32 28L60 16L32 4Z" />
                    <path className="svg-part" style={{ animationDelay: '0.15s' }} d="M4 24L32 36L60 24V30L32 42L4 30V24Z" />
                    <path className="svg-part" style={{ animationDelay: '0.3s' }} d="M4 38L32 50L60 38V44L32 56L4 44V38Z" />
                </g>
            </svg>


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
