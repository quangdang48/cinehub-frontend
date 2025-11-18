import React, { useState } from 'react';
import { Play, List, ChevronDown, Lightbulb } from 'lucide-react';

interface Episode {
  id: number;
  title: string;
  number: number;
}

interface EpisodeSectionProps {
  filmId: string;
}

export const EpisodeSection: React.FC<EpisodeSectionProps> = ({ filmId: _filmId }) => {
  const [selectedSeason] = useState(1);
  const [viewMode, setViewMode] = useState<'subtitle' | 'dubbed'>('subtitle');
  const [isExpanded, setIsExpanded] = useState(true);

  // Mock data - replace with actual API call
  const totalEpisodes = 24;
  const episodes: Episode[] = Array.from({ length: totalEpisodes }, (_, i) => ({
    id: i + 1,
    title: `Tập ${i + 1}`,
    number: i + 1,
  }));

  const displayedEpisodes = isExpanded ? episodes : episodes.slice(0, 8);

  return (
    <div className="bg-neutral-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          {/* Season Selector */}
          <button className="flex items-center gap-2 hover:text-neutral-300 transition">
            <List size={24} />
            <h2 className="text-2xl font-bold">Phần {selectedSeason}</h2>
            <ChevronDown size={20} className="text-neutral-400" />
          </button>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('subtitle')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  viewMode === 'subtitle'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Phụ đề
              </button>
              <button
                onClick={() => setViewMode('dubbed')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  viewMode === 'dubbed'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Thuyết minh
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              className="p-2 hover:bg-neutral-800 rounded-lg transition"
              title="Chế độ sáng/tối"
            >
              <Lightbulb size={20} />
            </button>
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {displayedEpisodes.map((episode) => (
            <button
              key={episode.id}
              className="bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 text-left transition group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Tập {episode.number}</span>
                <Play
                  size={24}
                  className="text-yellow-500 opacity-0 group-hover:opacity-100 transition"
                  fill="currentColor"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Toggle Button */}
        {totalEpisodes > 8 && (
          <div className="flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              {isExpanded ? 'Rút gọn' : `Xem thêm ${totalEpisodes - 8} tập`}
              <ChevronDown
                size={16}
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
