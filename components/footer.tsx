'use client'
import React from "react";
import Link from "next/link";
import { defaultCurrency, metaData } from "@/lib/utils";
import Trademarks from "@/components/trademarks";
import { useActiveCurrency } from "@/lib/currencyTag";

interface FooterProps {

}
const SiteFooter: React.FC<FooterProps> = ({ }) => {
    const { currency, symbol, country, countryCode, ip } = useActiveCurrency(defaultCurrency)
    return (
        <footer className="bg-[#000] text-white py-10 px-4 mt-auto">
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link href="/" className="font-bold text-3xl flex items-center gap-0.5 mb-4">
                            <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g className="fill-green-500">
                                    <path d="M32 4L4 16L32 28L60 16L32 4Z" />
                                    <path d="M4 24L32 36L60 24V30L32 42L4 30V24Z" />
                                    <path d="M4 38L32 50L60 38V44L32 56L4 44V38Z" />
                                </g>
                            </svg>
                            <h3 className="font-bold text-sm gap-1">{metaData.name} Market</h3>
                        </Link>

                        <ul className="space-y-2 text-xs text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Licenses
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Market API
                                </Link>
                            </li>
                            <li>
                                <Link href="become-author" className="hover:text-white">
                                    Become an author
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-sm">Help</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Authors
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Contact Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-sm">Our Community</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Forums
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Meetups
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-sm">{metaData.name}</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    About {metaData.name}
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Sitemap
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex space-x-4 mb-6">
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-facebook"
                        >
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-twitter"
                        >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-instagram"
                        >
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-linkedin"
                        >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-youtube"
                        >
                            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                            <path d="m10 15 5-3-5-3z" />
                        </svg>
                        <span className="sr-only">YouTube</span>
                    </Link>
                </div>

                <div className="text-xs text-gray-500 text-center mb-2">
                    Your local currency is <span className="text-white font-medium">{currency}</span>
                </div>

                <Trademarks />
            </div>
        </footer>
    )
}

export default SiteFooter;
