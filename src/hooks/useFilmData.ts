import { useState, useEffect } from "react";
import { FilmService } from "@/services/FilmService";
import type { FilmDto } from "@/types/FilmDto";

interface UseFilmDataReturn {
  film: FilmDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFilmData = (filmId: string | undefined): UseFilmDataReturn => {
  const [film, setFilm] = useState<FilmDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilm = async () => {
    if (!filmId) {
      setError("Film ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await FilmService.filmControllerGetOneV1(filmId);
      setFilm(response.data);
    } catch (err) {
      console.error("Error fetching film:", err);
      setError("Không thể tải thông tin phim. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilm();
  }, [filmId]);

  return { film, loading, error, refetch: fetchFilm };
};
