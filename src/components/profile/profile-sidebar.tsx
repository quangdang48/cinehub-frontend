import type { UserDto } from "@/types/UserDto";
import { SidebarItem, Avatar } from "../common";

interface ProfileSidebarProps {
  user: UserDto;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

export default function ProfileSidebar({
  user,
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Quản lý tài khoản</h2>

      <div className="space-y-2 mb-8">
        <SidebarItem
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
          label="Yêu thích"
          isActive={activeTab === "favorites"}
          onClick={() => onTabChange("favorites")}
        />

        <SidebarItem
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label="Xem tiếp"
          isActive={activeTab === "continue"}
          onClick={() => onTabChange("continue")}
        />

        <SidebarItem
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          }
          label="Thông báo"
          isActive={activeTab === "notifications"}
          onClick={() => onTabChange("notifications")}
        />

        <SidebarItem
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
          label="Tài khoản"
          isActive={activeTab === "account"}
          onClick={() => onTabChange("account")}
        />
      </div>

      {/* User Info */}
      <div className="pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Avatar src="" alt={user.name} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{user.name}</h3>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Thoát
        </button>
      </div>
    </div>
  );
}
