/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateCastDto } from "./UpdateCastDto";
export type UpdateFilmDto = {
  /**
   * Tiêu đề phim
   */
  title: string;
  /**
   * Tiêu đề gốc
   */
  originalTitle: string;
  /**
   * Tiêu đề tiếng Anh
   */
  englishTitle: string;
  /**
   * Mô tả phim
   */
  description?: string | null;
  /**
   * Giới hạn độ tuổi
   */
  ageLimit: "ALL" | "P" | "K" | "T13" | "T16" | "T18";
  /**
   * Quốc gia sản xuất
   */
  country: string;
  /**
   * Ngày phát hành
   */
  releaseDate: string;
  /**
   * Trạng thái phim
   */
  status: "UPCOMING" | "RELEASING" | "ENDED";
  /**
   * Loại phim
   */
  type: "MOVIE" | "SERIES";
  /**
   * Đạo diễn
   */
  directors?: Array<string> | null;
  /**
   * Diễn viên
   */
  casts?: Array<UpdateCastDto> | null;
  /**
   * Thể loại
   */
  genres?: Array<string> | null;
};
