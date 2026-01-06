/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PosterDto = {
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
  url: string;
  type: "default" | "thumbnail" | "backdrop";
};
