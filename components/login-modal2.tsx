"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/auth";
import { serverBase } from "@/lib/utils";

interface LoginModalProps {
  onClose: () => void
  onSignup: () => void
  onLogin: (email: string, password: string) => void
  onSwitchToSignup: () => void
  pleaseWaitWhileYourTransactionIsProcessing: boolean
}

export function LoginModal2({ onClose, onLogin, onSwitchToSignup, pleaseWaitWhileYourTransactionIsProcessing }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [useEmail, setUseEmail] = useState(false)
  const { isLoggedIn, setIsLoggedIn } = useAuthStore();
  const [user, setUser] = useState(null)
  const [pleaseWait, setPleaseWait] = useState(false)
  const { data: session } = useSession();

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    //console.log("Login with:", email, password)
    onLogin(email, password)
  }

  const handleGoogleSignup = () => {
    // In a real app, you would implement Google OAuth here
    setPleaseWait(true)
    signIn("google", { prompt: "select_account", redirect: false }).then(r => { })
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left side - Image and benefits */}
        <div className="hidden md:block md:w-1/2 bg-green-600 text-white p-10">
          <div className="h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-8">Success starts here</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-2">
                <div className="mt-1 text-[rgb(130,180,64)]">✓</div>
                <div>Over 700 categories</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 text-[rgb(130,180,64)]">✓</div>
                <div>Quality work done faster</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 text-[rgb(130,180,64)]">✓</div>
                <div>Access to talent and businesses across the globe</div>
              </div>
            </div>
            <div className="mt-auto">
              <Image
                src="./images/unlimited.png"
                alt="Person working on laptop"
                width={200}
                height={100}
                className="mt-8"
              />
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Sign in to your account</h2>
            <p className="mb-6">
              Don't have an account?{" "}
              <button onClick={onSwitchToSignup} className="text-green-600 font-medium hover:underline">
                Sign up
              </button>
            </p>

            <div className="space-y-4 mb-6">
              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full justify-start gap-2 py-6"
                disabled={pleaseWait}
              >
                {pleaseWait ? (
                  <Loader className="mr-2 h-5 w-5 animate-spin text-gray-600" />
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
                <span>{pleaseWait ? "Please wait..." : "Continue with Google"}</span>
              </Button>

              <Button variant="outline" onClick={() => setUseEmail(true)} className="w-full justify-start gap-2 py-6">
                {/*<Image src="/placeholder.svg?height=20&width=20" alt="Email" width={20} height={20} />*/}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2">
                  <path
                    fill="#6D28D9"
                    d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
                  />
                </svg>
                <span>Continue with email</span>
              </Button>
            </div>

            {
              useEmail &&
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">OR</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <Link href="#" className="text-sm font-medium text-green-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" disabled={pleaseWaitWhileYourTransactionIsProcessing} className="w-full bg-green-500 hover:bg-green-600">
                    {
                      pleaseWaitWhileYourTransactionIsProcessing ? 'Please Wait...' : 'Sign In'
                    }
                  </Button>
                </form>
              </>
            }

            <p className="mt-6 text-xs text-gray-500">
              By signing in, you agree to the{" "}
              <Link href="#" className="text-green-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-green-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
