"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Heart,
  Home,
  Menu,
  X,
  UserRoundCheck,
  Tag,
  Gift,
  Layers,
  Package,
  Box,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { maskEmail } from "@/lib/utils"
import Leaf from "@/components/leaf"
import WizardModal from "@/components/WizardModal"
import UnderReviewModal from "@/components/UnderReviewModal"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage: "account" | "purchases" | "settings" | "author" | "sell" | "my-products"
  user: any
  onLogout: () => void
  onSwitchAdmin: () => void
  isAdminModalOpen: boolean
}

export default function DashboardLayout({
  children,
  currentPage,
  user,
  onLogout,
  onSwitchAdmin,
  isAdminModalOpen,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [openWizard, setOpenWizard] = useState(false)
  const [showUnderReview, setShowUnderReview] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const menuItems = [
    {
      name: "My Account",
      icon: Layers,
      href: "/dashboard",
      active: currentPage === "account",
    },
    ...(user?.isAuthor === 1
      ? [
        {
          name: "Sell",
          icon: Tag,
          href: "/dashboard/sell",
          active: currentPage === "sell",
        },
      ]
      : []),
    {
      name: "My Purchases",
      icon: ShoppingBag,
      href: "/dashboard/purchases",
      active: currentPage === "purchases",
    },
    ...(user?.isAuthor === 1
      ? [
        {
          name: "My Products",
          icon: Box,
          href: "/dashboard/my-products",
          active: currentPage === "my-products",
        },
      ]
      : []),
    {
      name: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: currentPage === "settings",
    },
    ...(user?.isAuthor === 0
      ? [
        {
          name: "Become an Author",
          icon: UserRoundCheck,
          href: "/become-author",
          active: currentPage === "author",
        },
      ]
      : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#333333] text-white py-3 px-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Leaf small="s" />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-gray-300 hidden md:flex items-center text-sm">
              <Home className="h-4 w-4 mr-1" />
              <span>Marketplace</span>
            </Link>
            <Link href="#" className="text-white hover:text-gray-300 hidden md:flex items-center text-sm">
              <Heart className="h-4 w-4 mr-1" />
              <span>Wishlist</span>
            </Link>
            <Link href="#" className="text-white hover:text-gray-300 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
            <div className="relative group">
              <button className="flex items-center space-x-2 hover:text-gray-300">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt="User avatar"
                    width={32}
                    height={32}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden md:inline text-sm capitalize">{user?.name?.split(" ")[0]}</span>
              </button>
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          {/* <aside className="w-full md:w-64 hidden md:block flex-shrink-0 sticky top-20 self-start"></aside> */}
          <aside className="w-full md:w-64 hidden md:block flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={user?.avatar || "/placeholder.svg?height=48&width=48"}
                      alt="User avatar"
                      width={48}
                      height={48}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{user?.name || "User Name"}</h3>
                    <p className="text-xs text-gray-500">{maskEmail(user?.email) || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      {item.name === "Sell" ? (
                        <button
                          onClick={() => {
                            user?.authorityToSell ? setOpenWizard(true) : setShowUnderReview(true)
                          }}
                          className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm ${item.active
                            ? "bg-green-500 text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          <span>{item.name}</span>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center px-3 py-2 rounded-md text-sm ${item.active
                            ? "bg-green-500 text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          <span>{item.name}</span>
                          {item.active && <ChevronRight className="h-4 w-4 ml-auto" />}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                {user?.admin?.permission && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${isAdminModalOpen
                        ? "text-red-500 hover:text-red-500 hover:bg-red-50"
                        : "text-green-500 hover:text-green-500 hover:bg-green-50"
                        }`}
                      onClick={onSwitchAdmin}
                    >
                      <UserRoundCheck className="h-4 w-4 mr-3" />
                      <span>{isAdminModalOpen ? "Close Admin" : "Switch Admin"}</span>
                    </Button>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </nav>


            </div>
          </aside>


          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50">
              <div className="bg-white h-full w-64 p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-lg">Menu</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={user?.avatar || "/placeholder.svg?height=48&width=48"}
                        alt="User avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{user?.name || "User Name"}</h3>
                      <p className="text-xs text-gray-500">{maskEmail(user?.email) || "user@example.com"}</p>
                    </div>
                  </div>

                  {/* <nav>
                    <ul className="space-y-1">
                      {menuItems.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`flex items-center px-3 py-2 rounded-md text-sm ${
                              item.active
                                ? "bg-green-500 text-white"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            <span>{item.name}</span>
                            {item.active && <ChevronRight className="h-4 w-4 ml-auto" />}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav> */}

                  <nav>
  <ul className="space-y-1">
    {menuItems.map((item) => (
      <li key={item.name}>
        {item.name === "Sell" ? (
          <button
            onClick={() => {
              user?.authorityToSell ? setOpenWizard(true) : setShowUnderReview(true)
              setIsMobileMenuOpen(false)
            }}
            className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm ${
              item.active
                ? "bg-green-500 text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className="h-4 w-4 mr-3" />
            <span>{item.name}</span>
          </button>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              item.active
                ? "bg-green-500 text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-4 w-4 mr-3" />
            <span>{item.name}</span>
            {item.active && <ChevronRight className="h-4 w-4 ml-auto" />}
          </Link>
        )}
      </li>
    ))}
  </ul>

  {user?.admin?.permission && (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <Button
        variant="ghost"
        className={`w-full justify-start ${
          isAdminModalOpen
            ? "text-red-500 hover:text-red-500 hover:bg-red-50"
            : "text-green-500 hover:text-green-500 hover:bg-green-50"
        }`}
        onClick={() => {
          onSwitchAdmin()
          setIsMobileMenuOpen(false)
        }}
      >
        <UserRoundCheck className="h-4 w-4 mr-3" />
        <span>{isAdminModalOpen ? "Close Admin" : "Switch Admin"}</span>
      </Button>
    </div>
  )}
</nav>


                  
                </div>

                <div className="space-y-1">
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    <span>Marketplace</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4 mr-3" />
                    <span>Wishlist</span>
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      onLogout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          )}


          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Modals */}
          <WizardModal open={openWizard} onClose={() => setOpenWizard(false)} user={user} />
          <UnderReviewModal open={showUnderReview} onClose={() => setShowUnderReview(false)} />
        </div>
      </div>
    </div>
  )
}
