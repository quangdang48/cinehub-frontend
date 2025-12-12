import type { FilmDto } from "@/types/FilmDto";
import { Star } from "lucide-react";

interface TrendingSectionProps {
  topFilms: FilmDto[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  topFilms,
}) => {
  return (
    <div className="w-full lg:w-96 shrink-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <Star className="text-yellow-400 fill-yellow-400" size={18} />
        </div>
        <h3 className="text-xl font-bold text-white">Top Trending</h3>
      </div>

      <div className="space-y-4">
        {topFilms.map((film, idx) => (
          <div
            key={film.id}
            className="group flex items-center gap-4 bg-[#0f172a]/40 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10 hover:shadow-lg relative overflow-hidden"
          >
            <div
              className={`text-5xl font-black italic -ml-2 w-14 text-center z-10 drop-shadow-lg
                  ${
                    idx === 0
                      ? "text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-yellow-700"
                      : idx === 1
                        ? "text-transparent bg-clip-text bg-linear-to-b from-gray-300 to-gray-500"
                        : idx === 2
                          ? "text-transparent bg-clip-text bg-linear-to-b from-orange-300 to-orange-700"
                          : "text-gray-700"
                  }`}
            >
              {idx + 1}
            </div>

            <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300">
              <img
                src={film.posters.find((p) => p.type === "default")?.url}
                alt={film.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="z-10 flex-1">
              <h4 className="text-white text-base font-bold group-hover:text-yellow-400 transition-colors line-clamp-1">
                {film.title}
              </h4>
              <p className="text-gray-400 text-xs mt-1 font-medium">
                {film.views}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <Star size={10} className="text-yellow-500 fill-current" />
                <span className="text-xs text-gray-500">9.5/10</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
