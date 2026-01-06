import React from "react";
import { Star, Play, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FilmDto } from "@/types/FilmDto";
import { normalizeUrl } from "@/utils/videoUtils";

interface RecommendedMoviesProps {
  films: FilmDto[];
  currentFilmId?: string;
  title?: string;
}

export const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({
  films,
  currentFilmId,
  title = "Đề xuất cho bạn",
}) => {
  const navigate = useNavigate();

  // Filter out current film
  const displayFilms = films.filter((f) => f.id !== currentFilmId);

  if (displayFilms.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <h3 className="text-xl font-bold text-white">{title}</h3>

      {/* Films List */}
      <div className="space-y-3">
        {displayFilms.map((film, _) => {
          const defaultPoster = film.posters.find((p) => p.type === "default");
          const year = new Date(film.releaseDate).getFullYear();

          return (
            <div
              key={film.id}
              onClick={() => navigate(`/watch/${film.id}`)}
              className={`
                group relative flex gap-3 p-3 rounded-2xl cursor-pointer
                bg-linear-to-r from-white/5 to-transparent
                border border-transparent hover:border-white/10
                hover:bg-white/5 transition-all duration-300
                overflow-hidden
              `}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-linear-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Thumbnail */}
              <div className="relative w-16 h-24 rounded-xl overflow-hidden shrink-0 shadow-lg">
                <img
                  src={defaultPoster ? normalizeUrl(defaultPoster.url) : "/placeholder.jpg"}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Play className="w-4 h-4 text-black ml-0.5" fill="black" />
                  </div>
                </div>

                {/* Age limit badge */}
                <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {film.ageLimit}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 relative z-10">
                <h4 className="text-white text-sm font-bold group-hover:text-yellow-400 transition-colors line-clamp-2 mb-1">
                  {film.title}
                </h4>
                <p className="text-gray-500 text-xs line-clamp-1 mb-2">
                  {film.englishTitle || film.originalTitle}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3 h-3" fill="currentColor" />
                    <span className="text-xs font-bold">
                      {film.imdbRating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{year}</span>
                  </div>
                  {/* <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{film.duration}</span>
                  </div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
