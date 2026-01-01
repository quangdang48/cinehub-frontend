import type { FilmDto } from "@/types/FilmDto";
import { normalizeUrl } from "./videoUtils";

export const getVideoPoster = (film: FilmDto | null): string | undefined => {
  if (!film) return undefined;

  const backdropPoster = film.posters.find((p) => p.type === "backdrop");
  const thumbnailPoster = film.posters.find((p) => p.type === "thumbnail");

  return backdropPoster ? normalizeUrl(backdropPoster.url) : thumbnailPoster ? normalizeUrl(thumbnailPoster.url) : undefined;
};

export const getVideoTitle = (
  film: FilmDto | null,
  episodeNumber?: number,
): string => {
  if (!film) return "";

  if (episodeNumber !== undefined) {
    return `${film.title} - Tập ${episodeNumber}`;
  }

  return film.title;
};

export const isSeries = (film: FilmDto | null): boolean => {
  return film?.type === "SERIES";
};

export const getFilmHlsUrl = (filmId: string, season?: number, episode?: number): string => {
  if (!filmId) return "";
  const params = new URLSearchParams({ filmId });
  if (season !== undefined && episode !== undefined) {
    params.append("season", season.toString());
    params.append("episode", episode.toString());
  }
  return `http://localhost:8080/api/v1/streaming?${params.toString()}`;
}
