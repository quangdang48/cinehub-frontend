import type { FilmDto } from "@/types/FilmDto";
import { normalizeUrl } from "@/utils/videoUtils";
import { useNavigate } from "react-router-dom";

export interface RankingCardProps {
  movie: FilmDto;
  index: number;
  hoveredId: string | null;
  onEnter: (
    movie: FilmDto,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  onLeave: () => void;
}

export const RankingCard: React.FC<RankingCardProps> = ({
  movie,
  index,
  hoveredId,
  onEnter,
  onLeave,
}) => {
  const skewClass = index % 2 === 0 ? "skew-x-[-6deg]" : "skew-x-[6deg]";
  const unSkewClass = index % 2 === 0 ? "skew-x-[6deg]" : "skew-x-[-6deg]";
  const isHovered = hoveredId === movie.id;
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      onMouseEnter={(e) => onEnter(movie, e)}
      onMouseLeave={onLeave}
      onClick={handleClick}
      className={`relative flex-none w-[180px] md:w-[220px] snap-start cursor-pointer transition-all duration-300
        ${isHovered ? "z-20 scale-105" : "z-10"}
        ${index === 0 ? "ml-6 md:ml-8" : ""}
      `}
    >
      <div
        className={`relative aspect-2/3 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${skewClass} 
        ${isHovered ? "ring-2 ring-yellow-400 shadow-yellow-500/40" : "shadow-black/50"}
      `}
      >
        <div className={`w-[120%] h-full -ml-[10%] ${unSkewClass} relative`}>
          <img
            src={
              movie.posters.find((p) => p.type === "default")
                ? normalizeUrl(movie.posters.find((p) => p.type === "default")!.url)
                :
              "/placeholder.svg"
            }
            alt={movie.title}
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

          <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center">
            {/* {movie.badges.map((badge, idx) => (
              <span key={idx} className={`${badge.color} text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm`}>
                {badge.text}
              </span>
            ))} */}
            <span
              key="idx"
              className={`bg-slate-600 text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm`}
            >
              T
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 mt-4 px-2">
        <span
          className="text-6xl font-black italic text-[#eab308] leading-none drop-shadow-xl z-20"
          style={{ fontFamily: "serif" }}
        >
          {index + 1}
        </span>
        <div className="flex flex-col pt-1">
          <h3 className="text-white text-base font-bold leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
            <span>{movie.genres[0]?.name}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{movie.genres[2]?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
