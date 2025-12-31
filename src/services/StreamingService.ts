import type { HeartbeatDto } from "@/types/HeartbeatDto";
import ApiService from "./ApiService";
import type { ApiResponse } from "@/types/ApiResponse";

export class StreamingService {
  /**
   * Lấy URL streaming của phim
   * @returns StreamingApiResponseDto Lấy URL streaming của phim
   * @throws ApiError
   */
  public static streamControllerGetStreamingFileV1({
    filmId,
    season,
    episode,
  }: {
    filmId: string;
    /**
     * Số mùa (nếu có)
     */
    season?: number;
    /**
     * Số tập (nếu có)
     */
    episode?: number;
  }): any {
    return ApiService.get("streaming", {
      params: {
        filmId,
        season,
        episode,
      },
    });
  }

  /**
   * Gửi tín hiệu heartbeat khi đang xem phim
   * Backend sử dụng heartbeat để theo dõi tiến độ xem phim
   * @throws ApiError
   */
  public static sendHeartbeat({
    filmId,
    season,
    episode,
    requestBody,
  }: {
    filmId: string;
    /**
     * Số mùa (nếu có)
     */
    season?: number;
    /**
     * Số tập (nếu có)
     */
    episode?: number;
    requestBody: HeartbeatDto;
  }): Promise<ApiResponse<{watchId: string}>> {
    return ApiService.post("streaming/heartbeat", requestBody, {
      params: {
        filmId,
        season,
        episode,
      },
    });
  }
}
