import type {
  PlanDto,
  SubscriptionDto,
  CheckoutResponse,
} from '@/types/SubscriptionPlanDto';
import ApiService from './ApiService';
import type { ApiResponse } from '@/types/ApiResponse';

export class SubscriptionService {
  /**
   * Lấy danh sách các gói subscription đang active
   */
  public static getActivePlans(): Promise<ApiResponse<PlanDto[]>> {
    return ApiService.get('plans/active');
  }

  /**
   * Lấy danh sách tất cả gói subscription
   */
  public static getAllPlans(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PlanDto[]>> {
    return ApiService.get(`plans?page=${page}&limit=${limit}`);
  }

  /**
   * Lấy thông tin subscription hiện tại của user
   */
  public static getCurrentSubscription(): Promise<
    ApiResponse<SubscriptionDto>
  > {
    return ApiService.get('subscriptions/me');
  }

  /**
   * Tạo checkout session để thanh toán
   */
  public static createCheckout(
    planId: string
  ): Promise<ApiResponse<CheckoutResponse>> {
    return ApiService.post('payment/checkout', { planId });
  }

  /**
   * Hủy subscription
   */
  public static cancelSubscription(): Promise<ApiResponse<null>> {
    return ApiService.post('subscriptions/cancel', {});
  }

  /**
   * Nâng cấp subscription lên gói cao hơn
   */
  public static upgradeSubscription(
    planId: string
  ): Promise<ApiResponse<CheckoutResponse>> {
    return ApiService.post(`subscriptions/upgrade/${planId}`, {});
  }

  /**
   * Hạ cấp subscription xuống gói thấp hơn
   */
  public static downgradeSubscription(
    planId: string
  ): Promise<ApiResponse<SubscriptionDto>> {
    return ApiService.post(`subscriptions/downgrade/${planId}`, {});
  }

  /**
   * Hủy lịch downgrade đã đặt
   */
  public static cancelScheduledDowngrade(): Promise<
    ApiResponse<SubscriptionDto>
  > {
    return ApiService.post('subscriptions/cancel-downgrade', {});
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
