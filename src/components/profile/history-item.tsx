import type { WatchHistoryDto } from "@/types/WatchHistoryDto";
import { normalizeUrl } from "@/utils/videoUtils";
import { Trash2, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface HistoryItemProps {
  item: WatchHistoryDto;
  onRemove: (filmId: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onRemove }) => {
  const navigate = useNavigate();
  const { film } = item;

  if (!film) return null;

  const backdrop = film.posters.find((p) => p.type === "backdrop")?.url;
  const poster = film.posters.find((p) => p.type === "default")?.url;
  const imageUrl = backdrop || poster;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(film.id);
  };

  const handleClick = () => {
    navigate(`/movie/${film.id}`);
  };

  return (
    <div 
      className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-full sm:w-60 aspect-video rounded-lg overflow-hidden bg-gray-900">
        <img
          src={imageUrl ? normalizeUrl(imageUrl) : "/placeholder.svg"}
          alt={film.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
          <PlayCircle className="w-12 h-12 text-white opacity-90" />
        </div>
        {/* Progress Bar (Mock for now as we don't have total duration in history dto yet, or maybe we do?) */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div className="h-full bg-red-600 w-1/2"></div>
        </div> */}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors line-clamp-2">
            {film.title}
          </h3>
          <button
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Xóa khỏi lịch sử"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-1 text-sm text-gray-400 line-clamp-2">
          {film.description}
        </div>

        <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-gray-500">
          <span>
            {item.updatedAt && formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: vi })}
          </span>
          {/* Add more metadata here if needed */}
        </div>
      </div>
    </div>
  );
};
