/**
 * Loại reaction
 */
export enum ReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
}

/**
 * DTO để tạo reaction cho review
 */
export type CreateReviewReactionDto = {
    /**
     * Loại reaction (like/dislike)
     */
    type: ReactionType;
    /**
     * ID của review
     */
    reviewId: string;
};

/**
 * Response trả về sau khi reaction
 */
export type ReviewReactionResponseDto = {
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
 * API Response cho ReviewReactionResponseDto
 */
export type ReviewReactionApiResponseDto = {
    data: ReviewReactionResponseDto;
    statusCode: number;
    message: string;
};
