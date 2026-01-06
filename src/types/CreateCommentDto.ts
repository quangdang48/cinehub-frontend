/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCommentDto = {
  /**
   * Nội dung bình luận
   */
  content: string;
  /**
   * Mùa (nếu bình luận về một tập phim)
   */
  season?: number;
  /**
   * Tập (nếu bình luận về một tập phim)
   */
  episode?: number;
  /**
   * ID bình luận cha (nếu là phản hồi)
   */
  parentId?: string;
  /**
   * ID phim được bình luận
   */
  filmId: string;
  /**
   * ID đánh giá được bình luận
   */
  reviewId?: string;
};
