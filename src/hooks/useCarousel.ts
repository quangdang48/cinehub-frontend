import type { PaginatedApiResponse } from "@/types/ApiResponse";
import { useState, useEffect, useCallback } from "react";

export function useCarouselData<T>(
  fetchFunction: (page?: number, pageSize?: number, sort?: string) => Promise<PaginatedApiResponse<T>>,
  pageSize: number = 10,
) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(
      async (pageNumber: number, sort?: string, resetList: boolean = false) => {
        if (loading) return;
  
        setLoading(true);
        try {
          const res = await fetchFunction(pageNumber, pageSize, sort);
          const newItems = res.data;
  
          if (resetList) {
            setItems(newItems);
          } else {
            setItems((prev) => [...prev, ...newItems]);
          }
          setHasMore(newItems.length === pageSize);
          setPage(pageNumber);
        } catch (error) {
          console.error("Error loading films:", error);
        } finally {
          setLoading(false);
        }
      },
      [loading]
    );

  useEffect(() => {
    load(1, undefined, true);
  }, []);

  const loadMore = () => {
    if (hasMore && !loading) {
      load(page + 1);
    }
  };

  return {
    items,
    loading,
    hasMore,
    loadMore,
  };
}
