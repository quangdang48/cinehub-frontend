/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GenreDto } from './GenreDto';
import type { PosterDto } from './PosterDto';
export type FilmResponseDto = {
    /**
     * The unique identifier of the film
     */
    id: string;
    /**
     * The title of the film
     */
    title: string;
    /**
     * The description of the film
     */
    description: string;
    /**
     * The posters of the film
     */
    posters: Array<PosterDto>;
    /**
     * The genres of the film
     */
    genres: Array<GenreDto>;
    /**
     * The number of views of the film
     */
    views: number;
    /**
     * The rating of the film
     */
    rating: number;
    /**
     * The release date of the film
     */
    releaseDate: string;
};

