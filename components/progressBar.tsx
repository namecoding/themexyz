import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

/**
 * ProgressOverlay – a full‑screen circular progress indicator.
 */
export default function ProgressOverlay({
                                            show = true,
                                            progress,
                                            title = "Loading…",
                                            subtitle = "",
                                            size = 160,
                                            stroke = 18,
                                        }: {
    show?: boolean;
    progress?: number | null;
    title?: string;
    subtitle?: string;
    size?: number;
    stroke?: number;
}) {
    if (!show) return null;

    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    const pct = progress ?? 0;
    const determinateControls = useAnimation();

    useEffect(() => {
        if (progress === undefined || progress === null) return;
        determinateControls.start({
            strokeDashoffset: circumference * (1 - pct / 100),
            transition: { type: "spring", stiffness: 120, damping: 24 },
        });
    }, [progress, circumference, pct, determinateControls]);

    const indeterminate = progress === undefined || progress === null;

    return (
        <div className="fixed inset-0 z-[999999999] flex flex-col items-center justify-center bg-black/90 text-center text-white">
            <svg
                width={size}
                height={size}
                className={indeterminate ? "animate-spin-slow mb-6" : "mb-6"}
                role="progressbar"
                aria-valuenow={progress ?? undefined}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#fff"
                    strokeWidth={stroke}
                />
                {/* Progress */}
                {indeterminate ? (
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        // stroke="url(#grad)"
                        stroke="#22c55e"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference * 0.25} ${circumference}`}
                        strokeDashoffset={0}
                    />
                ) : (
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        // stroke="url(#grad)"
                        stroke="#22c55e"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        animate={determinateControls}
                    />
                )}
                {/* Gradient */}
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                    <style>
                        {`
              @keyframes spin-slow { 100% { transform: rotate(360deg) } }
              .animate-spin-slow { animation: spin-slow 1.6s linear infinite; }
            `}
                    </style>
                </defs>
            </svg>

            <h2 className="text-lg font-medium tracking-wide">{title}</h2>
            {subtitle && <p className="text-sm text-white/80 mt-1">{subtitle}</p>}
        </div>
    );
}
