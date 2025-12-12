import { useState, useEffect } from "react";
import { StreamingService } from "@/services/StreamingService";
import type { FilmDto } from "@/types/FilmDto";

interface UseStreamingUrlParams {
  filmId: string | undefined;
  filmType: FilmDto["type"] | undefined;
  season?: number;
  episode?: number;
  enabled?: boolean;
}

interface UseStreamingUrlReturn {
  streamUrl: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStreamingUrl = ({
  filmId,
  filmType,
  season,
  episode,
  enabled = true,
}: UseStreamingUrlParams): UseStreamingUrlReturn => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreamUrl = async () => {
    if (!filmId || !enabled || !filmType) {
      return;
    }

    if (
      filmType === "SERIES" &&
      (season === undefined || episode === undefined)
    ) {
      console.log("Waiting for episode data...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Movie chỉ cần filmId, Series cần cả season và episode
      const params =
        filmType === "MOVIE" ? { filmId } : { filmId, season, episode };

      // const response =
      //   await StreamingService.streamControllerGetSubscriptionByUserIdV1(
      //     params,
      //   );

      // if (response.data?.url) {
      //   setStreamUrl(response.data.url);
      // } else {
      //   throw new Error("No streaming URL available");
      // }
      setStreamUrl(
        "http://localhost:3000/api/v1/streaming?filmId=" +
          filmId +
          (season ? "&season=" + season : "") +
          (episode ? "&episode=" + episode : ""),
      );
    } catch (err: any) {
      console.error("Error fetching streaming URL:", err);

      // Handle specific error cases
      if (err.status === 401 || err.status === 403) {
        setError("Bạn cần đăng nhập hoặc nâng cấp gói để xem nội dung này.");
      } else if (err.status === 404) {
        setError("Không tìm thấy video này.");
      } else {
        setError("Không thể tải video. Vui lòng thử lại sau.");
      }
      setStreamUrl(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreamUrl();
  }, [filmId, filmType, season, episode, enabled]);

  return {
    streamUrl,
    loading,
    error,
    refetch: fetchStreamUrl,
  };
};
