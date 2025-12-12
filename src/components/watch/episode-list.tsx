import React from "react";
import { Play, Check } from "lucide-react";
import type { EpisodeDto } from "@/types/EpisodeDto";
import type { FilmDto } from "@/types/FilmDto";

interface EpisodeListProps {
  film: FilmDto;
  episodes: EpisodeDto[];
  currentEpisodeId?: string;
  watchedEpisodes?: string[];
  onSelectEpisode: (episode: EpisodeDto) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  film,
  episodes,
  currentEpisodeId,
  watchedEpisodes = [],
  onSelectEpisode,
}) => {
  const defaultPoster =
    film.posters.find((p) => p.type === "thumbnail") ||
    film.posters.find((p) => p.type === "default");
  const currentEpisode = episodes.find((ep) => ep.id === currentEpisodeId);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-linear-to-b from-yellow-400 to-orange-500 rounded-full" />
        <h3 className="text-xl font-bold text-white">Các bản chiếu</h3>
      </div>

      {/* Current Playing Card */}
      {currentEpisode && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-yellow-500/30 to-orange-500/30 rounded-2xl blur-lg opacity-50" />
          <div className="relative flex gap-4 p-4 bg-linear-to-r from-white/10 to-white/5 rounded-2xl border border-yellow-500/30 overflow-hidden">
            {/* Animated glow */}
            <div className="absolute inset-0 bg-linear-to-r from-yellow-500/5 to-transparent animate-pulse" />

            {/* Thumbnail */}
            <div className="relative w-40 h-24 rounded-xl overflow-hidden shrink-0">
              <img
                src={defaultPoster?.url}
                alt={film.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/50 rounded-full blur-md animate-ping" />
                  <div className="relative w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                  </div>
                </div>
              </div>
              {/* Subtitle indicator */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-xs text-white font-medium">Phụ đề</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 relative z-10">
              <h4 className="text-white font-bold text-lg truncate">
                {film.title}
              </h4>
              <p className="text-yellow-500/80 text-sm font-medium truncate mb-3">
                {film.englishTitle || film.originalTitle}
              </p>
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 text-sm font-bold px-3 py-1.5 rounded-lg border border-yellow-500/30">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span>Đang xem - Tập {currentEpisode.number}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Episodes Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {episodes.map((episode) => {
          const isCurrent = episode.id === currentEpisodeId;
          const isWatched = watchedEpisodes.includes(episode.id);

          return (
            <button
              key={episode.id}
              onClick={() => onSelectEpisode(episode)}
              className={`
                relative group h-12 rounded-xl flex items-center justify-center gap-1
                font-bold text-sm transition-all duration-300 overflow-hidden
                ${
                  isCurrent
                    ? "bg-linear-to-br from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/30"
                    : isWatched
                      ? "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-yellow-500/30 hover:text-yellow-400"
                }
              `}
            >
              {/* Glow effect for current */}
              {isCurrent && (
                <div className="absolute inset-0 bg-linear-to-r from-white/30 to-transparent animate-pulse" />
              )}

              <span className="relative z-10">{episode.number}</span>

              {isWatched && !isCurrent && (
                <Check className="w-3 h-3 relative z-10" />
              )}

              {isCurrent && (
                <Play className="w-3 h-3 relative z-10" fill="currentColor" />
              )}
            </button>
          );
        })}
      </div>

      {/* Server Selection */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-gray-400 text-sm">Chọn server:</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold shadow-lg shadow-yellow-500/20">
            Server VIP
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-all">
            Server #2
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-all">
            Server #3
          </button>
        </div>
      </div>
    </div>
  );
};
