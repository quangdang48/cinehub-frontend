import type { FilmDto } from "@/types/FilmDto";
import { Play } from "lucide-react";

interface TrailerSectionProps {
  film: FilmDto;
}

export const TrailerSection: React.FC<TrailerSectionProps> = ({ film }) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-3">Trailer & Teaser</h3>
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0" // Dummy ID, replace with actual ID parsed from trailerUrl if needed
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
         {/* Fake additional trailers */}
         {[1, 2, 3].map(i => (
             <div key={i} className="w-48 shrink-0 cursor-pointer group">
                 <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative mb-2 border border-white/5 group-hover:border-yellow-400 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-all">
                        <Play size={24} className="text-white opacity-80 group-hover:scale-110 transition-transform"/>
                    </div>
                 </div>
                 <p className="text-gray-300 text-xs font-medium group-hover:text-yellow-400 truncate">Teaser Official #{i}</p>
             </div>
         ))}
      </div>
    </div>
  )
}