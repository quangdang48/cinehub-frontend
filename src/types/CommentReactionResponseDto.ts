/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CommentReactionResponseDto = {
  /**
   * Tổng số lượt thích
   */
  totalLikes: number;
  /**
   * Tổng số lượt không thích
   */
  totalDislikes: number;
  /**
   * Reaction hiện tại của user (nếu có)
   */
  userReaction: "like" | "dislike" | null;
};
