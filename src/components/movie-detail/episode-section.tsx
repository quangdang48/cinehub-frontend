import React from "react";
import { Bell } from "lucide-react";
import type { FilmDto } from "@/types/FilmDto";
import type { SeasonDto } from "@/types/SeasonDto";
import type { EpisodeDto } from "@/types/EpisodeDto";

interface EpisodeSectionProps {
  film: FilmDto;
  seasons?: SeasonDto[];
  episodes?: EpisodeDto[];
  currentSeason?: number;
  onSelectSeason?: (seasonNumber: number) => void;
  onEpisodeClick?: (episode: EpisodeDto) => void;
}

export const EpisodeSection: React.FC<EpisodeSectionProps> = ({
  film,
  seasons = [],
  episodes,
  currentSeason = 1,
  onSelectSeason,
  onEpisodeClick,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="relative bg-linear-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-2xl p-4 mb-8 flex items-center gap-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-transparent animate-pulse"></div>
        <div className="bg-blue-600/20 p-2 rounded-full border border-blue-400/30 relative z-10">
          <Bell size={20} className="text-blue-400" />
        </div>
        {/* <p className="text-blue-100 text-sm font-medium relative z-10">
           Tập mới <span className="font-bold text-white bg-blue-500/20 px-2 py-0.5 rounded">{episodes.totalEpisodes}</span> sẽ phát sóng lúc <span className="font-bold text-yellow-400">14:00 - {movie.releaseDate}</span>.
         </p> */}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
            Danh sách tập
          </h3>
          
          {/* Season Selector */}
          {seasons.length > 1 && onSelectSeason && (
            <div className="relative w-32 sm:w-40">
              <select
                value={currentSeason}
                onChange={(e) => onSelectSeason(Number(e.target.value))}
                className="w-full appearance-none bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all cursor-pointer hover:bg-white/10"
              >
                {seasons.map((season) => (
                  <option key={season.id} value={season.number} className="bg-gray-900 text-white">
                    Mùa {season.number}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="text-xs font-bold text-black bg-yellow-500 px-3 py-1.5 rounded-lg shadow-lg shadow-yellow-500/20">
            Server VIP
          </button>
          <button className="text-xs font-bold text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
            Server #2
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {episodes?.map((ep, idx) => (
          <button
            key={ep.id}
            onClick={() => onEpisodeClick?.(ep)}
            className={`group relative h-12 rounded-xl flex items-center justify-center gap-2 border transition-all duration-300 overflow-hidden bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-yellow-500/50 hover:text-yellow-400`}
          >
            <span className="font-bold text-sm z-10 relative">
              Tập {ep.number}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
