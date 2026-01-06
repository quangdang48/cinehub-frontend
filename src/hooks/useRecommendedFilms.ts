import { useState, useEffect } from "react";
import { FilmService } from "@/services/FilmService";
import type { FilmDto } from "@/types/FilmDto";

interface UseRecommendedFilmsReturn {
  recommendedFilms: FilmDto[];
  loading: boolean;
  error: string | null;
}

export const useRecommendedFilms = (
  currentFilmId?: string,
  limit: number = 10,
): UseRecommendedFilmsReturn => {
  const [recommendedFilms, setRecommendedFilms] = useState<FilmDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedFilms = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await FilmService.filmControllerGetAll(1, limit);

        // Lọc bỏ phim hiện tại khỏi danh sách đề xuất
        const filteredFilms = currentFilmId
          ? response.data.filter((film) => film.id !== currentFilmId)
          : response.data;

        setRecommendedFilms(filteredFilms);
      } catch (err) {
        console.error("Error fetching recommended films:", err);
        setError("Không thể tải danh sách phim đề xuất.");
        setRecommendedFilms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedFilms();
  }, [currentFilmId, limit]);

  return { recommendedFilms, loading, error };
};
