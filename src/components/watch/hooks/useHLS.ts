import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { normalizeUrl } from '../../../utils/videoUtils';

interface UseHLSProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  src: string;
  onError?: (error: any) => void;
}

export const useHLS = ({ videoRef, src, onError }: UseHLSProps) => {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Kiểm tra nếu URL là m3u8 (HLS)
    const isHLS = src.includes('.m3u8');

    // Cleanup HLS instance cũ nếu có
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isHLS && Hls.isSupported()) {
      // Sử dụng HLS.js cho trình duyệt không hỗ trợ native HLS
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
      });
      hls.loadSource(normalizeUrl(src));
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded');
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Cannot recover from error, destroying HLS instance');
              hls.destroy();
              onError?.(data);
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari và iOS hỗ trợ native HLS
      video.src = src;
    } else {
      // Fallback cho các format video khác (mp4, webm, etc.)
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, videoRef, onError]);

  return hlsRef;
};
