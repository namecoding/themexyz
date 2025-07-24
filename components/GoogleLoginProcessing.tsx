"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GoogleLoginProcessing() {
    useEffect(() => {
        // Disable scroll
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-fadeIn">
            <div className="flex flex-col items-center rounded-lg shadow-lg p-4 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 bg-[length:400%_400%] animate-[borderGlow_3s_ease-in-out_infinite]">
                <div className="flex items-center space-x-3">
                    <Loader2 className="h-8 w-8 animate-spinPulse text-white" />
                    <span className="text-white text-lg font-medium">Signing you in with Google...</span>
                </div>
                <span className="text-white text-sm mt-2">Please wait</span>
            </div>
        </div>
    );
}
