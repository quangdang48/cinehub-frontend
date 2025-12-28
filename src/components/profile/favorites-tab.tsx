import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, Play, Loader2 } from "lucide-react";
import { useWishlist } from "@/hooks";
import { FilmService } from "@/services/FilmService";
import type { FilmDto } from "@/types/FilmDto";
import { normalizeUrl } from "@/utils/videoUtils";

interface WishlistFilm extends FilmDto {
  wishlistId: string;
}

export default function FavoritesTab() {
  const navigate = useNavigate();
  const {
    wishlistItems,
    fetchWishlist,
    removeFromWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const [films, setFilms] = useState<WishlistFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch wishlist and film details
  useEffect(() => {
    const loadWishlistFilms = async () => {
      setLoading(true);
      await fetchWishlist();
    };
    loadWishlistFilms();
  }, [fetchWishlist]);

  // Fetch film details when wishlist items change
  useEffect(() => {
    const loadFilmDetails = async () => {
      if (wishlistItems.length === 0) {
        setFilms([]);
        setLoading(false);
        return;
      }

      try {
        const filmPromises = wishlistItems.map(async (item) => {
          try {
            const response = await FilmService.filmControllerGetOneV1(
              item.filmId,
            );
            return { ...response.data, wishlistId: item.id } as WishlistFilm;
          } catch (err) {
            console.error(`Error fetching film ${item.filmId}:`, err);
            return null;
          }
        });

        const filmResults = await Promise.all(filmPromises);
        setFilms(filmResults.filter((f): f is WishlistFilm => f !== null));
      } catch (err) {
        console.error("Error loading film details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!wishlistLoading) {
      loadFilmDetails();
    }
  }, [wishlistItems, wishlistLoading]);

  const handleRemove = async (filmId: string) => {
    setRemovingId(filmId);
    const result = await removeFromWishlist(filmId);
    if (result.success) {
      setFilms((prev) => prev.filter((f) => f.id !== filmId));
    }
    setRemovingId(null);
  };

  const handleNavigateToFilm = (filmId: string) => {
    navigate(`/movie/${filmId}`);
  };

  if (loading || wishlistLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          <span className="ml-3 text-gray-400">
            Đang tải danh sách yêu thích...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Yêu thích</h2>
        <p className="text-gray-400 text-sm">
          {films.length > 0
            ? `Bạn có ${films.length} phim trong danh sách yêu thích`
            : "Danh sách phim yêu thích của bạn"}
        </p>
      </div>

      {films.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
            <Heart className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Chưa có phim yêu thích
          </h3>
          <p className="text-gray-400 mb-6">
            Bắt đầu thêm các bộ phim yêu thích của bạn
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition"
          >
            Khám phá phim
          </button>
        </div>
      ) : (
        /* Films Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {films.map((film) => (
            <div
              key={film.id}
              className="group relative bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition-all"
            >
              {/* Poster */}
              <div
                className="aspect-2/3 cursor-pointer"
                onClick={() => handleNavigateToFilm(film.id)}
              >
                <img
                  src={
                    film.posters?.find((p) => p.type === "thumbnail") ? normalizeUrl(film.posters.find((p) => p.type === "thumbnail")!.url) : "/placeholder.jpg"
                  }
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/300x450/1e293b/ffffff?text=NO+IMAGE")
                  }
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToFilm(film.id);
                    }}
                    className="p-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition"
                    title="Xem phim"
                  >
                    <Play size={20} fill="black" className="text-black" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(film.id);
                    }}
                    disabled={removingId === film.id}
                    className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition disabled:opacity-50"
                    title="Xóa khỏi yêu thích"
                  >
                    {removingId === film.id ? (
                      <Loader2 size={20} className="text-white animate-spin" />
                    ) : (
                      <Trash2 size={20} className="text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h4
                  className="text-white font-medium text-sm truncate cursor-pointer hover:text-yellow-400 transition"
                  onClick={() => handleNavigateToFilm(film.id)}
                >
                  {film.title}
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(film.releaseDate).getFullYear()} •{" "}
                  {film.genres
                    ?.map((g) => g.name)
                    .slice(0, 2)
                    .join(", ")}
                </p>
              </div>

              {/* Heart badge */}
              <div className="absolute top-2 right-2">
                <Heart size={16} fill="red" className="text-red-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
