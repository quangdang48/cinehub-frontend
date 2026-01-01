import type { FilmApiResponseDto } from "@/types/FilmApiResponseDto";
import type { CreateFilmDto } from "@/types/CreateFilmDto";
import ApiService from "./ApiService";
import type { UpdateFilmDto } from "@/types/UpdateFilmDto";
import type { PaginatedFilmApiResponseDto } from "@/types/PaginatedFilmApiResponseDto";

export class FilmService {
  /**
   * Tạo một film mới
   * @param requestBody
   * @returns FilmApiResponseDto Film được tạo thành công
   * @throws ApiError
   */
  public static filmControllerCreateV1(
    requestBody: CreateFilmDto,
  ): Promise<FilmApiResponseDto> {
    return ApiService.post("films", requestBody);
  }
  /**
   * Lấy danh sách film
   * @param page Current page
   * @param limit Items per page
   * @param sort Sort, e.g: {"createdAt":"DESC"}
   * @param search query string for search
   * @param country Country of the film
   * @param releaseYear Release year of the film
   * @param genreId Genre ID of the film
   * @param directorId Director ID of the film
   * @param actorId Actor ID of the film
   * @param status Status of the film
   * @param type Type of the film
   * @param ageLimit Age limit of the film
   * @returns PaginatedFilmApiResponseDto Danh sách film
   * @throws ApiError
   */
  public static filmControllerGetAll(
    page: number = 1,
    limit: number = 10,
    sort?: string,
    search?: string,
    country?: string,
    releaseYear?: number,
    genreId?: string,
    directorId?: string,
    actorId?: string,
    status?: "UPCOMING" | "RELEASING" | "ENDED",
    type?: "MOVIE" | "SERIES",
    ageLimit?: "ALL" | "P" | "K" | "T13" | "T16" | "T18",
  ): Promise<PaginatedFilmApiResponseDto> {
    return ApiService.get("films", {
      params: {
        page,
        limit,
        sort,
        search,
        country,
        releaseYear,
        genreId,
        directorId,
        actorId,
        status,
        type,
        ageLimit,
      },
    });
  }
  public static filmControllerGetAllUpcoming(
    page: number = 1,
    limit: number = 10,
    sort?: string,
  ): Promise<PaginatedFilmApiResponseDto> {
    return ApiService.get("films", {
      params: {
        page,
        limit,
        sort,
        status: "UPCOMING",
      },
    });
  }

  /**
   * Lấy chi tiết một film theo id
   * @param id
   * @returns FilmApiResponseDto Chi tiết film
   * @throws ApiError
   */
  public static filmControllerGetOneV1(
    id: string,
  ): Promise<FilmApiResponseDto> {
    return ApiService.get(`films/${id}`);
  }
  /**
   * Cập nhật thông tin film
   * @param id
   * @param requestBody
   * @returns FilmApiResponseDto Film đã được cập nhật
   * @throws ApiError
   */
  public static filmControllerUpdateV1(
    id: string,
    requestBody: UpdateFilmDto,
  ): Promise<FilmApiResponseDto> {
    return ApiService.put(`films/${id}`, requestBody);
  }
  /**
   * Xoá một film theo id
   * @param id
   * @returns any Xoá thành công
   * @throws ApiError
   */
  public static filmControllerRemoveV1(id: string): Promise<any> {
    return ApiService.delete(`films/${id}`);
  }
  /**
   * Upload video cho film
   * @param id
   * @param formData
   * @returns any Video được upload thành công
   * @throws ApiError
   */
  public static filmControllerUploadVideoV1(
    id: string,
    formData: {
      file: Blob;
    },
    season?: number,
    episode?: number,
  ): Promise<any> {
    return ApiService.post(`films/${id}/video`, formData, {
      params: {
        season,
        episode,
      },
    });
  }
  /**
   * Xoá video của film
   * @param id
   * @returns any Video được xoá thành công
   * @throws ApiError
   */
  public static filmControllerDeleteVideoV1(
    id: string,
    season?: number,
    episode?: number,
  ): Promise<any> {
    return ApiService.delete(`films/${id}/video`, {
      params: {
        season,
        episode,
      },
    });
  }
}
