import { Bell } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppSelector } from "@/store"
import useAuth from "@/hooks/useAuth"
import UserMenu from "./user-menu";

export default function Header() {
  const { signOut } = useAuth();
  const signedIn = useAppSelector((state) => state.auth.session.signedIn);
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 md:px-12 md:py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-red-600 font-black text-3xl md:text-4xl hover:opacity-80 transition">
          CINEHUB
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {signedIn ? (
          <>
            {/* Notification Bell */}
            <Link 
              to="/profile?tab=notifications"
              className="relative p-2 text-gray-300 hover:text-white transition"
            >
              <Bell size={22} />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </Link>

            {/* User Menu */}
            <UserMenu user={user} onLogout={handleLogout} />
          </>
        ) : (
          <Link to="/login">
            <button className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition">
              Đăng nhập
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
