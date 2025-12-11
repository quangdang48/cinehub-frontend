/**
 * Lý do báo cáo
 */
export enum ReportReason {
    SPAM = 'spam',
    HARASSMENT = 'harassment',
    HATE_SPEECH = 'hate_speech',
    MISINFORMATION = 'misinformation',
    INAPPROPRIATE = 'inappropriate',
    OTHER = 'other',
}

/**
 * DTO để tạo báo cáo comment
 */
export type CreateCommentReportDto = {
    /**
     * Lý do báo cáo
     */
    reason: ReportReason;
    /**
     * Mô tả chi tiết (tùy chọn)
     */
    description?: string;
    /**
     * ID của comment
     */
    commentId: string;
};

/**
 * Response trả về sau khi báo cáo
 */
export type CommentReportDto = {
    /**
     * ID của báo cáo
     */
    id: string;
    /**
     * Lý do báo cáo
     */
    reason: ReportReason;
    /**
     * Mô tả chi tiết
     */
    description?: string;
    /**
     * ID của user báo cáo
     */
    userId: string;
    /**
     * ID của comment bị báo cáo
     */
    commentId: string;
    /**
     * Thời gian tạo
     */
    createdAt: string;
};

/**
 * API Response cho CommentReportDto
 */
export type CommentReportApiResponseDto = {
    data: CommentReportDto;
    statusCode: number;
    message: string;
};
