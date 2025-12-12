import type { PaginatedSeasonApiResponseDto } from "@/types/PaginatedSeasonApiResponseDto";
import ApiService from "./ApiService";
import type { SeasonApiResponseDto } from "@/types/SeasonApiResponseDto";
import type { CreateSeasonDto } from "@/types/CreateSeasonDto";
import type { UpdateSeasonDto } from "@/types/UpdateSeasonDto";

export class SeasonsService {
    /**
     * Lấy danh sách mùa phim
     * @returns PaginatedSeasonApiResponseDto Lấy danh sách mùa phim
     * @throws ApiError
     */
    public static seasonControllerGetAllV1({
        filmId,
        page = 1,
        limit = 10,
        sort,
        search,
    }: {
        filmId: string,
        /**
         * Current page
         */
        page?: number,
        /**
         * Items per page
         */
        limit?: number,
        /**
         * Sort, e.g: {"createdAt":"DESC"}
         */
        sort?: string,
        /**
         * query string for search
         */
        search?: string,
    }): Promise<PaginatedSeasonApiResponseDto> {
        return ApiService.get('films/{filmId}/seasons', {
            params: {
                filmId,
                page,
                limit,
                sort,
                search,
            },
        });
    }

    /**
     * @returns SeasonApiResponseDto Tạo mùa phim mới
     * @throws ApiError
     */
    public static seasonControllerCreateSeasonV1({
        filmId,
        requestBody,
    }: {
        filmId: string,
        requestBody: CreateSeasonDto,
    }): Promise<SeasonApiResponseDto> {
        
        return ApiService.post(`films/${filmId}/seasons`, requestBody);
    }

    /**
     * Lấy thông tin mùa phim theo số mùa
     * @returns SeasonApiResponseDto Lấy thông tin mùa phim theo số mùa
     * @throws ApiError
     */
    public static seasonControllerGetSeasonByIdV1({
        season,
        filmId,
    }: {
        /**
         * Season number
         */
        season: number,
        filmId: string,
    }): Promise<SeasonApiResponseDto> {
        return ApiService.get(`films/${filmId}/seasons/${season}`);
    }

    /**
     * Cập nhật thông tin mùa phim
     * @returns SeasonApiResponseDto Cập nhật thông tin mùa phim
     * @throws ApiError
     */
    public static seasonControllerUpdateSeasonV1({
        filmId,
        season,
        requestBody,
    }: {
        filmId: string,
        season: number,
        requestBody: UpdateSeasonDto,
    }): Promise<SeasonApiResponseDto> {
        return ApiService.put(`films/${filmId}/seasons/${season}`, requestBody);
    }

    /**
     * Xóa mùa phim
     * @returns any Xóa mùa phim
     * @throws ApiError
     */
    public static seasonControllerDeleteSeasonV1({
        filmId,
        season,
    }: {
        filmId: string,
        season: number,
    }): Promise<any> {
        return ApiService.delete(`films/${filmId}/seasons/${season}`);
    }
}
