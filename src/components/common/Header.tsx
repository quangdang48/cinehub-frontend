import { Bell, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { useAuth } from "@/hooks";
import UserMenu from "./user-menu";
import { useEffect, useState, useCallback, useRef } from "react";
import { MegaMenuDropdown } from "./mega-menu-dropdown";
import { COUNTRY_LIST } from "@/constant/movie.const";
import type { GenreDto } from "@/types/GenreDto";
import { GenresService } from "@/services/GenresService";

type OpenDropdown = "genre" | "country" | null;

export default function Header() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const signedIn = useAppSelector((state) => state.auth.session.signedIn);
  const user = useAppSelector((state) => state.auth.user);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/filter?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue("");
    }
  };
  useEffect(() => {
      const fetchGenres = async () => {
        try {
          setLoading(true);
          const response = await GenresService.genreControllerGetAllV1({
            page: 1,
            limit: 1000,
          });
          setGenres(response.data);
        } catch (error) {
          console.error("Error fetching genres:", error);
        }
        finally {
          setLoading(false);
        }
      };
      fetchGenres();
    }, []);

  const handleLogout = () => {
    signOut();
  };

  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleDropdown = useCallback((dropdown: OpenDropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 px-6 py-4 md:px-12 md:py-4 transition-all duration-300 ${
        scrolled ? "bg-black/30 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-red-600 font-black text-2xl md:text-3xl hover:opacity-80 transition"
            >
              CINEHUB
            </Link>
          </div>
          <div>
            {/* Navigation Menu */}

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                to="/phim-le"
                className="text-neutral-300 hover:text-white transition"
              >
                Phim Lẻ
              </Link>
              <Link
                to="/phim-bo"
                className="text-neutral-300 hover:text-white transition"
              >
                Phim Bộ
              </Link>

              {/* Thể loại Dropdown */}
              { loading ? (
                <div className="text-neutral-500">Đang tải...</div>
              ) : (
                <MegaMenuDropdown
                  label="Thể loại"
                  items={genres.map((genre) => ({
                    label: genre.name,
                    value: genre.name,
                    slug: genre.slug,
                  }))}
                  isOpen={openDropdown === "genre"}
                  onToggle={() => handleToggleDropdown("genre")}
                  onClose={handleCloseDropdown}
                  basePath="/genre"
                  columns={5}
                />
              )}

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
            {/* Search Bar */}
            <div className="relative flex items-center">
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                  isSearchOpen ? "w-40 md:w-64 opacity-100 mr-2" : "w-0 opacity-0"
                }`}
              >
                <form onSubmit={handleSearch} className="w-full relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-full bg-black/50 border border-neutral-700 rounded-full pl-4 pr-8 py-1.5 text-sm text-white focus:outline-none focus:border-red-600 placeholder-neutral-500"
                    onBlur={() => {
                      if (!searchValue) setIsSearchOpen(false);
                    }}
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => setSearchValue("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </form>
              </div>
              <button
                onClick={() => {
                  if (isSearchOpen && searchValue) {
                    handleSearch({ preventDefault: () => {} } as any);
                  } else {
                    setIsSearchOpen(!isSearchOpen);
                  }
                }}
                className={`p-2 transition-colors ${
                  isSearchOpen ? "text-red-600" : "text-neutral-300 hover:text-white"
                }`}
              >
                <Search size={20} />
              </button>
            </div>

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
  );
}
