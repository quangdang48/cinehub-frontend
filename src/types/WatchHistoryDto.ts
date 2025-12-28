/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilmDto } from './FilmDto';

export type WatchHistoryDto = {
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
     * ID của phim
     */
    filmId: string;
    /**
     * Thông tin phim
     */
    film: FilmDto;
    /**
     * Thời lượng đã xem (tính bằng giây)
     */
    watchedDuration: number;
};

