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
