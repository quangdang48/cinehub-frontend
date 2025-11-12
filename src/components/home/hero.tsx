import { ChevronRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative h-screen bg-linear-to-b from-black via-transparent to-black overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=1080&width=1920&query=netflix movie collection grid background)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center px-6 md:px-12 lg:px-20 max-w-2xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight text-balance">
          Unlimited films, series and more
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-4">Starts at USD 7.99. Cancel at any time.</p>

        <p className="text-base md:text-lg text-gray-300 mb-8">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        {/* Email signup form */}
        <div className="flex flex-col md:flex-row w-full max-w-xl gap-3">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 px-4 py-3 md:py-4 bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 rounded focus:outline-none focus:border-gray-400 text-base md:text-lg"
          />
          <button className="px-8 md:px-10 py-3 md:py-4 bg-red-600 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-red-700 transition whitespace-nowrap text-base md:text-lg">
            Get Started
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Curved bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black to-transparent" />
    </section>
  )
}
