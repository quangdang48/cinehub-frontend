/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCommentReactionDto = {
  /**
   * Loại reaction (like/dislike)
   */
  type: "like" | "dislike";
  /**
   * ID của comment
   */
  commentId: string;
};
