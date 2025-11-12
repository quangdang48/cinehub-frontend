"use client"

import type React from "react"

import { useState } from "react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ email: "", password: "" })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)

    if (!newErrors.email && !newErrors.password) {
      console.log("Form submitted:", { email, password })
      // Handle login logic here
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-black/80 border border-gray-700 rounded-lg p-8 md:p-12">
        <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={`w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded focus:outline-none focus:bg-gray-600 transition ${
                errors.email ? "border-2 border-red-600" : ""
              }`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: "" })
              }}
              className={`w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded focus:outline-none focus:bg-gray-600 transition ${
                errors.password ? "border-2 border-red-600" : ""
              }`}
            />
            {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Sign In with Code */}
        <button className="w-full py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition">
          Sign in with Code
        </button>

        {/* Forgot Password */}
        <div className="mt-8 text-center">
          <a href="#" className="text-gray-400 hover:text-white text-sm transition">
            Forgot password?
          </a>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            New to Netflix?{" "}
            <a href="/" className="text-white hover:underline font-semibold">
              Sign up now
            </a>
          </p>
        </div>

        {/* ReCAPTCHA Notice */}
        <p className="text-gray-500 text-xs mt-6 text-center">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
      </div>
    </div>
  )
}
