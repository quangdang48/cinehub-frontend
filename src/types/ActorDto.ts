/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ActorDto = {
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
   * Tên diễn viên
   */
  name: string;
  /**
   * Giới tính của diễn viên
   */
  gender?: "male" | "female" | null;
  /**
   * Tiểu sử của diễn viên
   */
  bio?: string | null;
  /**
   * Ngày sinh của diễn viên
   */
  birthDate?: string | null;
  /**
   * Quốc tịch của diễn viên
   */
  nationality?: string | null;
  /**
   * URL ảnh của diễn viên
   */
  photoUrl?: string | null;
};
