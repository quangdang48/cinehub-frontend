/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSeasonDto = {
    /**
     * Năm phát hành
     */
    releaseDate?: string | null;
    /**
     * Ngày kết thúc
     */
    endDate?: string | null;
    /**
     * Trạng thái mùa
     */
    status: 'UPCOMING' | 'RELEASING' | 'ENDED';
};

