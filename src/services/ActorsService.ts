import type { PaginatedActorApiResponseDto } from "@/types/PaginatedActorApiResponseDto";
import ApiService from "./ApiService";
import type { CreateActorDto } from "@/types/CreateActorDto";
import type { ActorApiResponseDto } from "@/types/ActorApiResponseDto";
import type { UpdateActorDto } from "@/types/UpdateActorDto";

export class ActorsService {
  /**
   * Lấy danh sách diễn viên
   * @returns PaginatedActorApiResponseDto Lấy danh sách diễn viên
   * @throws ApiError
   */
  public static actorControllerGetAllV1({
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
  }): Promise<PaginatedActorApiResponseDto> {
    return ApiService.get("actors", {
      params: {
        page,
        limit,
        sort,
        search,
      },
    });
  }
  /**
   * @returns ActorApiResponseDto Tạo diễn viên mới
   * @throws ApiError
   */
  public static actorControllerCreateActorV1({
    requestBody,
  }: {
    requestBody: CreateActorDto;
  }): Promise<ActorApiResponseDto> {
    return ApiService.post("actors", requestBody);
  }
  /**
   * Lấy thông tin diễn viên theo ID
   * @returns ActorApiResponseDto Lấy thông tin diễn viên theo ID
   * @throws ApiError
   */
  public static actorControllerGetActorByIdV1({
    id,
  }: {
    /**
     * Actor ID
     */
    id: string;
  }): Promise<ActorApiResponseDto> {
    return ApiService.get(`actors/${id}`);
  }
  /**
   * Cập nhật thông tin diễn viên
   * @returns ActorApiResponseDto Cập nhật thông tin diễn viên
   * @throws ApiError
   */
  public static actorControllerUpdateActorV1({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: UpdateActorDto;
  }): Promise<ActorApiResponseDto> {
    return ApiService.put(`actors/${id}`, requestBody);
  }
  /**
   * Xóa diễn viên
   * @returns any Xóa diễn viên
   * @throws ApiError
   */
  public static actorControllerDeleteActorV1({
    id,
  }: {
    id: string;
  }): Promise<any> {
    return ApiService.delete(`actors/${id}`);
  }
}
