import type { FilmDto } from "@/types/FilmDto";

export const getVideoPoster = (film: FilmDto | null): string | undefined => {
  if (!film) return undefined;

  const backdropPoster = film.posters.find((p) => p.type === "backdrop");
  const thumbnailPoster = film.posters.find((p) => p.type === "thumbnail");

  return backdropPoster?.url || thumbnailPoster?.url;
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
