import { useEffect, useRef, useCallback } from "react";
import { StreamingService } from "@/services/StreamingService";

interface UseHeartbeatProps {
  filmId: string | undefined;
  season?: number;
  episode?: number;
  isPlaying: boolean;
  currentTime?: number;
  intervalMs?: number;
}

export const useHeartbeat = ({
  filmId,
  season,
  episode,
  isPlaying,
  currentTime = 0,
  intervalMs = 10000, // 10 seconds default
}: UseHeartbeatProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHeartbeatRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(currentTime);
  const watchIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const sendHeartbeat = useCallback(async () => {
    if (!filmId) return;
    console.log("lastHeartbeatRef.current", lastHeartbeatRef.current);

    try {
      const response = await StreamingService.sendHeartbeat({
        filmId,
        season,
        episode,
        requestBody: {
          currentTime: currentTimeRef.current,
          watchId: watchIdRef.current,
        },
      });
      watchIdRef.current = response.data.watchId;
      lastHeartbeatRef.current = Date.now();
    } catch (error) {
      console.error("Failed to send heartbeat:", error);
    }
  }, [filmId, season, episode]);

  useEffect(() => {
    // Clear interval khi không còn phát
    if (!isPlaying || !filmId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Gửi heartbeat ngay lập tức khi bắt đầu phát
    sendHeartbeat();

    // Thiết lập interval để gửi heartbeat định kỳ
    intervalRef.current = setInterval(() => {
      sendHeartbeat();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, filmId, season, episode, intervalMs, sendHeartbeat]);

  // Gửi heartbeat khi component unmount nếu đang phát
  useEffect(() => {
    return () => {
      if (isPlaying && filmId) {
        // Fire and forget - không cần await
        StreamingService.sendHeartbeat({
          filmId,
          season,
          episode,
          requestBody: { currentTime: currentTimeRef.current },
        }).catch(() => {});
      }
    };
  }, []);

  return {
    sendHeartbeat,
    lastHeartbeat: lastHeartbeatRef.current,
  };
};
