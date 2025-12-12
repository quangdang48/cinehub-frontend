import { useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import {
  VideoPlayer,
  VideoActionBar,
  VideoInfo,
  EpisodeList,
  ActorGrid,
  RecommendedMovies,
} from '@/components/watch';
import { CommentSection } from '@/components';
import {
  useFilmData,
  useEpisodesData,
  useStreamingUrl,
  useCurrentEpisode,
  useRecommendedFilms,
  useUserActions,
} from '@/hooks';
import { getVideoPoster, getVideoTitle, isSeries } from '../utils/watchPageUtils';

export default function WatchMoviePage() {
  const { id: filmId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get episode number từ URL query params
  const episodeNumberFromUrl = searchParams.get('ep');

  // Fetch film data
  const { film, loading: filmLoading, error: filmError } = useFilmData(filmId);

  // Fetch episodes (chỉ khi là series)
  const { episodes, loading: episodesLoading } = useEpisodesData(
    filmId,
    1, // TODO: Support multiple seasons
    isSeries(film)
  );

  // Current episode management
  const { currentEpisode, setCurrentEpisode, selectNextEpisode } = useCurrentEpisode({
    episodes,
    episodeNumberFromUrl,
  });

  // Fetch streaming URL
  const { streamUrl, loading: streamLoading, error: streamError } = useStreamingUrl({
    filmId,
    filmType: film?.type,
    season: isSeries(film) ? 1 : undefined,
    episode: currentEpisode?.number,
    enabled: !!film, // Chỉ fetch khi đã có film data
  });

  // Fetch recommended films
  const { recommendedFilms } = useRecommendedFilms(filmId, 10);

  // User actions
  const {
    isFavorite,
    isInWatchlist,
    theaterMode,
    toggleFavorite,
    toggleWatchlist,
    toggleTheaterMode,
    handleShare,
    handleReport,
  } = useUserActions();

  // Scroll to top khi component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle episode selection
  const handleSelectEpisode = useCallback((episode: typeof currentEpisode) => {
    if (!episode) return;
    setCurrentEpisode(episode);
    setSearchParams({ ep: episode.number.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentEpisode, setSearchParams]);

  const handleVideoEnded = useCallback(() => {
    if (isSeries(film)) {
      const hasNext = selectNextEpisode();
      if (hasNext && currentEpisode) {
        const nextEpisodeNumber = currentEpisode.number + 1;
        setSearchParams({ ep: nextEpisodeNumber.toString() });
      }
    }
  }, [film, selectNextEpisode, currentEpisode, setSearchParams]);

  const handleVideoError = useCallback((error: any) => {
    console.error('Video player error:', error);
  }, []);

  // Calculate loading state
  const isLoading = filmLoading || episodesLoading || streamLoading;
  const error = filmError || streamError;

  // Loading state
  if (isLoading && !film) {
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
            {error || 'Không tìm thấy phim'}
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
          theaterMode ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => toggleTheaterMode()}
      />

      {/* Main Content */}
      <div className={`relative flex-1 pt-24 px-4 container mx-auto max-w-6xl z-auto`}>
          <div className="top-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center gap-4 h-16">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  aria-label="Quay lại"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Xem phim {film.title}</span>
                </button>
              </div>
            </div>
          </div>

        {/* Video Section */}
        <div className={`relative w-full transition-all duration-300 ${
            theaterMode ? 'z-50' : 'z-auto'
          }`}>
          <div className={theaterMode ? 'w-full h-full' : ''}>
            {streamUrl ? (
              <VideoPlayer
                key={`${filmId}-${currentEpisode?.id || 'movie'}`}
                src={streamUrl}
                poster={getVideoPoster(film)}
                title={getVideoTitle(film, currentEpisode?.number)}
                onEnded={handleVideoEnded}
                autoPlay={false}
                onError={handleVideoError}
              />
            ) : streamLoading ? (
              <div className="w-full aspect-video bg-black rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Đang tải video...</p>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video bg-black/50 rounded-2xl flex items-center justify-center border border-red-500/20">
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-400 font-medium mb-2">
                    {streamError || 'Không thể tải video'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Vui lòng thử lại sau hoặc liên hệ hỗ trợ
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Below Video - Ẩn trong theater mode */}
          <div className="container mx-auto px-4 lg:px-8 pb-16">
          {/* Action Bar */}
          <VideoActionBar
            isFavorite={isFavorite}
            isInWatchlist={isInWatchlist}
            theaterModeActive={theaterMode}
            onToggleFavorite={toggleFavorite}
            onAddToWatchlist={toggleWatchlist}
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
