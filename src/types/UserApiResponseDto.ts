/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from './UserDto';
export type UserApiResponseDto = {
    /**
     * Indicates if the request was successful
     */
    success: boolean;
    /**
     * Timestamp of the response
     */
    timestamp: string;
    /**
     * Path of the request
     */
    path: string;
    /**
     * Response data
     */
    data: UserDto;
};

