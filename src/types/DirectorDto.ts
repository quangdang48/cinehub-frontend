/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DirectorDto = {
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
   * Tên đạo diễn
   */
  name: string;
  /**
   * Giới tính của đạo diễn
   */
  gender?: "male" | "female" | null;
  /**
   * Tiểu sử của đạo diễn
   */
  bio?: string | null;
  /**
   * Ngày sinh của đạo diễn
   */
  birthDate?: string | null;
  /**
   * Quốc tịch của đạo diễn
   */
  nationality?: string | null;
  /**
   * URL ảnh của đạo diễn
   */
  photoUrl?: string | null;
};
