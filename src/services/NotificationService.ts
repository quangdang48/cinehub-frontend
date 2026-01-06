import ApiService from './ApiService';

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  status: 'UNREAD' | 'READ';
  read: boolean; // computed from status
  createdAt: string;
  metadata?: Record<string, unknown>;
  isBroadcast?: boolean;
}

interface ApiNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
  metadata?: Record<string, unknown>;
  isBroadcast?: boolean;
}

// Backend response format from createPaginatedApiResponse
interface BackendPaginatedResponse {
  data: ApiNotification[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// Backend response format from createApiResponse
interface BackendApiResponse<T> {
  data: T;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
}

export interface PaginatedNotificationResponse {
  success: boolean;
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

// Helper to convert API notification to frontend format
const mapNotification = (notif: ApiNotification): Notification => ({
  ...notif,
  read: notif.status === 'READ',
});

const NotificationService = {
  /**
   * Get paginated list of notifications for current user
   */
  async getNotifications(
    params: NotificationQueryParams = {}
  ): Promise<PaginatedNotificationResponse> {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Backend returns: { data, totalItems, currentPage, totalPages, itemsPerPage }
    const response: BackendPaginatedResponse = await ApiService.get(
      `/notifications?${queryParams.toString()}`
    );

    // Transform to frontend format
    return {
      success: true,
      data: Array.isArray(response.data)
        ? response.data.map(mapNotification)
        : [],
      meta: {
        total: response.totalItems || 0,
        page: response.currentPage || page,
        limit: response.itemsPerPage || limit,
        totalPages: response.totalPages || 0,
      },
    };
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    // Backend returns: { data: { count } }
    const response: BackendApiResponse<{ count: number }> =
      await ApiService.get('/notifications/unread-count');
    return {
      success: true,
      data: response.data,
    };
  },

  /**
   * Get notification by ID
   */
  async getNotification(
    id: string
  ): Promise<{ success: boolean; data: Notification }> {
    const response: BackendApiResponse<ApiNotification> = await ApiService.get(
      `/notifications/${id}`
    );
    return {
      success: true,
      data: mapNotification(response.data),
    };
  },

  /**
   * Mark specific notifications as read
   */
  async markAsRead(notificationIds: string[]): Promise<{ success: boolean }> {
    const response: BackendApiResponse<{ success: boolean }> =
      await ApiService.put('/notifications/mark-read', { notificationIds });
    return {
      success: response.data?.success ?? true,
    };
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean }> {
    const response: BackendApiResponse<{ success: boolean }> =
      await ApiService.put('/notifications/mark-all-read');
    return {
      success: response.data?.success ?? true,
    };
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const response: BackendApiResponse<{ success: boolean }> =
      await ApiService.delete(`/notifications/${id}`);
    return {
      success: response.data?.success ?? true,
    };
  },

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<{ success: boolean }> {
    const response: BackendApiResponse<{ success: boolean }> =
      await ApiService.delete('/notifications');
    return {
      success: response.data?.success ?? true,
    };
  },
};

export default NotificationService;
