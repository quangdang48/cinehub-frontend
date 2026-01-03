/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GenreDto = {
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
     * The name of the genre
     */
    name: string;
    /**
     * The slug of the genre
     */
    slug: string;
};