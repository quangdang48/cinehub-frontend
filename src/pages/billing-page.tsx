import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { PlanDto, SubscriptionDto, BillingCycle, PlanType, SubscriptionStatus } from '@/types/SubscriptionPlanDto';
import { SubscriptionService } from '@/services/SubscriptionService';
import { Button } from '@/components/common';
import Spinner from '@/components/common/Spinner';

// Helper function để hiển thị billing cycle
const getBillingCycleLabel = (cycle: BillingCycle): string => {
  switch (cycle) {
    case 'MONTHLY':
      return 'tháng';
    case 'YEARLY':
      return 'năm';
    case 'LIFETIME':
      return 'trọn đời';
    default:
      return 'tháng';
  }
};

// Helper function để hiển thị features dựa trên plan type
const getPlanFeatures = (planType: PlanType): string[] => {
  switch (planType) {
    case 'FREE':
      return [
        'Xem phim có quảng cáo',
        'Chất lượng HD',
        '1 thiết bị cùng lúc',
        'Không xem offline',
        'Hỗ trợ cơ bản',
      ];
    case 'BASIC':
      return [
        'Không quảng cáo',
        'Chất lượng Full HD',
        '2 thiết bị cùng lúc',
        'Tải xuống để xem offline',
        'Hỗ trợ 24/7',
        'Phụ đề nhiều ngôn ngữ',
      ];
    case 'PREMIUM':
      return [
        'Không quảng cáo',
        'Chất lượng 4K Ultra HD',
        '4 thiết bị cùng lúc',
        'Tải xuống để xem offline',
        'Hỗ trợ 24/7 VIP',
        'Phụ đề nhiều ngôn ngữ',
        'Nội dung độc quyền',
        'Xem sớm phim mới',
      ];
    case 'ENTERPRISE':
      return [
        'Tất cả tính năng Premium',
        'Không giới hạn thiết bị',
        'Quản lý tài khoản doanh nghiệp',
        'Hỗ trợ chuyên biệt',
        'API access',
        'Custom branding',
      ];
    default:
      return [];
  }
};

// Helper function để check plan phổ biến
const isPopularPlan = (planType: PlanType): boolean => {
  return planType === 'PREMIUM';
};

// Helper function để hiển thị trạng thái subscription
const getStatusLabel = (status: SubscriptionStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Hoạt động';
    case 'PENDING':
      return 'Đang chờ';
    case 'CANCELLED':
      return 'Đã hủy';
    case 'EXPIRED':
      return 'Hết hạn';
    default:
      return status;
  }
};

export default function BillingPage() {
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch plans từ API
        const plansResponse = await SubscriptionService.getActivePlans();
        if (plansResponse.data) {
          setPlans(plansResponse.data);
        }

        // Fetch current subscription
        try {
          const subscriptionResponse = await SubscriptionService.getCurrentSubscription();
          if (subscriptionResponse.data) {
            setCurrentSubscription(subscriptionResponse.data);
          }
        } catch (err) {
          console.log('No active subscription');
        }
      } catch (err: any) {
        console.error('Error fetching billing data:', err);
        setError('Không thể tải thông tin thanh toán. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      setUpgrading(planId);
      setError(null);

      // Tạo checkout session và redirect đến Stripe
      const response = await SubscriptionService.createCheckout(planId);

      if (response.data?.url) {
        // Redirect đến Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('Không thể tạo link thanh toán');
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Nâng cấp thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setUpgrading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc chắn muốn hủy subscription này?')) {
      return;
    }

    try {
      setError(null);

      await SubscriptionService.cancelSubscription();
      setCurrentSubscription(null);
      alert('Hủy subscription thành công!');
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || 'Hủy subscription thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nâng cấp thành viên Premium
          </h1>
          <p className="text-gray-400 text-lg">
            Truy cập không giới hạn toàn bộ nội dung với CineHub Premium
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Current Subscription */}
        {currentSubscription && currentSubscription.plan && (
          <div className="mb-12 p-6 bg-green-900/20 border border-green-500 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">
              Gói hiện tại: {currentSubscription.plan.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 mb-6">
              <div>
                <p className="text-sm text-gray-400">Giá</p>
                <p className="text-xl font-semibold">
                  {currentSubscription.plan.price.toLocaleString()} VND/
                  {getBillingCycleLabel(currentSubscription.plan.billingCycle)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Ngày hết hạn</p>
                <p className="text-xl font-semibold">
                  {new Date(currentSubscription.endDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Trạng thái</p>
                <p className="text-xl font-semibold capitalize text-green-400">
                  {getStatusLabel(currentSubscription.status)}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="text-red-400 hover:text-red-300 border-red-400"
            >
              Hủy Subscription
            </Button>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.planId === plan.id;
            const features = getPlanFeatures(plan.planType);
            const isPopular = isPopularPlan(plan.planType);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden transition transform hover:scale-105 ${
                  isPopular
                    ? 'border-2 border-red-500 bg-gray-900 ring-2 ring-red-500/20 ring-offset-2 ring-offset-black'
                    : 'border border-gray-700 bg-gray-900/50'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    PHỔ BIẾN
                  </div>
                )}

                {/* Plan Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {plan.description || `Gói ${plan.planType}`}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 ml-2">
                      VND/{getBillingCycleLabel(plan.billingCycle)}
                    </span>
                  </div>

                  {/* Duration */}
                  <p className="text-sm text-gray-500 mb-4">
                    Hiệu lực: {plan.durationDays} ngày
                  </p>

                  {/* CTA Button */}
                  <Button
                    fullWidth
                    variant={isPopular ? 'primary' : 'secondary'}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || upgrading === plan.id || !!currentSubscription}
                    isLoading={upgrading === plan.id}
                    className={isCurrentPlan || currentSubscription ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isCurrentPlan
                      ? 'Gói Hiện Tại'
                      : currentSubscription
                        ? 'Đã có gói'
                        : 'Đăng Ký'}
                  </Button>

                  {/* Divider */}
                  <div className="my-6 border-t border-gray-700"></div>

                  {/* Features */}
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Không có gói nào khả dụng.</p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-8">Câu hỏi thường gặp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Tôi có thể hủy bất cứ lúc nào?
              </h3>
              <p className="text-gray-400">
                Có, bạn có thể hủy subscription bất cứ lúc nào. Bạn sẽ vẫn có quyền truy cập cho đến hết kỳ thanh toán hiện tại.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Thanh toán được bảo mật?
              </h3>
              <p className="text-gray-400">
                Tất cả thanh toán được mã hóa và xử lý thông qua các nhà cung cấp thanh toán uy tín.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Có thể thay đổi gói?
              </h3>
              <p className="text-gray-400">
                Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Thay đổi sẽ có hiệu lực ngay lập tức.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Có thử miễn phí?
              </h3>
              <p className="text-gray-400">
                Liên hệ với chúng tôi để biết thêm về các chương trình dùng thử miễn phí hiện tại.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
