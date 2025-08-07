'use client'

import React from 'react'
import AnimatedText from "@/components/AnimatedText";
import { metaData } from "@/lib/utils";

const isThemely = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#000] text-foreground">
            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center gap-1">
                    <AnimatedText text={metaData.name} animationClass="float-glow" className="text-2xl font-bold" />
                </div>
                <p className="text-sm text-muted-foreground">By NameCoding</p>
            </div>
        </div>
    )
}

export default isThemely
