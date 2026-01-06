import type { PaginatedDirectorApiResponseDto } from "@/types/PaginatedDirectorApiResponseDto";
import ApiService from "./ApiService";
import type { CreateDirectorDto } from "@/types/CreateDirectorDto";
import type { DirectorApiResponseDto } from "@/types/DirectorApiResponseDto";
import type { UpdateDirectorDto } from "@/types/UpdateDirectorDto";

export class DirectorsService {
  /**
   * Lấy danh sách đạo diễn
   * @returns PaginatedDirectorApiResponseDto Lấy danh sách đạo diễn
   * @throws ApiError
   */
  public static directorControllerGetAllV1({
    page = 1,
    limit = 10,
    sort,
    search,
  }: {
    /**
     * Current page
     */
    page?: number;
    /**
     * Items per page
     */
    limit?: number;
    /**
     * Sort, e.g: {"createdAt":"DESC"}
     */
    sort?: string;
    /**
     * query string for search
     */
    search?: string;
  }): Promise<PaginatedDirectorApiResponseDto> {
    return ApiService.get("directors", {
      params: {
        page,
        limit,
        sort,
        search,
      },
    });
  }
  /**
   * @returns DirectorApiResponseDto Tạo đạo diễn mới
   * @throws ApiError
   */
  public static directorControllerCreateDirectorV1({
    requestBody,
  }: {
    requestBody: CreateDirectorDto;
  }): Promise<DirectorApiResponseDto> {
    return ApiService.post("directors", requestBody);
  }
  /**
   * Lấy thông tin đạo diễn theo ID
   * @returns DirectorApiResponseDto Lấy thông tin đạo diễn theo ID
   * @throws ApiError
   */
  public static directorControllerGetDirectorByIdV1({
    id,
  }: {
    /**
     * Director ID
     */
    id: string;
  }): Promise<DirectorApiResponseDto> {
    return ApiService.get(`directors/${id}`);
  }
  /**
   * Cập nhật thông tin đạo diễn
   * @returns DirectorApiResponseDto Cập nhật thông tin đạo diễn
   * @throws ApiError
   */
  public static directorControllerUpdateDirectorV1({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: UpdateDirectorDto;
  }): Promise<DirectorApiResponseDto> {
    return ApiService.put(`directors/${id}`, requestBody);
  }
  /**
   * Xóa đạo diễn
   * @returns any Xóa đạo diễn
   * @throws ApiError
   */
  public static directorControllerDeleteDirectorV1({
    id,
  }: {
    id: string;
  }): Promise<any> {
    return ApiService.delete(`directors/${id}`);
  }
}
