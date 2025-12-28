import { useState, useEffect, useCallback } from "react";
import { SeasonsService } from "@/services/SeasonsService";
import type { SeasonDto } from "@/types/SeasonDto";

interface UseSeasonsDataReturn {
  seasons: SeasonDto[];
  loading: boolean;
  error: string | null;
  refetch: (filmId: string) => Promise<void>;
}

export const useSeasonsData = (
  filmId: string | undefined,
  enabled: boolean = true,
): UseSeasonsDataReturn => {
  const [seasons, setSeasons] = useState<SeasonDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasons = useCallback(async (fId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await SeasonsService.seasonControllerGetAllV1({
        filmId: fId,
        limit: 100, // Lấy tất cả mùa
        sort: JSON.stringify({ number: "ASC" }),
      });
      setSeasons(response.data || []);
    } catch (err) {
      console.error("Error fetching seasons:", err);
      setError("Không thể tải danh sách mùa phim.");
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filmId && enabled) {
      fetchSeasons(filmId);
    }
  }, [filmId, enabled, fetchSeasons]);

  return {
    seasons,
    loading,
    error,
    refetch: fetchSeasons,
  };
};
