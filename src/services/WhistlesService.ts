import ApiService from "./ApiService";

export class WhistlesService {
  /**
   * Thêm phim vào danh sách yêu thích
   * Thêm một phim vào danh sách yêu thích của người dùng
   * @param filmId ID của phim cần thêm
   * @returns any Phim đã được thêm vào danh sách yêu thích
   * @throws ApiError
   */
  public static whistlesControllerAddToWhistlesV1(
    filmId: string,
  ): Promise<any> {
    return ApiService.post(`whistles/${filmId}`);
  }
  /**
   * Xóa phim khỏi danh sách yêu thích
   * Xóa một phim khỏi danh sách yêu thích của người dùng
   * @param filmId ID của phim cần xóa
   * @returns void
   * @throws ApiError
   */
  public static whistlesControllerRemoveFromWhistlesV1(
    filmId: string,
  ): Promise<void> {
    return ApiService.delete(`whistles/${filmId}`);
  }
  /**
   * Lấy danh sách phim yêu thích
   * Trả về danh sách tất cả các phim yêu thích của người dùng
   * @returns any Danh sách phim yêu thích
   * @throws ApiError
   */
  public static whistlesControllerGetUserWhistlesV1(): Promise<any> {
    return ApiService.get(`whistles`);
  }
  /**
   * Kiểm tra phim có trong danh sách yêu thích
   * Kiểm tra xem một phim cụ thể có trong danh sách yêu thích hay không
   * @param filmId ID của phim cần kiểm tra
   * @returns any Kết quả kiểm tra
   * @throws ApiError
   */
  public static whistlesControllerIsInWhistlesV1(filmId: string): Promise<any> {
    return ApiService.get(`whistles/check/${filmId}`);
  }
}
