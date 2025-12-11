import type { PaginatedEpisodeApiResponseDto } from "@/types/PaginatedEpisodeApiResponseDto";
import ApiService from "./ApiService";
import type { CreateEpisodeDto } from "@/types/CreateEpisodeDto";
import type { EpisodeApiResponseDto } from "@/types/EpisodeApiResponseDto";
import type { UpdateEpisodeDto } from "@/types/UpdateEpisodeDto";

export class EpisodesService {
    /**
     * Lấy danh sách tập phim
     * @returns PaginatedEpisodeApiResponseDto Lấy danh sách tập phim
     * @throws ApiError
     */
    public static episodeControllerGetAllV1({
        filmId,
        season,
        page = 1,
        limit = 10,
        sort,
        search,
    }: {
        filmId: string,
        season: number,
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
    }): Promise<PaginatedEpisodeApiResponseDto> {
        return ApiService.get(`films/${filmId}/seasons/${season}/episodes`, {
            params: {
                page,
                limit,
                sort,
                search
            }
        });
    }
    /**
     * @returns EpisodeApiResponseDto Tạo tập phim mới
     * @throws ApiError
     */
    public static episodeControllerCreateEpisodeV1({
        filmId,
        season,
        requestBody,
    }: {
        filmId: string,
        season: number,
        requestBody: CreateEpisodeDto,
    }): Promise<EpisodeApiResponseDto> {
        return ApiService.post(`films/${filmId}/seasons/${season}/episodes`, requestBody);
    }
    /**
     * Lấy thông tin tập phim theo số tập
     * @returns EpisodeApiResponseDto Lấy thông tin tập phim theo số tập
     * @throws ApiError
     */
    public static episodeControllerGetEpisodeByIdV1({
        number,
        filmId,
        season,
    }: {
        /**
         * Episode number
         */
        number: number,
        filmId: string,
        season: number,
    }): Promise<EpisodeApiResponseDto> {
        return ApiService.get(`films/${filmId}/seasons/${season}/episodes/${number}`);
    }
    /**
     * Cập nhật thông tin tập phim
     * @returns EpisodeApiResponseDto Cập nhật thông tin tập phim
     * @throws ApiError
     */
    public static episodeControllerUpdateEpisodeV1({
        filmId,
        season,
        number,
        requestBody,
    }: {
        filmId: string,
        season: number,
        number: number,
        requestBody: UpdateEpisodeDto,
    }): Promise<EpisodeApiResponseDto> {
        return ApiService.put(`films/${filmId}/seasons/${season}/episodes/${number}`, requestBody);
    }
    /**
     * Xóa tập phim
     * @returns any Xóa tập phim
     * @throws ApiError
     */
    public static episodeControllerDeleteEpisodeV1({
        filmId,
        season,
        number,
    }: {
        filmId: string,
        season: number,
        number: number,
    }): Promise<any> {
        return ApiService.delete(`films/${filmId}/seasons/${season}/episodes/${number}`);
    }
}
