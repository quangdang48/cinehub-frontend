import type { FilmDto } from "@/types/FilmDto";
import { normalizeUrl } from "@/utils/videoUtils";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface WideCardProps {
  movie: FilmDto;
  onEnter: (
    movie: FilmDto,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  onLeave: () => void;
}

export const WideCard: React.FC<WideCardProps> = ({
  movie,
  onEnter,
  onLeave,
}) => {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };
  return (
    <div
      className="flex-none w-[320px] md:w-[400px] snap-start cursor-pointer group"
      onMouseEnter={(e) => onEnter(movie, e)}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Backdrop Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group-hover:shadow-yellow-500/20 transition-all duration-300 group-hover:scale-[1.02] bg-slate-800">
        <img
          src={
            movie.posters.find((p) => p.type === "backdrop")
              ? normalizeUrl(movie.posters.find((p) => p.type === "backdrop")!.url)
              :
            "/placeholder.svg"
          }
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) =>
            (e.currentTarget.src =
              "https://via.placeholder.com/400x225/1e293b/ffffff?text=BACKDROP")
          }
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play fill="white" size={32} className="text-white ml-1" />
          </div>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>
      </div>

      {/* Content Section */}
      <div className="flex gap-4 px-3 -mt-16 md:-mt-20 relative z-10">
        <div className="relative w-20 md:w-[100px] aspect-2/3 flex-none rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10 group-hover:ring-yellow-500/50 transition-all duration-300 group-hover:-translate-y-2">
          <img
            src={
              movie.posters.find((p) => p.type === "default")
                ? normalizeUrl(movie.posters.find((p) => p.type === "default")!.url)
                :
              "/placeholder.svg"
            }
            alt="poster"
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                "https://via.placeholder.com/100x150/1e293b/ffffff?text=POSTER")
            }
          />
          <div className="absolute top-1 right-1">
            {/* {movie.badges.map((badge, idx) => (
                        <span key={idx} className={`${badge.color} text-[9px] font-bold text-white px-1 py-0.5 rounded shadow-sm opacity-90 block mb-1 text-center`}>
                        {badge.text}
                        </span>
                    ))} */}
            <span
              key="idx"
              className={`bg-slate-500 text-[9.2px] font-bold text-white px-1 py-0.5 rounded shadow-sm opacity-90 block mb-1 text-center`}
            >
              T
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-end pb-1 overflow-hidden">
          <h3 className="text-white text-base md:text-lg font-bold leading-tight truncate group-hover:text-yellow-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm truncate mb-1">
            {movie.title}
          </p>
          <div className="flex items-center flex-wrap gap-2 text-[10px] md:text-xs text-gray-300 font-medium">
            <span className="text-white font-bold">
              {movie.genres[0]?.name}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>{movie.genres[1]?.name}</span>
            {movie.genres[2]?.name && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                <span>{movie.genres[0]?.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
