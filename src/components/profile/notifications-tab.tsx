import { useState, useEffect, useRef } from 'react';

interface NotificationData {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

// URL API Test - Bạn có thể thay đổi port này nếu backend chạy ở port khác
const API_URL = 'http://localhost:3322/api/v1/notifications';

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Kết nối đến endpoint SSE
    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const es = new EventSource(`${API_URL}/subscribe`);
      eventSourceRef.current = es;

      es.onopen = () => {
        setStatus('connected');
        console.log('SSE Connected');
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data);

          if (data.type !== 'connected') {
            // Thêm thông báo mới vào đầu danh sách
            setNotifications((prev) => [
              {
                id: Date.now(), // Generate temporary ID
                title: data.title || 'Thông báo mới',
                message: data.message || '',
                type: data.type || 'info',
                timestamp: data.timestamp || Date.now(),
                read: false,
              },
              ...prev,
            ]);
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      es.onerror = (error) => {
        console.error('SSE Error:', error);
        setStatus('disconnected');
        es.close();
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">Thông báo</h2>
            <span 
              className={`px-2 py-0.5 text-xs rounded-full border ${
                status === 'connected' 
                  ? 'bg-green-900/30 text-green-400 border-green-800' 
                  : 'bg-red-900/30 text-red-400 border-red-800'
              }`}
            >
              {status === 'connected' ? 'Live' : 'Offline'}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Các thông báo mới nhất từ hệ thống</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-yellow-600 hover:text-yellow-500 text-sm font-semibold"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Chưa có thông báo nào
          </div>
        ) : (
          notifications.map((notification) => (
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
                    {notification.message}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatTime(notification.timestamp)}
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
