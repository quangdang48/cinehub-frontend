import ApiService from "./ApiService";

export class StreamingService {
  /**
   * Lấy URL streaming của phim
   * @returns StreamingApiResponseDto Lấy URL streaming của phim
   * @throws ApiError
   */
  public static streamControllerGetSubscriptionByUserIdV1({
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
  }): Promise<void> {
    return ApiService.post("streaming/heartbeat", undefined, {
      params: {
        filmId,
        season,
        episode,
      },
    });
  }
}
