import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { UserDto } from "@/types/UserDto";
import { setUser, useAppDispatch, useAppSelector } from "@/store";
import { UserService } from "@/services/UserService";
import type { UpdateUserDto } from "@/types/UpdateUserDto";
import { useAuth } from "@/hooks";
import {
  FavoritesTab,
  ProfileForm,
  ContinueWatchingTab,
  NotificationsTab,
  ProfileSidebar,
  ChangePasswordForm,
} from "@/components";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const user: UserDto = useAppSelector((state) => state.auth.user);

  // Sync activeTab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleLogout = () => {
    signOut();
  };

  const handleUpdateProfile = async (values: UpdateUserDto) => {
    const response = await UserService.userControllerUpdateUserV1(
      user.id,
      values,
    );
    response && dispatch(setUser(response.data));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Close sidebar on mobile when tab is clicked
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <ProfileForm user={user} onUpdate={handleUpdateProfile} />;
      case "favorites":
        return <FavoritesTab />;
      case "continue":
        return <ContinueWatchingTab />;
      case "notifications":
        return <NotificationsTab />;
      case "change-password":
        return <ChangePasswordForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg text-white hover:bg-gray-800 transition"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Quản lý tài khoản
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div
            className={`lg:col-span-4 xl:col-span-3 ${sidebarOpen
              ? "block fixed lg:static top-0 left-0 right-0 z-50 p-4 lg:p-0 bg-black lg:bg-transparent"
              : "hidden lg:block"
              }`}
          >
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={handleLogout}
            />
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
