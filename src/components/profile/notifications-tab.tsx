import { useNotificationSocket } from '@/hooks';
import type { NotificationData } from '@/hooks/useNotificationSocket';
import { toast } from 'sonner';
import { RefreshCw, Trash2 } from 'lucide-react';

export default function NotificationsTab() {
  const {
    isConnected,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refreshNotifications,
  } = useNotificationSocket({
    autoConnect: true,
    autoFetchHistory: true,
    onNotification: (notification) => {
      // Show toast for new notifications
      const toastOptions = {
        description: notification.content,
        duration: 5000,
      };

      switch (notification.type) {
        case 'success':
        case 'SUCCESS':
          toast.success(notification.title || 'Thông báo', toastOptions);
          break;
        case 'warning':
        case 'WARNING':
          toast.warning(notification.title || 'Cảnh báo', toastOptions);
          break;
        case 'error':
        case 'ERROR':
          toast.error(notification.title || 'Lỗi', toastOptions);
          break;
        default:
          toast.info(notification.title || 'Thông báo', toastOptions);
      }
    },
  });

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleMarkRead = (id: string) => {
    markAsRead(id);
  };

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả thông báo?')) {
      await clearNotifications();
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">Thông báo</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-yellow-600 text-white rounded-full">
                {unreadCount} chưa đọc
              </span>
            )}
            <span 
              className={`px-2 py-0.5 text-xs rounded-full border ${
                isConnected 
                  ? 'bg-green-900/30 text-green-400 border-green-800' 
                  : 'bg-red-900/30 text-red-400 border-red-800'
              }`}
            >
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Các thông báo mới nhất từ hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshNotifications}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white transition disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {notifications.length > 0 && (
            <>
              <button 
                onClick={markAllAsRead}
                className="text-yellow-600 hover:text-yellow-500 text-sm font-semibold"
              >
                Đánh dấu đã đọc
              </button>
              <button 
                onClick={handleClearAll}
                className="p-2 text-red-400 hover:text-red-300 transition"
                title="Xóa tất cả"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            Đang tải thông báo...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Chưa có thông báo nào
          </div>
        ) : (
          notifications.map((notification: NotificationData) => (
            <div
              key={notification.id}
              onClick={() => handleMarkRead(notification.id)}
              className={`p-4 rounded-lg border transition cursor-pointer ${
                notification.read
                  ? "bg-gray-800/50 border-gray-800"
                  : "bg-yellow-900/10 border-yellow-800/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-2 h-2 rounded-full mt-2 ${
                    notification.read ? "bg-gray-600" : "bg-yellow-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {notification.content}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
