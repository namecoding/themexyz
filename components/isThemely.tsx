'use client'

import React from 'react'
import AnimatedText from "@/components/AnimatedText";
import {metaData} from "@/lib/utils";

const isThemely = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-foreground">
            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center gap-1">
                    <svg width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g fill="#00C853">
                            <path d="M32 4L4 16L32 28L60 16L32 4Z"/>
                            <path d="M4 24L32 36L60 24V30L32 42L4 30V24Z"/>
                            <path d="M4 38L32 50L60 38V44L32 56L4 44V38Z"/>
                        </g>
                    </svg>
                    <AnimatedText text={metaData.name} animationClass="float-glow" className="text-2xl font-bold" />
                </div>
                <p className="text-sm text-muted-foreground">By NameCoding</p>
            </div>
        </div>
    )
}

export default isThemely
