import type { PaginatedApiResponse } from "@/types/ApiResponse";
import { useState, useEffect } from "react";

export function useCarouselData<T>(
  fetchFunction: (page?: number, pageSize?: number, sort?: string) => Promise<PaginatedApiResponse<T>>,
  pageSize: number = 10,
) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function load(pageNum?: number, sort?: string) {
    try {
      setLoading(true);
      const res = await fetchFunction(pageNum, pageSize, sort);

      setItems(prev => [...prev, ...res.data as T[]]);

      if ((res.data as T[]).length < res.itemsPerPage) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }

  const loadMore = () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setPage(next);
    load(next);
  };

  useEffect(() => {
    load(1);
  }, []);

  return {
    items,
    loading,
    hasMore,
    loadMore,
  };
}
