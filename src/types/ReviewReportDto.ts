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
 * DTO để tạo báo cáo review
 */
export type CreateReviewReportDto = {
    /**
     * Lý do báo cáo
     */
    reason: ReportReason;
    /**
     * Mô tả chi tiết (tùy chọn)
     */
    description?: string;
    /**
     * ID của review
     */
    reviewId: string;
};

/**
 * Response trả về sau khi báo cáo
 */
export type ReviewReportDto = {
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
     * ID của review bị báo cáo
     */
    reviewId: string;
    /**
     * Thời gian tạo
     */
    createdAt: string;
};

/**
 * API Response cho ReviewReportDto
 */
export type ReviewReportApiResponseDto = {
    data: ReviewReportDto;
    statusCode: number;
    message: string;
};
