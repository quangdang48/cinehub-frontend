import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FilmService } from '@/services/FilmService';
import { MovieHero, EpisodeSection, ActorSection, TrailerSection, TrendingSection, CommentSection } from '@/components/movie-detail';
import type { FilmDto } from '@/types/FilmDto';
import { Film, Info, LayoutGrid, MessageCircle, MoreHorizontal, Users } from 'lucide-react';
import type { EpisodeDto } from '@/types/EpisodeDto';
import { EpisodesService } from '@/services/EpisodesService';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<FilmDto | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeDto[]>([]);
  const [topFilms, setTopFilms] = useState<FilmDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const fetchFilmDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const filmPromise = FilmService.filmControllerGetOneV1(id);
        const trendingPromise = FilmService.filmControllerGetAll(1, 5);
        const [filmResponse, trendingResponse] = await Promise.all([filmPromise, trendingPromise]);
        setFilm(filmResponse.data);
        setTopFilms(trendingResponse.data);
        if (filmResponse.data.type === 'SERIES') {
          const episodes = (await EpisodesService.episodeControllerGetAllV1({
            filmId: id,
            season: 1
          })).data;
          setEpisodes(episodes);
          setActiveTab('episodes');
        } else {
          setActiveTab('info');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching film detail:', err);
        setError('Không thể tải thông tin phim. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchFilmDetail();
  }, [id]);

  const tabs = useMemo(() => {
    if (!film) return [];
    const baseTabs = [
      { id: 'cast', label: 'Diễn viên', icon: Users },
      { id: 'trailer', label: 'Trailer', icon: Film },
      { id: 'comments', label: 'Bình luận', icon: MessageCircle },
      { id: 'related', label: 'Đề xuất', icon: LayoutGrid }
    ];
    
    if (film.type === 'SERIES') {
      baseTabs.unshift({ id: 'episodes', label: 'Tập phim', icon: MoreHorizontal });
    } else {
       baseTabs.unshift({ id: 'info', label: 'Thông tin', icon: Info });
    }
    return baseTabs;
  }, [film]);

  const renderContent = () => {
    if (!film) return null;

    switch (activeTab) {
      case 'episodes':
        return <EpisodeSection film={film} episodes={episodes}/>;
      case 'cast':
        return <ActorSection actors={film.actors} />;
      case 'trailer':
        return <TrailerSection film={film} />;
      case 'comments':
        return <CommentSection key={`comments-${film.id}`} filmId={film.id} averageRating={film.userRating || 0} />;
      case 'info':
        return (
            <div className="text-gray-300 animate-fade-in bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Thông tin chi tiết</h3>
                <p className="mb-4">{film.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="text-gray-500">Quốc gia:</span> {film.country}</p>
                    <p><span className="text-gray-500">Năm phát hành:</span> {film.releaseDate}</p>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  if (loading || !film) {
    return;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Đã có lỗi xảy ra</h2>
          <p className="text-neutral-400">{error || 'Không tìm thấy phim'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] min-h-screen font-sans selection:bg-yellow-500/30 selection:text-yellow-200 pb-20 text-gray-100">
      <main>
        <MovieHero film={film} />
        <div className="container mx-auto px-4 lg:px-8 -mt-8 relative z-20">
           {/* Dynamic Tab Navigation */}
           <div className="inline-flex bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10 mb-10 overflow-x-auto max-w-full scrollbar-hide">
              {tabs.map((tab) => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap 
                        ${activeTab === tab.id 
                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                 >
                    <tab.icon size={16} />
                    {tab.label}
                 </button>
              ))}
           </div>

           <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 min-w-0">
                 {/* Main Content Render Area */}
                 <div className="min-h-[400px]">
                    {renderContent()}
                 </div>
              </div>

              <TrendingSection topFilms={topFilms} />
           </div>
        </div>
      </main>
    </div>
  );
}
