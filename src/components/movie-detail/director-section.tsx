import type { DirectorDto } from "@/types/DirectorDto";
import { normalizeUrl } from "@/utils/videoUtils";

interface DirectorSectionProps {
  directors: DirectorDto[];
}

export const DirectorSection: React.FC<DirectorSectionProps> = ({ directors }) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-3">
        Đạo diễn
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {directors.map((director) => (
          <div key={director.id} className="group text-center">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-yellow-400 transition-all shadow-lg group-hover:shadow-yellow-500/20 mb-3">
              <img
                src={
                  director.photoUrl ? normalizeUrl(director.photoUrl) :
                  "https://randomuser.me/api/portraits/men/1.jpg"
                }
                alt={director.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <p className="text-white text-sm font-bold group-hover:text-yellow-400 transition-colors">
              {director.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
