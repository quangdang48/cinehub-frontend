import { Bell, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppSelector } from "@/store"
import { useAuth } from "@/hooks"
import UserMenu from "./user-menu";
import { useEffect, useState, useCallback } from "react";
import { MegaMenuDropdown } from "./mega-menu-dropdown";
import { COUNTRY_LIST, GENRE_LIST } from "@/constant/movie.const";

type OpenDropdown = "genre" | "country" | null;

export default function Header() {
  const { signOut } = useAuth();
  const signedIn = useAppSelector((state) => state.auth.session.signedIn);
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    signOut();
  };

  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleDropdown = useCallback((dropdown: OpenDropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-9999 px-6 py-4 md:px-12 md:py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-black/30 backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-red-600 font-black text-2xl md:text-3xl hover:opacity-80 transition">
              CINEHUB
            </Link>
            </div>
            <div>

            {/* Navigation Menu */}
            
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link to="/phim-le" className="text-neutral-300 hover:text-white transition">
                  Phim Lẻ
                </Link>
                <Link to="/phim-bo" className="text-neutral-300 hover:text-white transition">
                  Phim Bộ
                </Link>
                
                {/* Thể loại Dropdown */}
                <MegaMenuDropdown
                  label="Thể loại"
                  items={GENRE_LIST}
                  isOpen={openDropdown === "genre"}
                  onToggle={() => handleToggleDropdown("genre")}
                  onClose={handleCloseDropdown}
                  basePath="/genre"
                  columns={5}
                />

                {/* Quốc gia Dropdown */}
                <MegaMenuDropdown
                  label="Quốc gia"
                  items={COUNTRY_LIST}
                  isOpen={openDropdown === "country"}
                  onToggle={() => handleToggleDropdown("country")}
                  onClose={handleCloseDropdown}
                  basePath="/country"
                  columns={4}
                />
              </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
              <button className="p-2 text-neutral-300 hover:text-white transition">
                <Search size={20} />
              </button>

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
