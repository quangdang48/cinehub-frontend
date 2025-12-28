import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import {
  MovieGrid,
  MovieFilter,
  FilterToggle,
  type FilterOptions,
} from "@/components";
import { FilmService } from "@/services/FilmService";
import { COUNTRY_LIST, GENRE_LIST } from "@/constant/movie.const";
import type { FilmDto } from "@/types/FilmDto";

// Page titles based on route/type
const PAGE_TITLES: Record<string, string> = {
  "phim-le": "Phim lẻ",
  "phim-bo": "Phim bộ",
  "phim-chieu-rap": "Phim chiếu rạp",
  "phim-moi": "Phim mới",
};

// Map filter sortBy to API sort parameter
const SORT_MAP: Record<string, string> = {
  newest: "DESC",
  updated: "DESC",
  imdb: "DESC",
  views: "DESC",
};

const PAGE_SIZE = 21; // 7 columns x 3 rows

export default function MovieListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [films, setFilms] = useState<FilmDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Parse filters from URL
  const getFiltersFromUrl = useCallback((): FilterOptions => {
    return {
      country: searchParams.get("country") || undefined,
      type: (searchParams.get("type") as FilterOptions["type"]) || undefined,
      rating: searchParams.get("rating") || undefined,
      genre: searchParams.get("genre") || undefined,
      version: searchParams.get("version") || undefined,
      year: searchParams.get("year") || undefined,
      sortBy: (searchParams.get("sort") as FilterOptions["sortBy"]) || "newest",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterOptions>(getFiltersFromUrl);

  // Observer ref for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Determine page title based on route
  const getPageTitle = (): string => {
    // Check path for specific pages
    const path = location.pathname.split("/").pop() || "";
    if (path === "genre") {
      const genre = GENRE_LIST.find(
        (g) => g.slug === searchParams.get("genre"),
      );
      return genre ? `Phim ${genre.label}` : "Thể loại";
    }
    if (path === "country") {
      const country = COUNTRY_LIST.find(
        (c) => c.slug === searchParams.get("country"),
      );
      return country ? `Phim ${country.label}` : "Quốc gia";
    }
    return PAGE_TITLES[path] || "Danh sách phim";
  };

  // Set initial filter type based on route
  useEffect(() => {
    const initialFilters = getFiltersFromUrl();

    // Auto-set type based on route
    if (location.pathname.includes("phim-le")) {
      initialFilters.type = "movie";
    } else if (location.pathname.includes("phim-bo")) {
      initialFilters.type = "series";
    }

    setFilters(initialFilters);
  }, [location.pathname, getFiltersFromUrl]);

  // Load films from API
  const loadFilms = useCallback(
    async (pageNumber: number, resetList: boolean = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const sortParam = filters.sortBy ? SORT_MAP[filters.sortBy] : undefined;

        // Call API based on sort type
        let response;
        if (filters.sortBy === "views") {
          response = await FilmService.filmControllerGetAll(
            pageNumber,
            PAGE_SIZE,
            `{"views":"${sortParam}"}`,
            undefined,
            filters.country,
            filters.year ? parseInt(filters.year) : undefined,
          );
        } else {
          response = await FilmService.filmControllerGetAll(
            pageNumber,
            PAGE_SIZE,
            `{"createdAt":"${sortParam}"}`,
            undefined,
            filters.country,
            filters.year ? parseInt(filters.year) : undefined,
          );
        }

        const newFilms = response.data || [];

        if (resetList) {
          setFilms(newFilms);
        } else {
          setFilms((prev) => [...prev, ...newFilms]);
        }

        // Check if there are more films to load
        setHasMore(newFilms.length === PAGE_SIZE);
        setPage(pageNumber);
      } catch (error) {
        console.error("Error loading films:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters.sortBy, loading],
  );

  // Initial load
  useEffect(() => {
    loadFilms(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadFilms(page + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, page, loadFilms]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Apply filters and update URL
  const handleApplyFilters = () => {
    // Update URL with filters
    const params = new URLSearchParams();

    if (filters.country) params.set("country", filters.country);
    if (filters.type && filters.type !== "all")
      params.set("type", filters.type);
    if (filters.rating) params.set("rating", filters.rating);
    if (filters.genre) params.set("genre", filters.genre);
    if (filters.version) params.set("version", filters.version);
    if (filters.year) params.set("year", filters.year);
    if (filters.sortBy) params.set("sort", filters.sortBy);

    navigate(`/filter?${params.toString()}`);

    // Reset and reload films
    setFilms([]);
    setPage(1);
    setHasMore(true);
    loadFilms(1, true);

    // Close filter panel
    setIsFilterOpen(false);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="px-4 md:px-8 lg:px-12 xl:px-20 py-8 pt-24">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <LayoutGrid className="text-yellow-400" size={24} />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {getPageTitle()}
            </h1>
          </div>

          {/* Filter Toggle */}
          <FilterToggle
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-8 animate-slideDown">
            <MovieFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onClose={handleCloseFilter}
            />
          </div>
        )}

        {/* Movie Grid */}
        <MovieGrid films={films} loading={loading} />

        {/* Load More Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loading && (
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        )}

        {/* No more films message */}
        {!hasMore && films.length > 0 && (
          <div className="text-center py-8 text-neutral-500">
            Đã hiển thị tất cả phim
          </div>
        )}
      </main>

      {/* Custom animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
