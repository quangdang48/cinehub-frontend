import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store';
import NotificationService from '@/services/NotificationService';

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

interface UseNotificationSocketOptions {
  autoConnect?: boolean;
  autoFetchHistory?: boolean;
  onNotification?: (notification: NotificationData) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

interface UseNotificationSocketReturn {
  isConnected: boolean;
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  connect: () => void;
  disconnect: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  refreshNotifications: () => Promise<void>;
}

const NOTIFICATION_EVENTS = {
  NOTIFICATION: 'notification',
  NOTIFICATION_BROADCAST: 'notification:broadcast',
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
  MARK_AS_READ: 'mark:read',
};

export function useNotificationSocket(
  options: UseNotificationSocketOptions = {}
): UseNotificationSocketReturn {
  const {
    autoConnect = true,
    autoFetchHistory = true,
    onNotification,
    onConnect,
    onDisconnect,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const userId = useAppSelector((state) => state.auth.user.id);

  // Store callbacks in refs to avoid recreating socket on callback changes
  const onNotificationRef = useRef(onNotification);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onNotificationRef.current = onNotification;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onNotification, onConnect, onDisconnect]);

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

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
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
      onConnectRef.current?.();

      // Join user's personal room if logged in
      if (userId) {
        const userRoom = `user_${userId}`;
        socket.emit(NOTIFICATION_EVENTS.JOIN_ROOM, userRoom);
        console.log('[Socket.IO] Joined room:', userRoom);
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected');
      setIsConnected(false);
      onDisconnectRef.current?.();
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
      onNotificationRef.current?.(notification);
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
        onNotificationRef.current?.(notification);
      }
    );

    socket.on('connect_error', (error) => {
      console.error('[Socket.IO] Connection error:', error);
    });
  }, [userId]); // Only recreate when userId changes

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Leave user room before disconnecting
      if (userId) {
        socketRef.current.emit(
          NOTIFICATION_EVENTS.LEAVE_ROOM,
          `user_${userId}`
        );
      }
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, [userId]);

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
    const unreadCount = notifications.filter((n) => !n.read).length;

    // Optimistic update
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);

    // Call API
    try {
      await NotificationService.markAllAsRead();
    } catch (error) {
      console.error('[Notification] Failed to mark all as read:', error);
      // Revert on error
      setUnreadCount(unreadCount);
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

  // Auto connect on mount - only depends on autoConnect and userId
  useEffect(() => {
    if (autoConnect && userId) {
      connect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, userId]); // Intentionally exclude connect/disconnect to prevent loop

  // Fetch history when userId is available
  useEffect(() => {
    if (autoFetchHistory && userId) {
      refreshNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchHistory, userId]);

  // Rejoin room when userId changes
  useEffect(() => {
    if (socketRef.current?.connected && userId) {
      const userRoom = `user_${userId}`;
      socketRef.current.emit(NOTIFICATION_EVENTS.JOIN_ROOM, userRoom);
      console.log('[Socket.IO] Rejoined room:', userRoom);
    }
  }, [userId]);

  return {
    isConnected,
    notifications,
    unreadCount,
    isLoading,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refreshNotifications,
  };
}
