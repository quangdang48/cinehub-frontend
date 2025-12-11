import React from 'react';
import { User } from 'lucide-react';
import type { ActorDto } from '@/types/ActorDto';

interface ActorGridProps {
  actors: ActorDto[];
  maxDisplay?: number;
  onViewAll?: () => void;
}

export const ActorGrid: React.FC<ActorGridProps> = ({
  actors,
  maxDisplay = 8,
  onViewAll,
}) => {
  const displayActors = actors.slice(0, maxDisplay);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Diễn viên</h3>
        {actors.length > maxDisplay && onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors"
          >
            Xem tất cả ({actors.length})
          </button>
        )}
      </div>

      {/* Actors Grid */}
      <div className="grid grid-cols-3 gap-4">
        {displayActors.map((actor) => (
          <div 
            key={actor.id} 
            className="group text-center cursor-pointer"
          >
            <div className="relative mx-auto mb-3">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-yellow-500/50 transition-all duration-300 shadow-lg">
                {actor.photoUrl ? (
                  <img 
                    src={actor.photoUrl} 
                    alt={actor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                )}
              </div>
              
              {/* Online indicator animation */}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-linear-to-br from-green-400 to-green-600 border-2 border-[#0f172a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" />
              </div>
            </div>

            {/* Name */}
            <p className="text-white text-sm font-bold group-hover:text-yellow-400 transition-colors line-clamp-1">
              {actor.name}
            </p>
            
            {/* Role */}
            {actor.bio && (
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                {actor.bio}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
