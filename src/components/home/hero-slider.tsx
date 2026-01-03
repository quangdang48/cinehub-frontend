import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Heart, Info, ChevronLeft, ChevronRight } from "lucide-react";
import classNames from "classnames";
import type { FilmDto } from "@/types/FilmDto";
import { normalizeUrl } from "@/utils/videoUtils";
import { useWishlist } from "@/hooks/useWishlist";

interface HeroSliderProps {
  films: FilmDto[];
  loading?: boolean;
  autoPlayInterval?: number;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  films,
  loading = false,
  autoPlayInterval = 8000,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentFilm = films[currentIndex];

  // Wishlist hook
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist(currentFilm?.id);

  const handleToggleWishlist = async () => {
    if (currentFilm) {
      await toggleWishlist();
    }
  };

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying || films.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % films.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, films.length, autoPlayInterval]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + films.length) % films.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, [films.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % films.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, [films.length]);

  const handleWatch = () => {
    if (currentFilm) {
      navigate(`/movie/${currentFilm.id}`);
    }
  };

  const handleDetail = () => {
    if (currentFilm) {
      navigate(`/movie/${currentFilm.id}`);
    }
  };

  if (loading || films.length === 0) {
    return (
      <section className="relative h-screen bg-neutral-900 animate-pulse">
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {films.map((film, index) => (
        <div
          key={index}
          className={classNames(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={
              film.posters.find((p) => p.type === "backdrop") ? normalizeUrl(film.posters.find((p) => p.type === "backdrop")!.url) :
              "/placeholder.svg"
            }
            alt={film.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          {/* Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {currentFilm?.title}
          </h1>

          {/* Original title */}
          <p className="text-lg text-neutral-300 mb-4 italic">
            {currentFilm?.originalTitle}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {currentFilm?.imdbRating && (
              <span className="px-2 py-0.5 bg-yellow-500 text-black text-sm font-bold rounded">
                IMDb {currentFilm.imdbRating.toFixed(1)}
              </span>
            )}
            <span className="px-2 py-0.5 border border-neutral-500 text-neutral-300 text-sm rounded">
              T16
            </span>
            <span className="px-2 py-0.5 border border-neutral-500 text-neutral-300 text-sm rounded">
              {new Date(currentFilm?.releaseDate || "").getFullYear()}
            </span>
            <span className="px-2 py-0.5 border border-neutral-500 text-neutral-300 text-sm rounded">
              1h 56m
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {currentFilm?.genres?.slice(0, 6).map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-neutral-800/80 text-neutral-300 text-sm rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 italic">
            {currentFilm?.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleWatch}
              className="flex items-center justify-center w-14 h-14 bg-yellow-500 hover:bg-yellow-400 rounded-full transition-all hover:scale-110"
            >
              <Play size={28} className="text-black ml-1" fill="black" />
            </button>
            <button 
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              className={classNames(
                "flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110",
                isInWishlist 
                  ? "bg-red-600 hover:bg-red-500" 
                  : "bg-neutral-700/80 hover:bg-neutral-600",
                wishlistLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Heart 
                size={22} 
                className={isInWishlist ? "text-white" : "text-white"} 
                fill={isInWishlist ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={handleDetail}
              className="flex items-center justify-center w-12 h-12 bg-neutral-700/80 hover:bg-neutral-600 rounded-full transition-all hover:scale-110"
            >
              <Info size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Thumbnail navigation - Bottom right */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3">
          {films.slice(0, 5).map((film, index) => (
            <button
              key={film.id}
              onClick={() => goToSlide(index)}
              className={classNames(
                "w-16 h-10 rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-yellow-500 scale-110"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <img
                src={
                  film.posters.find((p) => p.type === "thumbnail") ? normalizeUrl(film.posters.find((p) => p.type === "thumbnail")!.url) :
                  "/placeholder.svg"
                }
                alt={film.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full transition opacity-0 hover:opacity-100 group-hover:opacity-100"
          style={{ opacity: 0.5 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full transition"
          style={{ opacity: 0.5 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent" />
    </section>
  );
};

export default HeroSlider;
