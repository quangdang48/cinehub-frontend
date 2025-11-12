import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { UserDto } from "@/types/UserDto";
import { setUser, useAppDispatch, useAppSelector } from "@/store";
import { UserService } from "@/services/UserService";
import type { UpdateUserDto } from "@/types/UpdateUserDto";
import useAuth from "@/hooks/useAuth";
import { FavoritesTab, ProfileForm, ListsTab, ContinueWatchingTab, NotificationsTab, ProfileSidebar } from "@/components";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("account");
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
    const response = await UserService.userControllerUpdateUserV1(user.id, values);
    response && dispatch(setUser(response.data));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <ProfileForm user={user} onUpdate={handleUpdateProfile} />;
      case "favorites":
        return <FavoritesTab />;
      case "lists":
        return <ListsTab />;
      case "continue":
        return <ContinueWatchingTab />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
