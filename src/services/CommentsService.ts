import type { PaginatedCommentApiResponseDto } from "@/types/PaginatedCommentApiResponseDto";
import ApiService from "./ApiService";
import type { CommentApiResponseDto } from "@/types/CommentApiResponseDto";
import type { CreateCommentDto } from "@/types/CreateCommentDto";
import type { UpdateCommentDto } from "@/types/UpdateCommentDto";

export class CommentsService {
    /**
     * Lấy danh sách bình luận
     * @returns PaginatedCommentApiResponseDto Lấy danh sách bình luận
     * @throws ApiError
     */
    public static commentControllerGetAllV1({
        filmId,
        episode,
        season,
        reviewId,
        parentId,
        page = 1,
        limit = 10,
    }: {
        /**
         * ID phim
         */
        filmId: string,
        /**
         * tập phim
         */
        episode?: number,
        /**
         * mùa phim
         */
        season?: number,
        /**
         * ID đánh giá
         */
        reviewId?: string,
        /**
         * ID bình luận cha
         */
        parentId?: string,
        /**
         * Số trang
         */
        page?: number,
        /**
         * Số lượng bản ghi trên mỗi trang
         */
        limit?: number,
    }): Promise<PaginatedCommentApiResponseDto> {
        return ApiService.get('comments', {
            params: {
                filmId,
                episode,
                season,
                reviewId,
                parentId,
                page,
                limit,
            }
        });
    }
    /**
     * Tạo bình luận mới
     * @returns CommentApiResponseDto Tạo bình luận mới
     * @throws ApiError
     */
    public static commentControllerCreateV1({
        requestBody,
    }: {
        requestBody: CreateCommentDto,
    }): Promise<CommentApiResponseDto> {
        return ApiService.post('comments', requestBody)
    }
    /**
     * Cập nhật thông tin bình luận
     * @returns CommentApiResponseDto Cập nhật thông tin bình luận
     * @throws ApiError
     */
    public static commentControllerUpdateV1({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateCommentDto,
    }): Promise<CommentApiResponseDto> {
        return ApiService.put(`comments/${id}`, requestBody)
    }
    /**
     * Xóa bình luận
     * @returns any Xóa bình luận
     * @throws ApiError
     */
    public static commentControllerDeleteV1({
        id,
    }: {
        id: string,
    }): Promise<any> {
        return ApiService.delete(`comments/${id}`)
    }
}
