// components/SiteHeader.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Search, ShoppingCart, Heart, Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { metaData } from "@/lib/utils";
import Leaf from "@/components/leaf";

interface SiteHeaderProps {
    isLoggedIn: boolean
    user?: { name: string; avatar?: string }
    cartItems: any[]
    wishlistItems: any[]
    getCartCount: () => number
    getWishlistCount: () => number
    openLoginModal: () => void
    openSignupModal: () => void
    handleLogout: () => void
    viewCart: () => void
    mobileMenuOpen: boolean
    setMobileMenuOpen: (open: boolean) => void
    moreMenuOpen: boolean
    setMoreMenuOpen: (open: boolean) => void
}

const SiteHeader: React.FC<SiteHeaderProps> = ({
    isLoggedIn,
    user,
    cartItems,
    wishlistItems,
    getCartCount,
    getWishlistCount,
    openLoginModal,
    openSignupModal,
    handleLogout,
    viewCart,
    mobileMenuOpen,
    setMobileMenuOpen,
    moreMenuOpen,
    setMoreMenuOpen,
}) => {


    const [moreMenu, setMoreMenu] = useState([
        { name: 'Marketing Templates', path: '/view-all/marketing' },
        { name: 'CMS Templates', path: '/view-all/cms' },
        { name: 'Blogging Templates', path: '/view-all/blogging' },
        { name: 'Featured Themes', path: '/view-all/featured' },
        { name: 'New Items', path: '/view-all/new' },
        { name: 'Best Sellers', path: '/view-all/bestsellers' },
    ]);

    const [headerMenus, setHeaderMenus] = useState([
        { label: 'WordPress', href: '/view-all/wordpress' },
        { label: 'eCommerce', href: '/view-all/ecommerce' },
        { label: 'Site Templates', href: '/view-all/site-templates' },
    ])


    const [menus, setMenus] = useState([
        { label: 'Marketing Templates', href: '/view-all/marketing', sub: true },
        { label: 'CMS Templates', href: '/view-all/cms', sub: true },
        { label: 'Blogging Templates', href: '/view-all/blogging', sub: true },
        { label: 'Featured Themes', href: '/view-all/featured', sub: true },
        { label: 'New Items', href: '/view-all/new', sub: true },
        { label: 'Best Sellers', href: '/view-all/bestsellers', sub: true },
        { label: 'WordPress', href: '/view-all/wordpress', sub: false },
        { label: 'eCommerce', href: '/view-all/ecommerce', sub: false },
        { label: 'Site Templates', href: '/view-all/site-templates', sub: false },
    ]);




    return (
        <header className="bg-[#333333] text-white py-3 px-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Leaf small='s' />

                    <nav className="hidden md:flex space-x-4 text-sm">
                        {headerMenus.map((item, index) => (
                            <Link key={index} href={item.href} className="hover:text-gray-300 flex items-center">
                                {item.label} <ChevronDown className="h-4 w-4 ml-1" />
                            </Link>
                        ))}

                        <div className="relative more-menu-container">
                            <button
                                className="hover:text-gray-300 flex items-center"
                                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                                onMouseEnter={() => setMoreMenuOpen(true)}
                            >
                                More <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                            {moreMenuOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-[#262626] rounded-md shadow-lg overflow-hidden z-20">
                                    <div className="py-2">
                                        {moreMenu.map((text, index) => (
                                            <Link key={text.name} href={text.path} className="block px-4 py-2 text-sm hover:bg-[#333333]">
                                                {text.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="bg-[#4a4a4a] text-white text-sm rounded-md py-1 px-3 w-56 focus:outline-none"
                        />
                        <Search className="absolute right-3 top-1.5 h-4 w-4 text-gray-400" />
                    </div>

                    {isLoggedIn ? (
                        <div className="relative group">
                            <button className="flex items-center space-x-2 hover:text-gray-300">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <Image
                                        src={user?.avatar || '/placeholder.svg?height=32&width=32'}
                                        alt="User avatar"
                                        width={32}
                                        height={32}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                        }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="hidden md:inline text-sm capitalize">{user?.name?.split(' ')[0]} </span>

                                <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-[#262626] rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="py-2">
                                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-[#333333]">
                                        My Account
                                    </Link>
                                    <Link href="/dashboard/purchases" className="block px-4 py-2 text-sm hover:bg-[#333333]">
                                        My Purchases
                                    </Link>

                                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-[#333333]">
                                        Settings
                                    </Link>

                                    {
                                        user?.isAuthor === 0 && <Link href="/become-author" className="block px-4 py-2 text-sm hover:bg-[#333333]">
                                            Become an Author
                                        </Link>
                                    }

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[#333333] border-t border-[#444444] mt-1"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={openLoginModal} className="hover:text-gray-300 flex items-center text-sm">
                            <User className="h-5 w-5" />
                        </button>
                    )}

                    <Link
                        href="#"
                        className="hover:text-gray-300 flex items-center relative"
                        onClick={(e) => {
                            e.preventDefault()
                            viewCart()
                        }}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/wishlist"
                        className="text-white hover:text-gray-300 hidden md:flex items-center text-sm relative"
                    >
                        <Heart className="h-4 w-4 mr-1" />
                        <span>Wishlist</span>
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {getWishlistCount()}
                            </span>
                        )}
                    </Link>

                    {!isLoggedIn && (
                        <Button
                            asChild
                            className="bg-green-600 hover:bg-[#7aa93c] text-white text-xs rounded hidden md:flex"
                            onClick={(e) => {
                                e.preventDefault()
                                openSignupModal()
                            }}
                        >
                            <Link href="#" onClick={(e) => e.preventDefault()}>
                                Create an Account
                            </Link>
                        </Button>
                    )}

                    <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-[#262626] mt-2 p-4 rounded-md">
                    <div className="flex flex-col space-y-3">
                        {headerMenus.map((item, index) => (
                            <Link key={index} href={item.href} className="text-white hover:text-gray-300">
                                {item.label}
                            </Link>
                        ))}

                        <div className="relative">
                            <button
                                className="text-white hover:text-gray-300 flex items-center justify-between w-full"
                                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                            >
                                <span>More</span>
                                {moreMenuOpen ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            {moreMenuOpen && (
                                <div className="mt-2 pl-4 border-l border-[#444444] space-y-3">
                                    {moreMenu.map((item, index) => (
                                        <Link key={index} href={item.path} className="block text-white hover:text-gray-300">
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="bg-[#4a4a4a] text-white text-sm rounded-md py-1 px-3 w-full focus:outline-none"
                            />
                            <Search className="absolute right-3 top-1.5 h-4 w-4 text-gray-400" />
                        </div>

                        <Link href="/wishlist" className="text-white hover:text-gray-300 flex items-center text-sm">

                            <Heart className="h-4 w-4 mr-1" />

                            <span>Wishlist</span>
                            {wishlistItems.length > 0 && (
                                <span className="ml-1 bg-green-500 text-white text-xs rounded-full px-1.5">
                                    {getWishlistCount()}
                                </span>
                            )}
                        </Link>

                        {!isLoggedIn && (
                            <Button
                                asChild
                                className="bg-green-500 hover:bg-[#7aa93c] text-white text-xs rounded w-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    openSignupModal()
                                }}
                            >
                                <Link href="#" onClick={(e) => e.preventDefault()}>
                                    Create an Account
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default SiteHeader
