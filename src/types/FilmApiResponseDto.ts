/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilmDto } from "./FilmDto";
export type FilmApiResponseDto = {
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
  data: FilmDto;
};
