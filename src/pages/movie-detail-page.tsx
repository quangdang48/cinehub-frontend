import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FilmService } from '@/services/FilmService';
import type { FilmResponseDto } from '@/types/FilmResponseDto';
import { MovieHero, EpisodeSection, CommentSection } from '@/components/movie-detail';
import { TabNavigation } from '@/components/common';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<FilmResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('episodes');

  const tabs = [
    { id: 'episodes', label: 'Tập phim' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'cast', label: 'Diễn viên' },
    { id: 'recommendations', label: 'Đề xuất' },
  ];

  // Scroll to top when page loads or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchFilmDetail = async () => {
      if (!id) return;

      try {
        const response = await FilmService.filmControllerGetOneV1(id);
        if (response.data) {
          setFilm(response.data);
        }
      } catch (err) {
        console.error('Error fetching film detail:', err);
        setError('Không thể tải thông tin phim. Vui lòng thử lại sau.');
      }
    };

    fetchFilmDetail();
  }, [id]); 

  if (error || !film) {
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
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <MovieHero film={film} />
      
      {/* Tabs Navigation */}
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        sticky={false}
      />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'episodes' && <EpisodeSection filmId={film.id} />}
        {activeTab === 'gallery' && (
          <div className="bg-neutral-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <p className="text-neutral-400">Tính năng Gallery đang được phát triển...</p>
            </div>
          </div>
        )}
        {activeTab === 'cast' && (
          <div className="bg-neutral-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <p className="text-neutral-400">Tính năng Diễn viên đang được phát triển...</p>
            </div>
          </div>
        )}
        {activeTab === 'recommendations' && (
          <div className="bg-neutral-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <p className="text-neutral-400">Tính năng Đề xuất đang được phát triển...</p>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <CommentSection filmId={film.id} />
    </main>
  );
}
