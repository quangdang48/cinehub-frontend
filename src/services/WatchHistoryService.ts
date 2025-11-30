import type { CreateWatchHistoryDto } from "@/types/CreateWatchHistoryDto";
import ApiService from "./ApiService";

export class WatchHistoryService {
    /**
     * Ghi nhận/cập nhật lịch sử xem phim
     * Tạo mới hoặc cập nhật thời gian xem phim của người dùng
     * @param requestBody
     * @returns any Lịch sử xem được ghi nhận thành công
     * @throws ApiError
     */
    public static watchHistoryControllerRecordWatchV1(
        requestBody: CreateWatchHistoryDto,
    ): Promise<any> {
        return ApiService.post(`watch-history`, requestBody);
    }
    /**
     * Lấy danh sách lịch sử xem
     * Trả về danh sách tất cả các phim đã xem của người dùng
     * @returns any Danh sách lịch sử xem
     * @throws ApiError
     */
    public static watchHistoryControllerGetUserWatchHistoryV1(): Promise<any> {
        return ApiService.get(`watch-history`);
    }
    /**
     * Xóa toàn bộ lịch sử xem
     * Xóa tất cả các phim khỏi lịch sử xem của người dùng
     * @returns void
     * @throws ApiError
     */
    public static watchHistoryControllerClearWatchHistoryV1(): Promise<void> {
        return ApiService.delete(`watch-history`);
    }
    /**
     * Xóa một phim khỏi lịch sử xem
     * Xóa một phim cụ thể khỏi lịch sử xem của người dùng
     * @param filmId ID của phim cần xóa
     * @returns void
     * @throws ApiError
     */
    public static watchHistoryControllerRemoveFromWatchHistoryV1(
        filmId: string,
    ): Promise<void> {
        return ApiService.delete(`watch-history/${filmId}`);
    }
}
