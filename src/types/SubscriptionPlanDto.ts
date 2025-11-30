export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  LIFETIME = 'LIFETIME',
}

export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface PlanDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  stripeProductId: string;
  stripePriceId: string;
  billingCycle: BillingCycle;
  planType: PlanType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDto {
  id: string;
  userId: string;
  planId: string;
  plan?: PlanDto;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Legacy types for backward compatibility
export interface SubscriptionPlanDto {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  description: string;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface SubscriptionResponseDto {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlanDto;
  status: 'active' | 'inactive' | 'expired' | 'canceled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpgradeSubscriptionDto {
  planId: string;
  paymentMethodId?: string;
}

export interface CheckoutResponse {
  url: string;
  id: string;
}
