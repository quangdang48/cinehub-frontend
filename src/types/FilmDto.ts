/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CastDto } from './CastDto';
import type { DirectorDto } from './DirectorDto';
import type { GenreDto } from './GenreDto';
import type { PosterDto } from './PosterDto';
import type { SeasonDto } from './SeasonDto';
export type FilmDto = {
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
     * Tiêu đề phim
     */
    title: string;
    /**
     * Tiêu đề gốc
     */
    originalTitle: string;
    /**
     * Tiêu đề tiếng Anh
     */
    englishTitle: string;
    /**
     * Mô tả phim
     */
    description?: string | null;
    /**
     * Số lượt xem
     */
    views: number;
    /**
     * Đánh giá của người dùng
     */
    userRating: number;
    /**
     * Giới hạn độ tuổi
     */
    ageLimit: 'ALL' | 'P' | 'K' | 'T13' | 'T16' | 'T18';
    /**
     * Quốc gia sản xuất
     */
    country: string;
    /**
     * Đánh giá trên IMDb
     */
    imdbRating: number;
    /**
     * Ngày phát hành
     */
    releaseDate: string;
    /**
     * Trạng thái phim
     */
    status: 'UPCOMING' | 'RELEASING' | 'ENDED';
    /**
     * Loại phim
     */
    type: 'MOVIE' | 'SERIES';
    /**
     * Thể loại phim
     */
    genres: Array<GenreDto>;
    /**
     * Đạo diễn
     */
    directors: Array<DirectorDto>;
    /**
     * Diễn viên
     */
    casts: Array<CastDto>;
    /**
     * Áp phích phim
     */
    posters: Array<PosterDto>;
    /**
     * Mùa phim
     */
    seasons: Array<SeasonDto>;
};

