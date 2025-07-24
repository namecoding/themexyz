'use client'
import React from "react";
import {metaData} from "@/lib/utils";

const Trademarks = () => {
    return (
        <div className="bg-[#262626] text-white py-6 px-4">
            <div className="container mx-auto max-w-6xl flex justify-center">
                <div className="text-xs text-gray-400">
                    <p className="inline-flex items-center gap-1 text-center">
                        <svg width="15" height="15" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g fill="#00C853">
                                <path d="M32 4L4 16L32 28L60 16L32 4Z" />
                                <path d="M4 24L32 36L60 24V30L32 42L4 30V24Z" />
                                <path d="M4 38L32 50L60 38V44L32 56L4 44V38Z" />
                            </g>
                        </svg>
                        <span>{metaData.name}</span>
                        <span className="ml-0">Trademarks and brands are the property of their respective owners.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Trademarks;
