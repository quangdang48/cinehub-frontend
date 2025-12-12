import { useState, useEffect, useCallback } from 'react';
import type { EpisodeDto } from '@/types/EpisodeDto';

interface UseCurrentEpisodeParams {
  episodes: EpisodeDto[];
  episodeNumberFromUrl?: string | null;
}

interface UseCurrentEpisodeReturn {
  currentEpisode: EpisodeDto | null;
  setCurrentEpisode: (episode: EpisodeDto) => void;
  selectNextEpisode: () => boolean;
  selectPreviousEpisode: () => boolean;
}

export const useCurrentEpisode = ({
  episodes,
  episodeNumberFromUrl,
}: UseCurrentEpisodeParams): UseCurrentEpisodeReturn => {
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeDto | null>(null);

  // Set current episode khi episodes load hoặc URL thay đổi
  useEffect(() => {
    if (episodes.length === 0) {
      setCurrentEpisode(null);
      return;
    }

    // Nếu có episode number từ URL, tìm episode đó
    if (episodeNumberFromUrl) {
      const episodeNumber = parseInt(episodeNumberFromUrl);
      const foundEpisode = episodes.find(ep => ep.number === episodeNumber);
      if (foundEpisode) {
        setCurrentEpisode(foundEpisode);
        return;
      }
    }
    // Default: chọn episode đầu tiên
    setCurrentEpisode(episodes[0]);
  }, [episodes, episodeNumberFromUrl]);

  // Select next episode
  const selectNextEpisode = useCallback((): boolean => {
    if (!currentEpisode || episodes.length === 0) return false;

    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
      return true;
    }
    return false;
  }, [currentEpisode, episodes]);

  // Select previous episode
  const selectPreviousEpisode = useCallback((): boolean => {
    if (!currentEpisode || episodes.length === 0) return false;

    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex > 0) {
      setCurrentEpisode(episodes[currentIndex - 1]);
      return true;
    }
    return false;
  }, [currentEpisode, episodes]);

  return {
    currentEpisode,
    setCurrentEpisode,
    selectNextEpisode,
    selectPreviousEpisode,
  };
};
