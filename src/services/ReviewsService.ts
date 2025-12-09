import type { PaginatedReviewApiResponseDto } from "@/types/PaginatedReviewApiResponseDto";
import ApiService from "./ApiService";
import type { CreateReviewDto } from "@/types/CreateReviewDto";
import type { ReviewApiResponseDto } from "@/types/ReviewApiResponseDto";
import type { UpdateReviewDto } from "@/types/UpdateReviewDto";

export class ReviewsService {
    /**
     * Lấy danh sách đánh giá
     * @returns PaginatedReviewApiResponseDto Lấy danh sách đánh giá
     * @throws ApiError
     */
    public static reviewControllerGetAllV1({
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
    }): Promise<PaginatedReviewApiResponseDto> {
        return ApiService.get('reviews', {
            params: {
                filmId,
                page,
                limit,
                sort,
                search
            }
        });
    }
    /**
     * Tạo bình đánh giá mới
     * @returns ReviewApiResponseDto Tạo bình đánh giá mới
     * @throws ApiError
     */
    public static reviewControllerCreateV1({
        requestBody,
    }: {
        requestBody: CreateReviewDto,
    }): Promise<ReviewApiResponseDto> {
        return ApiService.post('reviews', requestBody);
    }
    /**
     * Cập nhật thông tin đánh giá
     * @returns ReviewApiResponseDto Cập nhật thông tin đánh giá
     * @throws ApiError
     */
    public static reviewControllerUpdateV1({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateReviewDto,
    }): Promise<ReviewApiResponseDto> {
        return ApiService.put(`reviews/${id}`, requestBody);
    }
    /**
     * Xóa đánh giá
     * @returns any Xóa đánh giá
     * @throws ApiError
     */
    public static reviewControllerDeleteV1({
        id,
    }: {
        id: string,
    }): Promise<any> {
        return ApiService.delete(`reviews/${id}`);
    }
}
