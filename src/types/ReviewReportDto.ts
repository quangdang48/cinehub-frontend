/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewReportDto = {
    /**
     * ID của báo cáo
     */
    id: string;
    /**
     * Lý do báo cáo
     */
    reason: 'spam' | 'harassment' | 'hate_speech' | 'misinformation' | 'inappropriate' | 'other';
    /**
     * Mô tả chi tiết
     */
    description: string;
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

