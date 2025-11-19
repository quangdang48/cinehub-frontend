/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateFilmDto } from '@/types/CreateFilmDto';
import type { FilmResponseApiResponseDto } from '@/types/FilmResponseApiResponseDto';
import ApiService from './ApiService';
import type { PaginatedFilmResponseApiResponseDto } from '@/types/PaginatedFilmResponseApiResponseDto';
import type { UpdateFilmDto } from '@/types/UpdateFilmDto';

/* eslint-disable */
export class FilmService {
  /**
   * Tạo một film mới
   * @param requestBody
   * @returns FilmResponseApiResponseDto Film được tạo thành công
   */
  public static filmControllerCreateV1(
    requestBody: CreateFilmDto
  ): Promise<FilmResponseApiResponseDto> {
    return ApiService.post('films', requestBody);
  }

  /**
   * Lấy danh sách film xem nhiều nhất
   * @param page Current page
   * @param limit Items per page
   * @param sort Sort, e.g: {"createdAt":"DESC"}
   * @returns PaginatedFilmResponseApiResponseDto Danh sách film xem nhiều nhất
   */
  public static filmControllerGetMostViewedV1(
    page: number = 1,
    limit: number = 10,
    sort?: string
  ): Promise<PaginatedFilmResponseApiResponseDto> {
    return ApiService.get('films/most-viewed', {
      params: {
        page,
        limit,
        sort,
      },
    });
  }

  /**
   * Lấy danh sách film theo ngày phát hành (mới nhất / cũ nhất)
   * @param page Current page
   * @param limit Items per page
   * @param sort Sort, e.g: {"releaseDate":"DESC"} để sắp xếp từ mới nhất
   * @returns PaginatedFilmResponseApiResponseDto Danh sách film
   */
  public static filmControllerGetByReleaseV1(
    page: number = 1,
    limit: number = 10,
    sort?: string
  ): Promise<PaginatedFilmResponseApiResponseDto> {
    return ApiService.get('films/by-release', {
      params: {
        page,
        limit,
      },
    });
  }

  /**
   * Lấy chi tiết một film theo id
   * @param id ID film (UUID)
   * @returns FilmResponseApiResponseDto Chi tiết film
   */
  public static filmControllerGetOneV1(
    id: string
  ): Promise<FilmResponseApiResponseDto> {
    return ApiService.get(`films/${id}`);
  }

  /**
   * Cập nhật thông tin film
   * @param id ID film
   * @param requestBody
   * @returns FilmResponseApiResponseDto Film đã được cập nhật
   */
  public static filmControllerUpdateV1(
    id: string,
    requestBody: UpdateFilmDto
  ): Promise<FilmResponseApiResponseDto> {
    return ApiService.put(`films/${id}`, requestBody);
  }

  /**
   * Xoá một film theo id
   * @param id ID film
   * @returns any Xoá thành công
   */
  public static filmControllerRemoveV1(id: string): Promise<any> {
    return ApiService.delete(`films/${id}`);
  }
}
