import { useState, useCallback } from 'react';

interface UseUserActionsReturn {
  isFavorite: boolean;
  isInWatchlist: boolean;
  theaterMode: boolean;
  toggleFavorite: () => void;
  toggleWatchlist: () => void;
  toggleTheaterMode: () => void;
  handleShare: () => void;
  handleReport: () => void;
}

export const useUserActions = (): UseUserActionsReturn => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);

  const toggleFavorite = useCallback(() => {
    setIsFavorite(prev => {
      const newValue = !prev;
      // TODO: Call API to update favorite status
      console.log('Toggle favorite:', newValue);
      return newValue;
    });
  }, []);

  const toggleWatchlist = useCallback(() => {
    setIsInWatchlist(prev => {
      const newValue = !prev;
      // TODO: Call API to update watchlist status
      console.log('Toggle watchlist:', newValue);
      return newValue;
    });
  }, []);

  const toggleTheaterMode = useCallback(() => {
    setTheaterMode(prev => !prev);
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.clipboard && window.location.href) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          // TODO: Show success toast notification
          console.log('Link copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
        });
    }
  }, []);

  const handleReport = useCallback(() => {
    // TODO: Open report modal
    console.log('Open report modal');
  }, []);

  return {
    isFavorite,
    isInWatchlist,
    theaterMode,
    toggleFavorite,
    toggleWatchlist,
    toggleTheaterMode,
    handleShare,
    handleReport,
  };
};
