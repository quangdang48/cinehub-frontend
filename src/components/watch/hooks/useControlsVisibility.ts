import { useState, useRef, useCallback } from "react";

interface UseControlsVisibilityProps {
  isPlaying: boolean;
  hideDelay?: number;
}

export const useControlsVisibility = ({
  isPlaying,
  hideDelay = 3000,
}: UseControlsVisibilityProps) => {
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isPlaying) {
      timeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, hideDelay);
    }
  }, [isPlaying, hideDelay]);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setShowControls(false);
    }
  }, [isPlaying]);

  return {
    showControls,
    handleMouseMove,
    handleMouseLeave,
  };
};
