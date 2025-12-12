import { useState, useEffect, useCallback } from "react";

interface UseVideoStateProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

export interface VideoState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  isLoading: boolean;
  playbackRate: number;
}

export const useVideoState = ({
  videoRef,
  onTimeUpdate,
  onEnded,
}: UseVideoStateProps) => {
  const [state, setState] = useState<VideoState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    isLoading: true,
    playbackRate: 1,
  });

  const updateState = useCallback((updates: Partial<VideoState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlers = {
      play: () => updateState({ isPlaying: true }),
      pause: () => updateState({ isPlaying: false }),
      volumechange: () => {
        updateState({
          volume: video.volume,
          isMuted: video.muted,
        });
      },
      loadedmetadata: () => {
        updateState({
          duration: video.duration,
          isLoading: false,
        });
      },
      timeupdate: () => {
        updateState({ currentTime: video.currentTime });
        onTimeUpdate?.(video.currentTime, video.duration);
      },
      progress: () => {
        if (video.buffered.length > 0) {
          updateState({
            buffered: video.buffered.end(video.buffered.length - 1),
          });
        }
      },
      waiting: () => updateState({ isLoading: true }),
      canplay: () => updateState({ isLoading: false }),
      ended: () => {
        updateState({ isPlaying: false });
        onEnded?.();
      },
      ratechange: () => {
        updateState({ playbackRate: video.playbackRate });
      },
    };

    // Đăng ký tất cả event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    // Cleanup
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, [videoRef, onTimeUpdate, onEnded, updateState]);

  return { state, updateState };
};
