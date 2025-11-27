import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { SubscriptionPlanDto, SubscriptionResponseDto } from '@/types/SubscriptionPlanDto';
// import { SubscriptionService } from '@/services/SubscriptionService';
import { Button } from '@/components/common';
import Spinner from '@/components/common/Spinner';

// Mock data for testing UI
const MOCK_PLANS: SubscriptionPlanDto[] = [
  {
    id: 'free',
    name: 'Miễn phí',
    price: 0,
    currency: 'VND',
    billingPeriod: 'monthly',
    description: 'Truy cập nội dung cơ bản với quảng cáo',
    features: [
      'Xem phim có quảng cáo',
      'Chất lượng HD',
      '1 thiết bị cùng lúc',
      'Không xem offline',
      'Hỗ trợ cơ bản',
    ],
    isPopular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 79000,
    currency: 'VND',
    billingPeriod: 'monthly',
    description: 'Truy cập không giới hạn không có quảng cáo',
    features: [
      'Không quảng cáo',
      'Chất lượng Full HD',
      '2 thiết bị cùng lúc',
      'Tải xuống để xem offline',
      'Hỗ trợ 24/7',
      'Phụ đề nhiều ngôn ngữ',
    ],
    isPopular: true,
    badge: 'Phổ biến',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 129000,
    currency: 'VND',
    billingPeriod: 'monthly',
    description: 'Truy cập toàn bộ nội dung với chất lượng 4K',
    features: [
      'Không quảng cáo',
      'Chất lượng 4K Ultra HD',
      '4 thiết bị cùng lúc',
      'Tải xuống để xem offline',
      'Hỗ trợ 24/7 VIP',
      'Phụ đề nhiều ngôn ngữ',
      'Nội dung độc quyền',
      'Xem sớm phim mới',
    ],
    isPopular: false,
  },
];

const MOCK_CURRENT_SUBSCRIPTION: SubscriptionResponseDto = {
  id: 'sub_123',
  userId: 'user_123',
  planId: 'standard',
  plan: MOCK_PLANS[1],
  status: 'active',
  startDate: '2025-10-25T00:00:00Z',
  endDate: '2025-12-25T00:00:00Z',
  autoRenew: true,
  createdAt: '2025-10-25T10:30:00Z',
  updatedAt: '2025-10-25T10:30:00Z',
};

export default function BillingPage() {
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock: Giả lập delay fetch
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use mock data instead of API
        setPlans(MOCK_PLANS);
        setCurrentSubscription(MOCK_CURRENT_SUBSCRIPTION);

        // ===== ORIGINAL API CALLS (commented) =====
        // const plansResponse = await SubscriptionService.getPlans();
        // if (plansResponse.data) {
        //   setPlans(plansResponse.data);
        // }

        // try {
        //   const subscriptionResponse = await SubscriptionService.getCurrentSubscription();
        //   if (subscriptionResponse.data) {
        //     setCurrentSubscription(subscriptionResponse.data);
        //   }
        // } catch (err) {
        //   console.log('No active subscription');
        // }
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

      // Mock: Giả lập delay upgrade
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock upgrade - just update the subscription
      const upgradedPlan = plans.find((p) => p.id === planId);
      if (upgradedPlan) {
        const newSubscription: SubscriptionResponseDto = {
          id: 'sub_' + Math.random().toString(36).substr(2, 9),
          userId: 'user_123',
          planId,
          plan: upgradedPlan,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCurrentSubscription(newSubscription);
        alert(`Nâng cấp lên ${upgradedPlan.name} thành công!`);
      }

      // ===== ORIGINAL API CALL (commented) =====
      // const response = await SubscriptionService.upgradeSubscription({
      //   planId,
      // });

      // if (response.data) {
      //   setCurrentSubscription(response.data);
      //   alert('Nâng cấp thành công!');
      // }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || 'Nâng cấp thất bại. Vui lòng thử lại.';
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

      // Mock: Giả lập delay cancel
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentSubscription(null);
      alert('Hủy subscription thành công!');

      // ===== ORIGINAL API CALL (commented) =====
      // await SubscriptionService.cancelSubscription();
      // setCurrentSubscription(null);
      // alert('Hủy subscription thành công!');
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
        {currentSubscription && (
          <div className="mb-12 p-6 bg-green-900/20 border border-green-500 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">
              Gói hiện tại: {currentSubscription.plan.name}
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 mb-6">
              <div>
                <p className="text-sm text-gray-400">Giá</p>
                <p className="text-xl font-semibold">
                  {currentSubscription.plan.price.toLocaleString()} {currentSubscription.plan.currency}/
                  {currentSubscription.plan.billingPeriod === 'monthly' ? 'tháng' : 'năm'}
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
                  {currentSubscription.status === 'active' ? 'Hoạt động' : currentSubscription.status}
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
            const isCurrentPlan = currentSubscription?.plan.id === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden transition transform hover:scale-105 ${
                  plan.isPopular
                    ? 'border-2 border-red-500 bg-gray-900 ring-2 ring-red-500/20 ring-offset-2 ring-offset-black'
                    : 'border border-gray-700 bg-gray-900/50'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    PHỔ BIẾN
                  </div>
                )}

                {/* Plan Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 ml-2">
                      {plan.currency}/
                      {plan.billingPeriod === 'monthly' ? 'tháng' : 'năm'}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    fullWidth
                    variant={plan.isPopular ? 'primary' : 'secondary'}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || upgrading === plan.id}
                    isLoading={upgrading === plan.id}
                    className={isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isCurrentPlan ? 'Gói Hiện Tại' : 'Nâng Cấp'}
                  </Button>

                  {/* Divider */}
                  <div className="my-6 border-t border-gray-700"></div>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
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
