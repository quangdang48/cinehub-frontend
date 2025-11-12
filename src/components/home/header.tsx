"use client"

import { Globe } from "lucide-react"
import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 md:px-12 md:py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-red-600 font-black text-3xl md:text-4xl">CINE-HUB</div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-400 rounded text-gray-200 hover:bg-gray-900 transition">
          <Globe size={18} />
          <span className="text-sm">English</span>
        </button>

        <Link to="/login">
          <button className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition">
            Sign In
          </button>
        </Link>
      </div>
    </header>
  )
}
