import { useState, useEffect, useCallback } from 'react';

export interface QualityLevel {
  height: number;
  label: string;
}

interface UseQualityLevelsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hlsRef?: React.RefObject<any>; // Hls instance
}

interface UseQualityLevelsReturn {
  availableQualities: QualityLevel[];
  currentQuality: number;
  setQuality: (height: number) => void;
}

/**
 * Custom hook để quản lý quality levels của video
 * Hỗ trợ cả HLS (adaptive streaming) và regular video
 */
export const useQualityLevels = ({
  videoRef,
  hlsRef,
}: UseQualityLevelsProps): UseQualityLevelsReturn => {
  const [availableQualities, setAvailableQualities] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto

  // Detect available qualities
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateQualities = () => {
      const qualities: QualityLevel[] = [
        { height: -1, label: 'Auto' }, // Auto quality
      ];

      // Nếu có HLS instance, lấy levels từ HLS
      if (hlsRef?.current) {
        const hls = hlsRef.current;
        if (hls.levels && hls.levels.length > 0) {
          // Sắp xếp theo độ phân giải từ thấp đến cao
          const hlsQualities = hls.levels
            .map((level: any) => ({
              height: level.height,
              label: `${level.height}p`,
            }))
            .sort((a: QualityLevel, b: QualityLevel) => a.height - b.height);
          
          qualities.push(...hlsQualities);
        }
      } else if (video.videoHeight) {
        // Fallback: dựa trên video dimensions
        const height = video.videoHeight;
        const standardQualities = [360, 480, 720, 1080, 1440, 2160];
        
        // Chỉ hiển thị các quality <= video height
        const availableHeights = standardQualities.filter(h => h <= height);
        
        qualities.push(
          ...availableHeights.map(h => ({
            height: h,
            label: `${h}p`,
          }))
        );
      }

      setAvailableQualities(qualities);
    };

    // Đợi video metadata load
    if (video.readyState >= 1) {
      updateQualities();
    }

    video.addEventListener('loadedmetadata', updateQualities);
    return () => video.removeEventListener('loadedmetadata', updateQualities);
  }, [videoRef, hlsRef]);

  // Set quality
  const setQuality = useCallback((height: number) => {
    if (hlsRef?.current) {
      const hls = hlsRef.current;
      
      if (height === -1) {
        // Auto quality
        hls.currentLevel = -1;
      } else {
        // Find matching level
        const levelIndex = hls.levels.findIndex((level: any) => level.height === height);
        if (levelIndex !== -1) {
          hls.currentLevel = levelIndex;
        }
      }
    }
    
    setCurrentQuality(height);
  }, [hlsRef]);

  return {
    availableQualities,
    currentQuality,
    setQuality,
  };
};
