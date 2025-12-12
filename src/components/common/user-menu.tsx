import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Heart, List, PlayCircle, Bell, CreditCard, LogOut } from "lucide-react";
import type { UserDto } from "@/types/UserDto";

interface UserMenuProps {
  user: UserDto;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      icon: User,
      label: "Tài khoản",
      href: "/profile",
    },
    {
      icon: Heart,
      label: "Yêu thích",
      href: "/profile?tab=favorites",
    },
    {
      icon: List,
      label: "Danh sách",
      href: "/profile?tab=lists",
    },
    {
      icon: PlayCircle,
      label: "Xem tiếp",
      href: "/profile?tab=continue",
    },
    {
      icon: Bell,
      label: "Thông báo",
      href: "/profile?tab=notifications",
    },
    {
      icon: CreditCard,
      label: "Nâng cấp Premium",
      href: "/billing",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition"
      >
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-red-600 flex items-center justify-center text-white font-semibold">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-10000">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{user.name}</p>
                <p className="text-gray-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition"
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-700">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition"
            >
              <LogOut size={18} />
              <span className="text-sm">Thoát</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
