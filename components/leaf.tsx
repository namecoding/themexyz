'use client'
import React from "react";
import Link from "next/link";
interface LeafProps {
  small: string
}
const Leaf = ({small}: LeafProps) => {
  return(
      <Link href="/" className="font-bold text-2xl flex items-center gap-0.5">
        <svg width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="#00C853">
            <path d="M32 4L4 16L32 28L60 16L32 4Z"/>
            <path d="M4 24L32 36L60 24V30L32 42L4 30V24Z"/>
            <path d="M4 38L32 50L60 38V44L32 56L4 44V38Z"/>
          </g>
        </svg>
        <span className="flex items-center text-white">
    Theme
    <span className="flex items-center -ml-0">
      <span className="ml-0 text-green-500">XYZ</span>
    </span>
  </span>
      </Link>
  )
}

export default Leaf;
