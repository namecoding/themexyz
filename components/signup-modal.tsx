"use client"

import type React from "react"

import { useState } from "react"
import { Loader, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { metaData } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";

interface SignupModalProps {
  onClose: () => void
  onSignup: (name: string, email: string, password: string) => void
  onSwitchToLogin: () => void
}

export default function SignupModal({ onClose, onSignup, onSwitchToLogin }: SignupModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [pleaseWait, setPleaseWait] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { data: session } = useSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (password.length < 4) {
      setPasswordError("Password must be at least more than 3 characters")
      return
    }

    setPasswordError("")
    onSignup(name, email, password)
  }

  const handleGoogleSignup = () => {
    // In a real app, you would implement Google OAuth here
    setPleaseWait(true)
    signIn("google", { prompt: "select_account", redirect: false }).then(r => { })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>
            <p className="text-gray-600 mt-1">Join {metaData.name} to access thousands of premium themes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least more than 3 characters</p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                required
              />
              {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 text-[#82b440] focus:ring-green-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-green-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-500 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
              Create Account
            </Button>
          </form>

          <div className="relative flex items-center justify-center mt-6 mb-6">
            <div className="border-t border-gray-300 absolute w-full"></div>
            <div className="bg-white px-4 relative text-sm text-gray-500">or</div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleGoogleSignup}
            disabled={pleaseWait}
          >
            {pleaseWait ? (
              <Loader className="animate-spin mr-2 h-5 w-5 text-gray-600" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="mr-2"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}

            {pleaseWait ? "Please wait..." : "Sign up with Google"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="text-green-500 hover:underline font-medium">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
