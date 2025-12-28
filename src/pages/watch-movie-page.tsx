import { useEffect, useCallback, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import {
  VideoPlayer,
  VideoActionBar,
  VideoInfo,
  EpisodeList,
  ActorGrid,
  RecommendedMovies,
} from "@/components/watch";
import { CommentSection } from "@/components";
import {
  useFilmData,
  useEpisodesData,
  useCurrentEpisode,
  useRecommendedFilms,
  useUserActions,
  useWishlist,
} from "@/hooks";
import {
  getFilmHlsUrl,
  getVideoPoster,
  getVideoTitle,
  isSeries,
} from "../utils/watchPageUtils";
import { toast } from "sonner";

export default function WatchMoviePage() {
  const { id: filmId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const episodeNumberFromUrl = searchParams.get("ep");
  const seasonNumberFromUrl = searchParams.get("season");

  const { film, loading: filmLoading, error: filmError } = useFilmData(filmId);

  // Lấy mùa hiện tại từ URL hoặc mặc định là 1
  const [currentSeason, setCurrentSeason] = useState<number>(
    seasonNumberFromUrl ? parseInt(seasonNumberFromUrl) : 1
  );

  // Lấy danh sách seasons từ film
  const seasons = useMemo(() => {
    if (!film || !isSeries(film)) return [];
    return film.seasons || [];
  }, [film]);

  // Lấy episodes của mùa hiện tại
  const { episodes, loading: episodesLoading } = useEpisodesData(
    filmId,
    currentSeason,
    isSeries(film),
  );

  const { currentEpisode, setCurrentEpisode, selectNextEpisode } =
    useCurrentEpisode({
      episodes,
      episodeNumberFromUrl,
    });

  const { recommendedFilms } = useRecommendedFilms(filmId, 10);
  
  const streamUrl = useMemo(() => {
    if (!film) return null;
    if (isSeries(film) && !currentEpisode) return null;

    return getFilmHlsUrl(
      film.id,
      isSeries(film) ? currentSeason : undefined,
      isSeries(film) && currentEpisode ? currentEpisode.number : undefined,
    );
  }, [film, currentEpisode, currentSeason]);

  const {
    theaterMode,
    toggleTheaterMode,
    handleShare,
    handleReport,
  } = useUserActions();

  const {
      isInWishlist,
      loading: wishlistLoading,
      toggleWishlist,
    } = useWishlist(film?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cập nhật currentSeason khi URL thay đổi
  useEffect(() => {
    if (seasonNumberFromUrl) {
      setCurrentSeason(parseInt(seasonNumberFromUrl));
    }
  }, [seasonNumberFromUrl]);

  const handleSelectSeason = useCallback(
    (seasonNumber: number) => {
      setCurrentSeason(seasonNumber);
      setCurrentEpisode(null);
      setSearchParams({ season: seasonNumber.toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setCurrentEpisode, setSearchParams],
  );

  const handleSelectEpisode = useCallback(
    (episode: typeof currentEpisode) => {
      if (!episode) return;
      setCurrentEpisode(episode);
      const params: Record<string, string> = { ep: episode.number.toString() };
      if (currentSeason > 1) {
        params.season = currentSeason.toString();
      }
      setSearchParams(params);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setCurrentEpisode, setSearchParams, currentSeason],
  );

  const handleVideoEnded = useCallback(() => {
    if (isSeries(film)) {
      const hasNext = selectNextEpisode();
      if (hasNext && currentEpisode) {
        const nextEpisodeNumber = currentEpisode.number + 1;
        const params: Record<string, string> = { ep: nextEpisodeNumber.toString() };
        if (currentSeason > 1) {
          params.season = currentSeason.toString();
        }
        setSearchParams(params);
      }
    }
  }, [film, selectNextEpisode, currentEpisode, setSearchParams, currentSeason]);

  const handleVideoError = useCallback((error: any) => {
    console.error("Video player error:", error);
    toast.error("Lỗi phát video. Vui lòng thử lại sau.");
  }, []);

  const isLoading = filmLoading || episodesLoading;
  const error = filmError;

  // Loading state
  if (isLoading || !streamUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-yellow-500 animate-spin mx-auto" />
            <div className="absolute inset-0 blur-2xl bg-yellow-500/30 animate-pulse" />
          </div>
          <p className="text-gray-400 mt-4 animate-pulse">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !film) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-2">
            {error || "Không tìm thấy phim"}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Vui lòng kiểm tra lại hoặc thử tải lại trang
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0a0a0f]`}>
      <div
        className={`fixed inset-0 bg-black/90 z-40 transition-opacity duration-500 pointer-events-auto ${
          theaterMode
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => toggleTheaterMode()}
      />

      {/* Main Content */}
      <div
        className={`relative flex-1 pt-24 px-4 container mx-auto max-w-6xl z-auto`}
      >
        <div className="top-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 h-16">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                aria-label="Quay lại"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">
                  Xem phim {film.title}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div
          className={`relative w-full transition-all duration-300 ${
            theaterMode ? "z-50" : "z-auto"
          }`}
        >
          <div className={theaterMode ? "w-full h-full" : ""}>
              <VideoPlayer
                key={`${filmId}-${currentSeason}-${currentEpisode?.id || "movie"}`}
                src={streamUrl}
                poster={getVideoPoster(film)}
                title={getVideoTitle(film, currentEpisode?.number)}
                onEnded={handleVideoEnded}
                autoPlay={false}
                onError={handleVideoError}
                filmId={film.id}
                season={isSeries(film) ? currentSeason : undefined}
                episode={isSeries(film) && currentEpisode ? currentEpisode.number : undefined}
              />
          </div>
        </div>

        {/* Content Below Video - Ẩn trong theater mode */}
        <div className="container mx-auto px-4 lg:px-8 pb-16">
          {/* Action Bar */}
          <VideoActionBar
            isFavorite={isInWishlist}
            wishlistLoading={wishlistLoading}
            theaterModeActive={theaterMode}
            onToggleFavorite={toggleWishlist}
            onTheaterMode={toggleTheaterMode}
            onShare={handleShare}
            onReport={handleReport}
          />

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Left Column - Main Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Video Info */}
              <VideoInfo
                film={film}
                currentEpisode={currentEpisode}
                totalRatings={10}
                onNavigateToDetail={() => navigate(`/movie/${film.id}`)}
              />

              {/* Episode List (for series) */}
              {isSeries(film) && episodes.length > 0 && (
                <EpisodeList
                  film={film}
                  episodes={episodes}
                  currentEpisodeId={currentEpisode?.id}
                  onSelectEpisode={handleSelectEpisode}
                  seasons={seasons}
                  currentSeason={currentSeason}
                  onSelectSeason={handleSelectSeason}
                />
              )}

              {/* Comments & Reviews Section */}
              <CommentSection
                filmId={film.id}
                averageRating={film.userRating || film.imdbRating}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-8">
              {/* Actors */}
              {film.casts.length > 0 && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                  <ActorGrid casts={film.casts} maxDisplay={6} />
                </div>
              )}

              {/* Recommended Movies */}
              {recommendedFilms.length > 0 && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                  <RecommendedMovies
                    films={recommendedFilms}
                    currentFilmId={film.id}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
