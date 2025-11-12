export default function NotificationsTab() {
  const mockNotifications = [
    {
      id: 1,
      title: "Phim mới đã được thêm",
      message: "Bộ phim 'The Last of Us Season 2' vừa được cập nhật",
      time: "2 giờ trước",
      read: false,
    },
    {
      id: 2,
      title: "Cập nhật hệ thống",
      message: "Chúng tôi đã cải thiện trải nghiệm người dùng",
      time: "1 ngày trước",
      read: true,
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Thông báo</h2>
          <p className="text-gray-400 text-sm">Các thông báo mới nhất</p>
        </div>
        <button className="text-yellow-600 hover:text-yellow-500 text-sm font-semibold">
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
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
                <p className="text-gray-500 text-xs">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
