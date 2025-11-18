import React, { useState } from 'react';

interface Episode {
  id: number;
  title: string;
  number: number;
}

interface EpisodeSectionProps {
  filmId: string;
}

export const EpisodeSection: React.FC<EpisodeSectionProps> = ({ filmId }) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [viewMode, setViewMode] = useState<'episodes' | 'subtitles'>('episodes');

  // Mock data - replace with actual API call
  const episodes: Episode[] = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    title: `Tập ${i + 1}`,
    number: i + 1,
  }));

  return (
    <div className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <h2 className="text-2xl font-bold">Phần 1</h2>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('episodes')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  viewMode === 'episodes'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Phụ đề
              </button>
              <button
                onClick={() => setViewMode('subtitles')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  viewMode === 'subtitles'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Thuyết minh (Giọng Rác)
              </button>
            </div>

            {/* Toggle Light/Dark */}
            <button className="p-2 hover:bg-gray-800 rounded-full transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {episodes.map((episode) => (
            <button
              key={episode.id}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-left transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">Tập {episode.number}</span>
                <svg
                  className="w-8 h-8 text-yellow-500 opacity-0 group-hover:opacity-100 transition"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
