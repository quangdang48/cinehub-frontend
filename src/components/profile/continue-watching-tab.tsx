import { useEffect, useState, useRef, useCallback } from "react";
import { WatchHistoryService } from "@/services/WatchHistoryService";
import type { WatchHistoryDto } from "@/types/WatchHistoryDto";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { HistoryItem } from "./history-item";

export default function ContinueWatchingTab() {
  const [history, setHistory] = useState<WatchHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const fetchHistory = async (pageNum: number, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const response = await WatchHistoryService.watchHistoryControllerGetUserWatchHistoryV1(pageNum, 10);
      const newData = response.data;

      if (newData.length < 10) {
        setHasMore(false);
      }

      setHistory((prev) => (isLoadMore ? [...prev, ...newData] : newData));
    } catch (error) {
      console.error("Failed to fetch watch history:", error);
      toast.error("Không thể tải lịch sử xem");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchHistory(nextPage, true);
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  const handleRemove = async (filmId: string) => {
    try {
      await WatchHistoryService.watchHistoryControllerRemoveFromWatchHistoryV1(filmId);
      setHistory((prev) => prev.filter((item) => item.film?.id !== filmId));
      toast.success("Đã xóa khỏi lịch sử xem");
    } catch (error) {
      console.error("Failed to remove from history:", error);
      toast.error("Không thể xóa phim khỏi lịch sử");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem?")) return;
    try {
      await WatchHistoryService.watchHistoryControllerClearWatchHistoryV1();
      setHistory([]);
      toast.success("Đã xóa toàn bộ lịch sử xem");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Lỗi khi xóa lịch sử");
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex justify-center py-12 bg-gray-900 rounded-lg border border-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (history.length === 0 && !loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Xem tiếp</h2>
          <p className="text-gray-400 text-sm">Các phim bạn đang xem dở</p>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Chưa có phim nào đang xem
          </h3>
          <p className="text-gray-400 mb-6">
            Bắt đầu xem phim để theo dõi tiến trình
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition"
          >
            Khám phá phim
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800 min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Xem tiếp</h2>
          <p className="text-gray-400 text-sm">Các phim bạn đang xem dở</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-400 hover:text-red-300 hover:underline"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {history.map((item, index) => (
          item.film && (
            <div 
              key={item.id} 
              ref={index === history.length - 1 ? lastElementRef : null}
            >
              <HistoryItem
                item={item}
                onRemove={handleRemove}
              />
            </div>
          )
        ))}
      </div>
      
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
        </div>
      )}
    </div>
  );
}
