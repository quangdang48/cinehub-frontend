/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from './UserDto';
export type ReviewDto = {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
    /**
     * Soft deletion timestamp
     */
    deletedAt?: Record<string, any>;
    /**
     * Nội dung bình luận
     */
    content: string;
    /**
     * Đánh giá phim (1-10)
     */
    rating: number;
    /**
     * Tổng số lượt thích
     */
    totalLikes: number;
    /**
     * Tổng số lượt không thích
     */
    totalDislikes: number;
    /**
     * Đánh giá có bình luận hay không
     */
    totalComments: number;
    /**
     * Thông tin tác giả đánh giá
     */
    author: UserDto;
    /**
     * ID phim được đánh giá
     */
    filmId: string;
};

