/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from './UserDto';
export type CommentDto = {
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
     * Tổng số lượt thích
     */
    totalLikes: number;
    /**
     * Tổng số lượt không thích
     */
    totalDislikes: number;
    /**
     * Tổng số phản hồi
     */
    totalReplies: number;
    /**
     * Mùa (nếu bình luận về một tập phim)
     */
    season?: number;
    /**
     * Tập (nếu bình luận về một tập phim)
     */
    episode?: number;
    /**
     * ID bình luận cha (nếu là phản hồi)
     */
    parentId?: string;
    /**
     * Thông tin tác giả bình luận
     */
    author: UserDto;
};

