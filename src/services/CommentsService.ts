import type { PaginatedCommentApiResponseDto } from "@/types/PaginatedCommentApiResponseDto";
import ApiService from "./ApiService";
import type { CommentApiResponseDto } from "@/types/CommentApiResponseDto";
import type { CreateCommentDto } from "@/types/CreateCommentDto";
import type { UpdateCommentDto } from "@/types/UpdateCommentDto";
import type {
  CreateCommentReactionDto,
  CommentReactionApiResponseDto,
} from "@/types/CommentReactionDto";
import type { CreateCommentReportDto } from "@/types/CreateCommentReportDto";
import type { CommentReportApiResponseDto } from "@/types/CommentReportApiResponseDto";

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
    filmId: string;
    /**
     * tập phim
     */
    episode?: number;
    /**
     * mùa phim
     */
    season?: number;
    /**
     * ID đánh giá
     */
    reviewId?: string;
    /**
     * ID bình luận cha
     */
    parentId?: string;
    /**
     * Số trang
     */
    page?: number;
    /**
     * Số lượng bản ghi trên mỗi trang
     */
    limit?: number;
  }): Promise<PaginatedCommentApiResponseDto> {
    return ApiService.get(`comments/${filmId}`, {
      params: {
        episode,
        season,
        reviewId,
        parentId,
        page,
        limit,
      },
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
    requestBody: CreateCommentDto;
  }): Promise<CommentApiResponseDto> {
    return ApiService.post("comments", requestBody);
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
    id: string;
    requestBody: UpdateCommentDto;
  }): Promise<CommentApiResponseDto> {
    return ApiService.put(`comments/${id}`, requestBody);
  }
  /**
   * Xóa bình luận
   * @returns any Xóa bình luận
   * @throws ApiError
   */
  public static commentControllerDeleteV1({
    id,
  }: {
    id: string;
  }): Promise<any> {
    return ApiService.delete(`comments/${id}`);
  }

  /**
   * Like hoặc Dislike một bình luận
   * @returns CommentReactionApiResponseDto Trả về trạng thái reaction sau khi thao tác
   * @throws ApiError
   */
  public static commentReactionV1({
    requestBody,
  }: {
    requestBody: CreateCommentReactionDto;
  }): Promise<CommentReactionApiResponseDto> {
    return ApiService.post("comments/reaction", requestBody);
  }

  /**
   * Báo cáo một bình luận vi phạm
   * @returns CommentReportApiResponseDto Báo cáo bình luận thành công
   * @throws ApiError
   */
  public static reportCommentV1({
    requestBody,
  }: {
    requestBody: CreateCommentReportDto;
  }): Promise<CommentReportApiResponseDto> {
    return ApiService.post("comments/report", requestBody);
  }
}
