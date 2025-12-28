import { useEffect, useRef, useCallback } from "react";
import { StreamingService } from "@/services/StreamingService";

interface UseHeartbeatProps {
  filmId: string | undefined;
  season?: number;
  episode?: number;
  isPlaying: boolean;
  intervalMs?: number;
}

/**
 * Hook để gửi heartbeat định kỳ khi người dùng đang xem video
 * Heartbeat được gửi mỗi 30 giây (mặc định) khi video đang phát
 */
export const useHeartbeat = ({
  filmId,
  season,
  episode,
  isPlaying,
  intervalMs = 10000, // 10 seconds default
}: UseHeartbeatProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHeartbeatRef = useRef<number>(0);

  const sendHeartbeat = useCallback(async () => {
    if (!filmId) return;

    try {
      await StreamingService.sendHeartbeat({
        filmId,
        season,
        episode,
      });
      lastHeartbeatRef.current = Date.now();
      console.log("Heartbeat sent successfully");
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
        }).catch(() => {});
      }
    };
  }, []);

  return {
    sendHeartbeat,
    lastHeartbeat: lastHeartbeatRef.current,
  };
};
