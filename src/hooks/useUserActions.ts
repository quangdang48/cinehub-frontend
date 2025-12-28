import { useState, useCallback } from "react";

interface UseUserActionsReturn {
  theaterMode: boolean;
  toggleTheaterMode: () => void;
  handleShare: () => void;
  handleReport: () => void;
}

export const useUserActions = (): UseUserActionsReturn => {
  const [theaterMode, setTheaterMode] = useState(false);

  const toggleTheaterMode = useCallback(() => {
    setTheaterMode((prev) => !prev);
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.clipboard && window.location.href) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          // TODO: Show success toast notification
          console.log("Link copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
        });
    }
  }, []);

  const handleReport = useCallback(() => {
    // TODO: Open report modal
    console.log("Open report modal");
  }, []);

  return {
    theaterMode,
    toggleTheaterMode,
    handleShare,
    handleReport,
  };
};
