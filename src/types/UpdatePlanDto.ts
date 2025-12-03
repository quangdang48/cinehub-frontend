/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdatePlanDto = {
    /**
     * Tên gói
     */
    name?: string;
    /**
     * Mô tả gói
     */
    description?: string;
    /**
     * Giá gói
     */
    price?: number;
    /**
     * Số ngày hiệu lực
     */
    durationDays?: number;
    /**
     * Stripe Product ID
     */
    stripeProductId?: string;
    /**
     * Stripe Price ID
     */
    stripePriceId?: string;
    /**
     * Chu kỳ thanh toán
     */
    billingCycle?: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
    /**
     * Loại gói
     */
    planType?: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    /**
     * Trạng thái hoạt động
     */
    isActive?: boolean;
};

