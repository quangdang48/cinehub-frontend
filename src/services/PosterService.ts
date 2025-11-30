import ApiService from "./ApiService";

export class PosterService {
    /**
     * Tạo poster cho phim
     * @param filmId
     * @param type
     * @param formData
     * @returns any Tạo poster thành công
     * @throws ApiError
     */
    public static posterControllerAddPosterV1(
        filmId: string,
        type: 'default' | 'thumbnail' | 'backdrop',
        formData: {
            file: Blob;
        },
    ): Promise<any> {
        return ApiService.post(`posters`, formData, {
            params: {
                filmId,
                type,
            },
        });
    }
    /**
     * Xóa poster
     * @param id
     * @returns any Xóa poster
     * @throws ApiError
     */
    public static posterControllerDeletePosterV1(
        id: string,
    ): Promise<any> {
        return ApiService.delete(`posters/${id}`);
    }
}
