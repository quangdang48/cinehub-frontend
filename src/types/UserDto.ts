/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserDto = {
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
  name: string;
  email: string;
  gender: "male" | "female";
  avatarUrl?: string;
};
