/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from "./UserDto";
export type PaginatedUserApiResponseDto = {
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
   * Response data list
   */
  data: Array<UserDto>;
  /**
   * Total number of items
   */
  totalItems: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Number of items per page
   */
  itemsPerPage: number;
  /**
   * Current page number
   */
  currentPage: number;
};
