import { useState, useEffect } from "react";
import { EpisodesService } from "@/services/EpisodesService";
import type { EpisodeDto } from "@/types/EpisodeDto";

interface UseEpisodesDataReturn {
  episodes: EpisodeDto[];
  loading: boolean;
  error: string | null;
  refetch: (filmId: string, season: number) => Promise<void>;
}

export const useEpisodesData = (
  filmId: string | undefined,
  season: number = 1,
  enabled: boolean = true,
): UseEpisodesDataReturn => {
  const [episodes, setEpisodes] = useState<EpisodeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEpisodes = async (fId: string, s: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await EpisodesService.episodeControllerGetAllV1({
        filmId: fId,
        season: s,
      });
      setEpisodes(response.data);
    } catch (err) {
      console.error("Error fetching episodes:", err);
      setError("Không thể tải danh sách tập phim.");
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filmId && enabled) {
      fetchEpisodes(filmId, season);
    }
  }, [filmId, season, enabled]);

  return {
    episodes,
    loading,
    error,
    refetch: fetchEpisodes,
  };
};
