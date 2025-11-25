import type {
  SubscriptionPlanDto,
  SubscriptionResponseDto,
  UpgradeSubscriptionDto,
} from '@/types/SubscriptionPlanDto';
import ApiService from './ApiService';
import type { ApiResponse } from '@/types/ApiResponse';

export class SubscriptionService {
  /**
   * Lấy danh sách các gói subscription
   */
  public static getPlans(): Promise<ApiResponse<SubscriptionPlanDto[]>> {
    return ApiService.get('subscriptions/plans');
  }

  /**
   * Lấy thông tin subscription hiện tại của user
   */
  public static getCurrentSubscription(): Promise<
    ApiResponse<SubscriptionResponseDto>
  > {
    return ApiService.get('subscriptions/current');
  }

  /**
   * Nâng cấp subscription
   */
  public static upgradeSubscription(
    requestBody: UpgradeSubscriptionDto
  ): Promise<ApiResponse<SubscriptionResponseDto>> {
    return ApiService.post('subscriptions/upgrade', requestBody);
  }

  /**
   * Hủy subscription
   */
  public static cancelSubscription(): Promise<ApiResponse<null>> {
    return ApiService.post('subscriptions/cancel', {});
  }

  /**
   * Lấy lịch sử thanh toán
   */
  public static getBillingHistory(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> {
    return ApiService.get(
      `subscriptions/billing-history?page=${page}&pageSize=${pageSize}`
    );
  }
}
