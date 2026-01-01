import { useState, useCallback } from "react";
import { toast } from "sonner";

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
          toast.info("Đã sao chép liên kết vào clipboard");
        })
        .catch(() => {
          toast.error("Không thể sao chép liên kết");
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
