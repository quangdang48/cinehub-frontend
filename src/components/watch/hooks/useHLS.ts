import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { normalizeUrl } from "../../../utils/videoUtils";
import { useAuth } from "@/hooks";

interface UseHLSProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  src: string;
  onError?: (error: any) => void;
}

export const useHLS = ({ videoRef, src, onError }: UseHLSProps) => {
  const hlsRef = useRef<Hls | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Kiểm tra nếu URL là m3u8 (HLS)
    // const isHLS = src.includes(".m3u8");

    // Cleanup HLS instance cũ nếu có
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      // Sử dụng HLS.js cho trình duyệt không hỗ trợ native HLS
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        xhrSetup: (xhr, url) => {
            if (token && url.includes("localhost")) {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            }
        }
      });
      hls.loadSource(normalizeUrl(src));
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded");
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error("Fatal HLS error:", data);
          let errorMessage = 'Lỗi phát video';
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              errorMessage = 'Lỗi mạng khi tải video. Vui lòng kiểm tra kết nối internet.';
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              errorMessage = 'Lỗi giải mã video. Đang thử khôi phục...';
              hls.recoverMediaError();
              break;
            default:
              errorMessage = 'Không thể phát video. Vui lòng thử lại sau.';
              hls.destroy();
              break;
          }
          onError?.({
            ...data,
            message: errorMessage
          });
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
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
