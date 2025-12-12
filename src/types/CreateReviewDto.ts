/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReviewDto = {
  /**
   * Nội dung bình luận
   */
  content: string;
  /**
   * Đánh giá phim (1-10)
   */
  rating: number;
  /**
   * ID phim được đánh giá
   */
  filmId: string;
};
