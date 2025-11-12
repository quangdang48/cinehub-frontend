import { Link } from "react-router-dom"
import LoginForm from "../components/login/login-form"

export const metadata = {
  title: "Netflix - Sign In",
  description: "Sign in to Netflix",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 md:px-12 md:py-6">
        <Link to="/" className="text-red-600 font-black text-3xl md:text-4xl hover:opacity-80 transition">
          NETFLIX
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <LoginForm />
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 md:px-12 border-t border-gray-900">
        <p className="text-gray-400 text-sm text-center">Questions? Call 1-800-NETFLIX (1-800-638-3549)</p>
      </footer>
    </main>
  )
}
