import type { LoginResponseApiResponseDto } from "@/types/LoginResponseApiResponseDto";
import ApiService from "./ApiService";
import type { ApiResponse } from "@/types/ApiResponse";
import type { RegisterDto } from "@/types/RegisterDto";
import type { ResetPasswordDto } from "@/types/ResetPasswordDto";
import type { UserApiResponseDto } from "@/types/UserApiResponseDto";
import type { LoginDto } from "@/types/LoginDto";
import type { GoogleLoginDto } from "@/types/GoogleLoginDto";
import type { RefreshDto } from "@/types/RefreshDto";
import type { ChangePassDto } from "@/types/ChangePassDto";

export class AuthService {
  /**
   * Đăng ký người dùng
   * @param requestBody Thông tin đăng ký
   * @returns UserApiResponseDto Thông tin người dùng vừa tạo
   */
  public static register(
    requestBody: RegisterDto,
  ): Promise<UserApiResponseDto> {
    return ApiService.post("auth/register", requestBody);
  }

  public static resendOtp(email: string): Promise<ApiResponse<null>> {
    return ApiService.post("auth/resend-otp", { email });
  }

  /**
   * Gửi yêu cầu quên mật khẩu
   * @param email Email người dùng
   * @returns ApiResponse<null> Kết quả gửi email / OTP
   */
  public static forgotPassword(email: string): Promise<ApiResponse<null>> {
    return ApiService.post("auth/forgot-password", { email });
  }

  /**
   * Xác thực OTP
   * @param requestBody Dữ liệu xác thực (ví dụ: email, code)
   * @returns ApiResponse<null> Kết quả xác thực OTP
   */
  public static verifyOtp(
    requestBody: { email: string; code: string },
  ): Promise<LoginResponseApiResponseDto> {
    return ApiService.post("auth/verify-otp", requestBody);
  }

  /**
   * Đặt lại mật khẩu
   * @param requestBody Dữ liệu đặt lại mật khẩu
   * @returns ApiResponse<null> Kết quả đặt lại mật khẩu
   */
  public static resetPassword(
    requestBody: ResetPasswordDto,
  ): Promise<ApiResponse<null>> {
    return ApiService.post("auth/reset-password", requestBody);
  }

  public static login(
    requestBody: LoginDto,
  ): Promise<LoginResponseApiResponseDto> {
    return ApiService.post("auth/login", requestBody);
  }

  /**
   * Google OAuth2 Callback
   * @returns LoginResponseApiResponseDto Login with Google successfully
   * @throws ApiError
   */
  public static authControllerGoogleCallbackV1(
    requestBody: GoogleLoginDto,
  ): Promise<LoginResponseApiResponseDto> {
    return ApiService.post("auth/google/callback", requestBody);
  }

  /**
   * Refresh access token using refresh token
   * @param requestBody Refresh token
   * @returns LoginResponseApiResponseDto New access token and refresh token
   */
  public static refreshToken(
    requestBody: RefreshDto,
  ): Promise<LoginResponseApiResponseDto> {
    return ApiService.post("auth/refresh-token", requestBody);
  }

  /**
   * Đổi mật khẩu
   * @param requestBody Dữ liệu đổi mật khẩu
   * @returns ApiResponse<null> Kết quả đổi mật khẩu
   */
  public static changePassword(
    requestBody: ChangePassDto,
  ): Promise<ApiResponse<null>> {
    return ApiService.post("auth/change-password", requestBody);
  }
}
