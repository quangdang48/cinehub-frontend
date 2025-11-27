import type { FilmResponseDto } from "@/types/FilmResponseDto";
import classNames from "classnames";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface SimpleCardProps {
  movie: FilmResponseDto;
  onEnter: (movie: FilmResponseDto, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onLeave: () => void;
  className?: string;
}

export const SimpleCard: React.FC<SimpleCardProps> = ({ movie, onEnter, onLeave, className }) => {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div 
      className={classNames("flex-none w-40 md:w-[180px] snap-start cursor-pointer group", className)}
      onMouseEnter={(e) => onEnter(movie, e)}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Image Container - Effects handled purely via CSS 'group-hover' for simplicity */}
      <div className="relative aspect-2/3 rounded-lg overflow-hidden mb-2 bg-slate-800 shadow-md group-hover:shadow-lg group-hover:shadow-yellow-500/10 transition-all duration-300 group-hover:scale-[1.03]">
        <img 
          src={movie.posters.find(p => p.type === "thumbnail")?.url || "/placeholder.svg"} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => e.currentTarget.src = "https://via.placeholder.com/300x450/1e293b/ffffff?text=NO+IMAGE"}
        />
        
        {/* Overlay Dark at bottom for badges */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/80 to-transparent"></div>

        {/* Play Icon - Simple opacity transition */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className="bg-yellow-500/90 rounded-full p-3 shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
              <Play fill="black" size={20} className="text-black ml-0.5" />
           </div>
        </div>

        {/* Badges Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center">
          {/* {movie.badges.map((badge, idx) => (
            <span 
              key={idx} 
              className={`${badge.color} text-[9px] md:text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm bg-opacity-90`}
            >
              {badge.text}
            </span>
          ))} */}
            <span 
              key='idx'
              className={`bg-stale-600 text-[9px] md:text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm bg-opacity-90`}
            >
                T
            </span>
        </div>
      </div>

      {/* Info Info */}
      <div className="text-center px-1">
        <h3 className="text-white text-sm font-semibold truncate group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-500 text-xs truncate">
          {movie.title}
        </p>
      </div>
    </div>
    );
};