/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlanDto } from './PlanDto';
import type { UserDto } from './UserDto';
export type SubscriptionDto = {
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
     * User ID
     */
    userId: string;
    /**
     * Plan ID
     */
    planId: string;
    /**
     * Ngày bắt đầu
     */
    startDate: string;
    /**
     * Ngày kết thúc
     */
    endDate: string;
    /**
     * Trạng thái subscription
     */
    status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
    /**
     * Stripe Subscription ID
     */
    stripeSubscriptionId?: string;
    /**
     * Stripe Customer ID
     */
    stripeCustomerId?: string;
    /**
     * Tự động gia hạn
     */
    autoRenew: boolean;
    /**
     * Ngày hủy
     */
    cancelledAt?: string;
    /**
     * Thông tin user
     */
    user?: UserDto;
    /**
     * Thông tin gói
     */
    plan?: PlanDto;
};

