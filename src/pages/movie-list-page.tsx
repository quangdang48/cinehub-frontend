import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import {
  MovieGrid,
  MovieFilter,
  FilterToggle,
  type FilterOptions,
} from "@/components";
import { FilmService } from "@/services/FilmService";
import { COUNTRY_LIST, GENRE_LIST, PAGE_TITLES } from "@/constant/movie.const";
import type { FilmDto } from "@/types/FilmDto";

const SORT_MAP: Record<string, string> = {
  newest: '{"releaseDate":"DESC"}',
  views: '{"views":"DESC"}',
  imdb: '{"imdbRating":"DESC"}',
};
const PAGE_SIZE = 21;

export default function MovieListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [films, setFilms] = useState<FilmDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filters = useMemo((): FilterOptions => {
    const initialFilters: FilterOptions = {
      country: searchParams.get("country") || undefined,
      type: (searchParams.get("type") as FilterOptions["type"]) || undefined,
      rating: searchParams.get("rating") || undefined,
      genre: searchParams.get("genre") || undefined,
      year: searchParams.get("year") || undefined,
      sortBy: (searchParams.get("sort") as FilterOptions["sortBy"]) || undefined,
    };
    if (location.pathname.includes("phim-le")) {
      initialFilters.type = "movie";
    } else if (location.pathname.includes("phim-bo")) {
      initialFilters.type = "series";
    }
    return initialFilters;
  }, [searchParams, location.pathname]);

  const getPageTitle = (): string => {
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
    return PAGE_TITLES[path];
  };

  const loadFilms = useCallback(
    async (pageNumber: number, resetList: boolean = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const sort = filters.sortBy ? SORT_MAP[filters.sortBy] : undefined;
        const response = await FilmService.filmControllerGetAll(
            pageNumber,
            PAGE_SIZE,
            sort,
            undefined,
            filters.country ? COUNTRY_LIST.find(c => c.slug === filters.country)?.value.toUpperCase() : undefined,
            filters.year ? parseInt(filters.year) : undefined,
            filters.genre,
            undefined,
            undefined,
            undefined,
            filters.type ? filters.type.toUpperCase() as any : undefined,
            filters.rating ? filters.rating.toUpperCase() as any : undefined,
          );

        const newFilms = response.data || [];

        if (resetList) {
          setFilms(newFilms);
        } else {
          setFilms((prev) => [...prev, ...newFilms]);
        }

        setHasMore(newFilms.length === PAGE_SIZE);
        setPage(pageNumber);
      } catch (error) {
        console.error("Error loading films:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, loading],
  );

  useEffect(() => {
    loadFilms(1, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters]);

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

  const handleApplyFilters = (newFilters: FilterOptions) => {
    const params = new URLSearchParams();
    if (newFilters.country) params.set("country", newFilters.country);
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.rating) params.set("rating", newFilters.rating);
    if (newFilters.genre) params.set("genre", newFilters.genre);
    if (newFilters.year) params.set("year", newFilters.year);
    if (newFilters.sortBy) params.set("sort", newFilters.sortBy);
    navigate(`/filter?${params.toString()}`);
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
