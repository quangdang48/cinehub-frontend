import { Bell, Search } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAppSelector } from "@/store"
import useAuth from "@/hooks/useAuth"
import UserMenu from "./user-menu";

export default function Header() {
  const { signOut } = useAuth();
  const signedIn = useAppSelector((state) => state.auth.session.signedIn);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  const handleLogout = () => {
    signOut();
  };

  const isMovieDetail = location.pathname.includes('/movie/');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] px-6 py-4 md:px-12 md:py-4 border-b border-neutral-800/50 transition-colors duration-300 ${
        isMovieDetail
          ? 'bg-black/80 backdrop-blur-sm'
          : 'bg-transparent backdrop-blur-none'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-red-600 font-black text-2xl md:text-3xl hover:opacity-80 transition">
              CINEHUB
            </Link>

            {/* Navigation Menu */}
            {isMovieDetail && (
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link to="/movies" className="text-neutral-300 hover:text-white transition">
                  Phim Lẻ
                </Link>
                <Link to="/series" className="text-neutral-300 hover:text-white transition">
                  Phim Bộ
                </Link>
                <Link to="/genres" className="text-neutral-300 hover:text-white transition flex items-center gap-1">
                  Thể loại
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <Link to="/countries" className="text-neutral-300 hover:text-white transition flex items-center gap-1">
                  Quốc gia
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <Link to="/new" className="text-neutral-300 hover:text-white transition">
                  Xem Chung
                </Link>
                <Link to="/trending" className="text-neutral-300 hover:text-white transition flex items-center gap-1">
                  Thêm
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <Link to="/new" className="text-yellow-500 hover:text-yellow-400 transition flex items-center gap-1">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded font-bold mr-1">NEW</span>
                  Rồi Bóng
                </Link>
              </nav>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            {isMovieDetail && (
              <button className="p-2 text-neutral-300 hover:text-white transition">
                <Search size={20} />
              </button>
            )}

            {signedIn ? (
              <>
                {/* Notification Bell */}
                <Link 
                  to="/profile?tab=notifications"
                  className="relative p-2 text-neutral-300 hover:text-white transition"
                >
                  <Bell size={20} />
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
        </div>
      </div>
    </header>
  )
}
