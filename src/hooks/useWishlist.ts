import { useState, useEffect, useCallback } from 'react';
import { WhistlesService } from '@/services/WhistlesService';
import { useAppSelector } from '@/store';

interface WishlistItem {
  id: string;
  filmId: string;
  createdAt: string;
  updatedAt: string;
}

interface WishlistResponse {
  success: boolean;
  data: {
    data: WishlistItem[];
    total: number;
  };
}

export function useWishlist(filmId?: string) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signedIn, token } = useAppSelector((state) => state.auth.session);

  // Check if a specific film is in wishlist
  const checkWishlistStatus = useCallback(async () => {
    if (!filmId || !signedIn || !token) {
      setIsInWishlist(false);
      return;
    }

    try {
      setLoading(true);
      const response = await WhistlesService.whistlesControllerIsInWhistlesV1(
        filmId
      );
      setIsInWishlist(response?.data?.inWhistles || false);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
      setIsInWishlist(false);
    } finally {
      setLoading(false);
    }
  }, [filmId, signedIn, token]);

  // Fetch all wishlist items
  const fetchWishlist = useCallback(async () => {
    if (!signedIn || !token) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: WishlistResponse =
        await WhistlesService.whistlesControllerGetUserWhistlesV1();
      setWishlistItems(response?.data?.data || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Không thể tải danh sách yêu thích');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [signedIn, token]);

  // Add film to wishlist
  const addToWishlist = useCallback(
    async (id: string) => {
      if (!signedIn || !token) {
        return {
          success: false,
          message: 'Vui lòng đăng nhập để thêm vào yêu thích',
        };
      }

      try {
        setLoading(true);
        await WhistlesService.whistlesControllerAddToWhistlesV1(id);
        if (filmId === id) {
          setIsInWishlist(true);
        }
        return { success: true, message: 'Đã thêm vào danh sách yêu thích' };
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        const message =
          error?.response?.data?.message || 'Không thể thêm vào yêu thích';
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [signedIn, token, filmId]
  );

  // Remove film from wishlist
  const removeFromWishlist = useCallback(
    async (id: string) => {
      if (!signedIn || !token) {
        return { success: false, message: 'Vui lòng đăng nhập' };
      }

      try {
        setLoading(true);
        await WhistlesService.whistlesControllerRemoveFromWhistlesV1(id);
        if (filmId === id) {
          setIsInWishlist(false);
        }
        // Update local state
        setWishlistItems((prev) => prev.filter((item) => item.filmId !== id));
        return { success: true, message: 'Đã xóa khỏi danh sách yêu thích' };
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        const message =
          error?.response?.data?.message || 'Không thể xóa khỏi yêu thích';
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [signedIn, token, filmId]
  );

  // Toggle wishlist status
  const toggleWishlist = useCallback(
    async (id?: string) => {
      const targetId = id || filmId;
      if (!targetId) return { success: false, message: 'Film ID không hợp lệ' };

      if (isInWishlist) {
        return removeFromWishlist(targetId);
      } else {
        return addToWishlist(targetId);
      }
    },
    [isInWishlist, filmId, addToWishlist, removeFromWishlist]
  );

  // Check status when filmId changes
  useEffect(() => {
    if (filmId) {
      checkWishlistStatus();
    }
  }, [filmId, checkWishlistStatus]);

  return {
    isInWishlist,
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    checkWishlistStatus,
    isAuthenticated: signedIn,
  };
}
