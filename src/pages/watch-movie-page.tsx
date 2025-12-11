import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { FilmService } from '@/services/FilmService';
import { EpisodesService } from '@/services/EpisodesService';
import type { FilmDto } from '@/types/FilmDto';
import type { EpisodeDto } from '@/types/EpisodeDto';
import {
  VideoPlayer,
  VideoActionBar,
  VideoInfo,
  EpisodeList,
  WatchCommentSection,
  ActorGrid,
  RecommendedMovies,
} from '@/components/watch';

export default function WatchMoviePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [film, setFilm] = useState<FilmDto | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeDto[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeDto | null>(null);
  const [recommendedFilms, setRecommendedFilms] = useState<FilmDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User actions state
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);

  // Fetch film data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch film details and recommended films
        const [filmResponse, recommendedResponse] = await Promise.all([
          FilmService.filmControllerGetOneV1(id),
          FilmService.filmControllerGetAll(1, 10),
        ]);

        setFilm(filmResponse.data);
        setRecommendedFilms(recommendedResponse.data);

        // Fetch episodes for series
        if (filmResponse.data.type === 'SERIES') {
          const episodesResponse = await EpisodesService.episodeControllerGetAllV1({
            filmId: id,
            season: 1,
          });
          setEpisodes(episodesResponse.data);
          
          // Set current episode from URL or default to first
          const episodeNumber = searchParams.get('ep');
          if (episodeNumber) {
            const ep = episodesResponse.data.find(e => e.number === parseInt(episodeNumber));
            setCurrentEpisode(ep || episodesResponse.data[0] || null);
          } else {
            setCurrentEpisode(episodesResponse.data[0] || null);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải phim. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchData();
  }, [id, searchParams]);

  // Handle episode selection
  const handleSelectEpisode = useCallback((episode: EpisodeDto) => {
    setCurrentEpisode(episode);
    setSearchParams({ ep: episode.number.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  // Handle video ended
  const handleVideoEnded = useCallback(() => {
    if (film?.type === 'SERIES' && currentEpisode) {
      const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
      if (currentIndex < episodes.length - 1) {
        handleSelectEpisode(episodes[currentIndex + 1]);
      }
    }
  }, [film, currentEpisode, episodes, handleSelectEpisode]);

  // Get video source (placeholder - should be from API)
  const getVideoSource = () => {
    // In real app, this would come from the API based on episode/film
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  };

  // Get poster for video
  const getVideoPoster = () => {
    const backdropPoster = film?.posters.find(p => p.type === 'backdrop');
    const thumbnailPoster = film?.posters.find(p => p.type === 'thumbnail');
    return backdropPoster?.url || thumbnailPoster?.url;
  };

  if (loading) {
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

  if (error || !film) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Không tìm thấy phim'}</p>
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
    <div className={`min-h-screen bg-[#0a0a0f] ${theaterMode ? 'theater-mode' : ''}`}>
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/3 rounded-full blur-[200px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {/* Header */}
        <div className="top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 h-16">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Xem phim {film.title}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className={`${theaterMode ? 'max-w-none px-0' : 'container mx-auto px-4 lg:px-8'}`}>
          <div className={`${theaterMode ? '' : 'pt-6'}`}>
            <VideoPlayer
              src={getVideoSource()}
              poster={getVideoPoster()}
              title={currentEpisode ? `${film.title} - Tập ${currentEpisode.number}` : film.title}
              onEnded={handleVideoEnded}
              autoPlay={false}
            />
          </div>
        </div>

        {/* Content Below Video */}
        <div className="container mx-auto px-4 lg:px-8 pb-16">
          {/* Action Bar */}
          <VideoActionBar
            isFavorite={isFavorite}
            isInWatchlist={isInWatchlist}
            theaterModeActive={theaterMode}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
            onAddToWatchlist={() => setIsInWatchlist(!isInWatchlist)}
            onTheaterMode={() => setTheaterMode(!theaterMode)}
            onShare={() => {
              navigator.clipboard.writeText(window.location.href);
              // TODO: Show toast notification
            }}
            onReport={() => {
              // TODO: Open report modal
            }}
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
              {film.type === 'SERIES' && episodes.length > 0 && (
                <EpisodeList
                  film={film}
                  episodes={episodes}
                  currentEpisodeId={currentEpisode?.id}
                  onSelectEpisode={handleSelectEpisode}
                />
              )}

              {/* Comments & Reviews Section */}
              <WatchCommentSection
                filmId={film.id}
                averageRating={film.userRating || film.imdbRating}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-8">
              {/* Actors */}
              {film.actors.length > 0 && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                  <ActorGrid
                    actors={film.actors}
                    maxDisplay={6}
                  />
                </div>
              )}

              {/* Recommended Movies */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                <RecommendedMovies
                  films={recommendedFilms}
                  currentFilmId={film.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theater Mode Overlay */}
      {theaterMode && (
        <div className="fixed inset-0 bg-black/90 z-40 pointer-events-none" />
      )}

      {/* Custom Styles */}
      <style>{`
        .theater-mode {
          overflow: hidden;
        }
        .theater-mode .theater-video {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: black;
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
