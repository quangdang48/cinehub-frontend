import { useCallback } from 'react';
import type { VideoState } from './useVideoState';

interface UseVideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  state: VideoState;
}

export const useVideoControls = ({ videoRef, state }: UseVideoControlsProps) => {
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (state.isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, [videoRef, state.isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !state.isMuted;
  }, [videoRef, state.isMuted]);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    video.volume = clampedVolume;
    
    if (clampedVolume === 0) {
      video.muted = true;
    } else if (state.isMuted) {
      video.muted = false;
    }
  }, [videoRef, state.isMuted]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(state.duration, time));
  }, [videoRef, state.duration]);

  const seekToPercent = useCallback((percent: number) => {
    const video = videoRef.current;
    if (!video) return;

    const time = (percent / 100) * state.duration;
    video.currentTime = time;
  }, [videoRef, state.duration]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = video.currentTime + seconds;
    video.currentTime = Math.max(0, Math.min(state.duration, newTime));
  }, [videoRef, state.duration]);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
  }, [videoRef]);

  const togglePictureInPicture = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  }, [videoRef]);

  return {
    togglePlay,
    toggleMute,
    setVolume,
    seek,
    seekToPercent,
    skip,
    setPlaybackRate,
    togglePictureInPicture,
  };
};
