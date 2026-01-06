/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReviewReportDto = {
  /**
   * Lý do báo cáo
   */
  reason:
    | "spam"
    | "harassment"
    | "hate_speech"
    | "misinformation"
    | "inappropriate"
    | "other";
  /**
   * Mô tả chi tiết (tùy chọn)
   */
  description?: string;
  /**
   * ID của review
   */
  reviewId: string;
};
