import type { PaginatedUserApiResponseDto } from "@/types/PaginatedUserApiResponseDto";
import ApiService from "./ApiService";
import type { UserApiResponseDto } from "@/types/UserApiResponseDto";
import type { ApiResponse } from "@/types/ApiResponse";
import type { UpdateUserDto } from "@/types/UpdateUserDto";

export class UserService {
    /**
     * Lấy danh sách người dùng với phân trang
     * @param page Current page
     * @param limit Items per page
     * @param sort Sort, e.g: {"createdAt":"DESC"}
     * @returns PaginatedUserApiResponseDto Lấy danh sách người dùng với phân trang
     */
    public static userControllerGetAllUsersV1(
        page: number = 1,
        limit: number = 10,
        sort?: string,
    ): Promise<PaginatedUserApiResponseDto> {
        return ApiService.get('users', {
            params: {
                page,
                limit,
                sort,
            },
        });
    }
    /**
     * Lấy thông tin người dùng theo ID
     * @param id User ID
     * @returns UserApiResponseDto Lấy thông tin người dùng theo ID
     */
    public static userControllerGetUserByIdV1(
        id: string,
    ): Promise<UserApiResponseDto> {
        return ApiService.get(`users/${id}`);
    }
    /**
     * Cập nhật thông tin người dùng
     * @param id
     * @param requestBody
     * @returns UserApiResponseDto Cập nhật thông tin người dùng
     */
    public static userControllerUpdateUserV1(
        id: string,
        requestBody: UpdateUserDto,
    ): Promise<UserApiResponseDto> {
        return ApiService.put(`users/${id}`, requestBody);
    }
    /**
     * Xóa người dùng
     * @param id
     * @returns any Xóa người dùng
     */
    public static userControllerDeleteUserV1(
        id: string,
    ): Promise<ApiResponse<null>> {
        return ApiService.delete(`users/${id}`);
    }
}
