/**
 * Loại reaction
 */
export enum ReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
}

/**
 * DTO để tạo reaction cho comment
 */
export type CreateCommentReactionDto = {
    /**
     * Loại reaction (like/dislike)
     */
    type: ReactionType;
    /**
     * ID của comment
     */
    commentId: string;
};

/**
 * Response trả về sau khi reaction
 */
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
    userReaction: ReactionType | null;
};

/**
 * API Response cho CommentReactionResponseDto
 */
export type CommentReactionApiResponseDto = {
    data: CommentReactionResponseDto;
    statusCode: number;
    message: string;
};
