import React from 'react';
import { Star, MessageCircle, ChevronRight, Play } from 'lucide-react';
import type { FilmDto } from '@/types/FilmDto';
import type { EpisodeDto } from '@/types/EpisodeDto';

interface VideoInfoProps {
  film: FilmDto;
  currentEpisode?: EpisodeDto | null;
  totalRatings?: number;
  onNavigateToDetail?: () => void;
  onRate?: () => void;
  onComment?: () => void;
}

export const VideoInfo: React.FC<VideoInfoProps> = ({
  film,
  currentEpisode,
  totalRatings = 0,
  onNavigateToDetail,
  onRate,
  onComment,
}) => {
  const defaultPoster = film.posters.find(p => p.type === 'default');

  return (
    <div className="flex gap-6 py-6">
      {/* Poster */}
      <div className="hidden sm:block relative group/poster shrink-0">
        <div className="relative w-28 h-40 rounded-xl overflow-hidden border-2 border-white/10 group-hover/poster:border-yellow-500/50 transition-colors shadow-xl">
          <div className="absolute -inset-1 bg-linear-to-br from-yellow-500/40 to-orange-600/40 rounded-xl blur-md opacity-0 group-hover/poster:opacity-100 transition-opacity duration-500" />
          <img 
            src={defaultPoster?.url} 
            alt={film.title} 
            className="w-full h-full object-cover group-hover/poster:scale-105 transition-transform duration-500" 
          />
          {currentEpisode && (
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-2">
              <div className="flex items-center gap-1 text-xs text-yellow-400">
                <Play className="w-3 h-3" fill="currentColor" />
                <span className="font-bold">Tập {currentEpisode.number}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white mb-1 truncate">
              {film.title}
              {currentEpisode && (
                <span className="text-yellow-500 ml-2">- Tập {currentEpisode.number}</span>
              )}
            </h1>
            <p className="text-yellow-500/80 text-sm font-medium mb-3 truncate">
              {film.englishTitle || film.originalTitle}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-yellow-500/20">
                <Star className="w-3 h-3" fill="currentColor" />
                IMDb {film.imdbRating?.toFixed(1) || 'N/A'}
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10">
                {film.ageLimit}
              </span>
              <span className="bg-white/5 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/10">
                {new Date(film.releaseDate).getFullYear()}
              </span>
              {/* <span className="bg-white/5 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/10">
                {film.duration}
              </span> */}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {film.genres.slice(0, 4).map((genre) => (
                <span 
                  key={genre.id}
                  className="bg-white/5 text-gray-400 text-xs px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 cursor-pointer transition-all"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRate}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-500/30 transition-all group"
            >
              <Star className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
              <span className="text-xs text-gray-500 group-hover:text-gray-300">Đánh giá</span>
            </button>
            
            <button
              onClick={onComment}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-500/30 transition-all group"
            >
              <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
              <span className="text-xs text-gray-500 group-hover:text-gray-300">Bình luận</span>
            </button>

            {/* Rating Badge */}
            <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl bg-linear-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xl font-bold text-green-400">{totalRatings}</span>
              </div>
              <span className="text-xs text-green-500/70 font-medium">Đánh giá</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mt-4 pr-4">
          {film.description}
        </p>

        {/* Navigate to detail */}
        <button
          onClick={onNavigateToDetail}
          className="inline-flex items-center gap-1 text-yellow-500 text-sm font-medium mt-3 hover:text-yellow-400 hover:gap-2 transition-all group"
        >
          <span>Thông tin phim</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
