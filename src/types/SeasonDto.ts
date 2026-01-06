/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EpisodeDto } from "./EpisodeDto";
export type SeasonDto = {
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
   * Mùa thứ
   */
  number: number;
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
  status: "UPCOMING" | "RELEASING" | "ENDED";
  /**
   * Tập phim
   */
  episodes: Array<EpisodeDto>;
};
