import type { FilmDto } from "@/types/FilmDto";
import { Play, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ModalPosition {
  top: number;
  left: number;
  width: number;
}

export interface MoviePreviewModalProps {
  movie: FilmDto;
  position: ModalPosition;
  onLeave: () => void;
}

export const MoviePreviewModal: React.FC<MoviePreviewModalProps> = ({ movie, position, onLeave }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div 
      className="fixed z-50 rounded-lg overflow-hidden bg-[#18181b] shadow-2xl shadow-black/90 ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      <div className="relative aspect-video w-full">
        <img 
          src={movie.posters.find(p => p.type === "thumbnail")?.url || "/placeholder.svg"} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#18181b] via-transparent to-transparent"></div>
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-bold text-lg drop-shadow-md truncate">{movie.title}</h3>
        </div>
      </div>

      <div className="p-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-green-400 font-semibold mb-3">
          <span>98% Phù hợp</span>
          {/* {data.tags && data.tags.map((tag, i) => (
             <span key={i} className="text-gray-400 font-normal border border-gray-600 px-1 rounded-sm">{tag}</span>
          ))}
          {(!data.tags || data.tags.length === 0) && (
              <span className="text-gray-400 font-normal border border-gray-600 px-1 rounded-sm">HD</span>
          )} */}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1.5 rounded flex items-center justify-center gap-1 transition-colors text-sm">
            <Play fill="black" size={16} /> Xem ngay
          </button>
          <button className="p-1.5 border-2 border-gray-500 rounded-full hover:border-white text-white transition-colors">
            <Plus size={18} />
          </button>
        </div>

        <div className="text-gray-300 text-xs line-clamp-3 mb-2 leading-relaxed">
          {movie.description || "Đang cập nhật nội dung cho phim này..."}
        </div>
      </div>
    </div>
  );
};