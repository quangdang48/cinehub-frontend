import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store';
import NotificationService from '@/services/NotificationService';
import { toast } from 'sonner';

const SOCKET_URL = 'http://localhost:8080';
const NOTIFICATION_NAMESPACE = '/notifications';

export interface NotificationData {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  read: boolean;
  metadata?: Record<string, unknown>;
}

const NOTIFICATION_EVENTS = {
  NOTIFICATION: 'notification',
  NOTIFICATION_BROADCAST: 'notification:broadcast',
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
  MARK_AS_READ: 'mark:read',
};

interface NotificationContextType {
  isConnected: boolean;
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  showToast?: boolean;
}

export function NotificationProvider({ children, showToast = true }: NotificationProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const userId = useAppSelector((state) => state.auth.user.id);
  const isAuthenticated = useAppSelector((state) => state.auth.session.signedIn);

  // Fetch notification history from API
  const refreshNotifications = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const [historyRes, countRes] = await Promise.all([
        NotificationService.getNotifications({ page: 1, limit: 50 }),
        NotificationService.getUnreadCount(),
      ]);

      if (historyRes.success && historyRes.data) {
        setNotifications(historyRes.data);
      }
      if (countRes.success && countRes.data) {
        setUnreadCount(countRes.data.count);
      }
    } catch (error) {
      console.error('[Notification] Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Show toast notification
  const showToastNotification = useCallback((notification: NotificationData) => {
    if (!showToast) return;

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
  }, [showToast]);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Call API
    try {
      await NotificationService.markAsRead([id]);
    } catch (error) {
      console.error('[Notification] Failed to mark as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const currentUnreadCount = notifications.filter((n) => !n.read).length;

    // Optimistic update
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);

    // Call API
    try {
      await NotificationService.markAllAsRead();
    } catch (error) {
      console.error('[Notification] Failed to mark all as read:', error);
      // Revert on error
      setUnreadCount(currentUnreadCount);
    }
  }, [notifications]);

  const clearNotifications = useCallback(async () => {
    const previousNotifications = notifications;
    setNotifications([]);
    setUnreadCount(0);

    try {
      await NotificationService.deleteAllNotifications();
    } catch (error) {
      console.error('[Notification] Failed to delete all:', error);
      // Revert on error
      setNotifications(previousNotifications);
    }
  }, [notifications]);

  // WebSocket connection management
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      // Disconnect if user is not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const socket = io(`${SOCKET_URL}${NOTIFICATION_NAMESPACE}`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected:', socket.id);
      setIsConnected(true);

      // Join user's personal room
      const userRoom = `user_${userId}`;
      socket.emit(NOTIFICATION_EVENTS.JOIN_ROOM, userRoom);
      console.log('[Socket.IO] Joined room:', userRoom);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
      setIsConnected(false);
    });

    // Listen for targeted notifications
    socket.on(NOTIFICATION_EVENTS.NOTIFICATION, (data: NotificationData) => {
      console.log('[Socket.IO] Received notification:', data);
      const notification: NotificationData = {
        ...data,
        id: data.id || `notif-${Date.now()}`,
        read: false,
        createdAt: data.createdAt || new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
      setUnreadCount((prev) => prev + 1);
      showToastNotification(notification);
    });

    // Listen for broadcast notifications
    socket.on(
      NOTIFICATION_EVENTS.NOTIFICATION_BROADCAST,
      (data: NotificationData) => {
        console.log('[Socket.IO] Received broadcast:', data);
        const notification: NotificationData = {
          ...data,
          id: data.id || `broadcast-${Date.now()}`,
          read: false,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setNotifications((prev) => [notification, ...prev].slice(0, 50));
        setUnreadCount((prev) => prev + 1);
        showToastNotification(notification);
      }
    );

    socket.on('connect_error', (error) => {
      console.error('[Socket.IO] Connection error:', error);
    });

    // Fetch initial notification history
    refreshNotifications();

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        const userRoom = `user_${userId}`;
        socket.emit(NOTIFICATION_EVENTS.LEAVE_ROOM, userRoom);
        socket.disconnect();
      }
    };
  }, [isAuthenticated, userId, refreshNotifications, showToastNotification]);

  const value: NotificationContextType = {
    isConnected,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
