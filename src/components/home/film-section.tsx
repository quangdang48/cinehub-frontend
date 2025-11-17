import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

interface Show {
  id: number
  title: string
  image: string
}

interface TrendingSectionProps {
  title?: string
  shows: Show[]
}

export default function FilmSection({ 
  title = "Trending now", 
  shows 
}: TrendingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return
    const scrollAmount = 400
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 bg-black">
      <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {shows.map((show, index) => (
            <div key={show.id} className="flex-none min-w-max relative group/item cursor-pointer">
              <div className="relative w-48 h-80 rounded-lg overflow-hidden">
                <img
                  src={show.image || "/placeholder.svg"}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover/item:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover/item:bg-black/20 transition" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-6xl font-black text-white opacity-30 group-hover/item:opacity-100 transition">
                    {index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
    </section>
  )
}
