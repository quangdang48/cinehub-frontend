import type { CastDto } from "@/types/CastDto";

interface ActorSectionProps {
    casts: CastDto[];
}

export const ActorSection: React.FC<ActorSectionProps> = ({ casts }) => {
  return (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-3">Diễn viên chính</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {casts.map(cast => (
                <div key={cast.id} className="group text-center">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-yellow-400 transition-all shadow-lg group-hover:shadow-yellow-500/20 mb-3">
                    <img src={cast.actor.photoUrl || 'https://randomuser.me/api/portraits/women/2.jpg'} alt={cast.actor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-white text-sm font-bold group-hover:text-yellow-400 transition-colors">{cast.actor.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{cast.actor.bio}</p>
                </div>
            ))}
        </div>
    </div>
  );
};