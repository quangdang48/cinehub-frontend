import type { PaginatedGenreApiResponseDto } from "@/types/PaginatedGenreApiResponseDto";
import ApiService from "./ApiService";

export class GenresService {
    /**
     * Lấy danh sách thể loại
     * @returns PaginatedGenreApiResponseDto Lấy danh sách thể loại
     * @throws ApiError
     */
    public static genreControllerGetAllV1({
        page = 1,
        limit = 1000,
        sort='{"name":"ASC"}',
        search,
    }: {
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
    }): Promise<PaginatedGenreApiResponseDto> {
        return ApiService.get("genres", {
            params: {
                page,
                limit,
                sort,
                search,
            },
        });
    }
    
}
