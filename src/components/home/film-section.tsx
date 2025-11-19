import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { FilmResponseDto, PosterDto } from "@/services/types";

interface Show {
  id: string;
  title: string;
  image: string;
  rating?: number;
}

interface FilmSectionProps {
  title?: string;
  shows: Show[];
  loading?: boolean;
  onNext?: () => void;
}

/** helper chọn poster */
function getPosterImage(posters: PosterDto[]) {
  const thumbnail = posters.find((p) => p.type === "thumbnail");
  const def = posters.find((p) => p.type === "default");
  const backdrop = posters.find((p) => p.type === "backdrop");
  return thumbnail?.url || def?.url || backdrop?.url || "/placeholder.svg";
}

/** map FilmResponseDto -> Show */
export function mapFilmToShow(films: FilmResponseDto[]): Show[] {
  return films.map((film) => ({
    id: film.id,
    title: film.title,
    image: getPosterImage(film.posters),
    rating: film.rating,
  }));
}

export default function FilmSection({
  title = "Trending now",
  shows,
  loading = false,
  onNext,
}: FilmSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 400;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    scroll("right");
    if (onNext) onNext();
  };

  // --- Scroll reveal state ---
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) {
              setVisibleItems((prev) => new Set(prev).add(id));
            }
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    const items = scrollContainerRef.current?.querySelectorAll(".film-item");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [shows]);

  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 bg-black relative">
      <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>

      <div className="relative group">
        {/* Spinner overlay khi loading */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Scroll left button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition transform active:scale-110"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        {/* Film cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 transition-all duration-500"
        >
          {shows.map((show, index) => (
            <div
              key={show.id + "-" + index}
              className={`flex-none min-w-max relative group/item cursor-pointer film-item transition-all duration-500 
                ${visibleItems.has(show.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              data-id={show.id}
            >
              <div className="relative w-48 h-80 rounded-lg overflow-hidden">
                <img
                  src={show.image}
                  alt={show.title}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  decoding="async"
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

        {/* Scroll right / onNext button */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition transform active:scale-110"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>

      <style jsx global>{`
        /* fadeIn + slide up */
        .film-item {
          transition: all 0.5s ease;
        }
      `}</style>
    </section>
  );
}
