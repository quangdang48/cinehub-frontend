import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FilmService } from '@/services/FilmService';
import type { FilmResponseDto } from '@/types/FilmResponseDto';
import { MovieHero, EpisodeSection, CommentSection } from '@/components/movie-detail';
import Spinner from '@/components/common/Spinner';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<FilmResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilmDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await FilmService.filmControllerGetOneV1(id);
        if (response.data) {
          setFilm(response.data);
        }
      } catch (err) {
        console.error('Error fetching film detail:', err);
        setError('Không thể tải thông tin phim. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilmDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Đã có lỗi xảy ra</h2>
          <p className="text-gray-400">{error || 'Không tìm thấy phim'}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <MovieHero film={film} />
      
      {/* Tabs Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 border-b border-gray-800">
            <button className="py-4 px-2 text-white font-semibold border-b-2 border-yellow-500">
              Tập phim
            </button>
            <button className="py-4 px-2 text-gray-400 hover:text-white transition">
              Gallery
            </button>
            <button className="py-4 px-2 text-gray-400 hover:text-white transition">
              Diễn viên
            </button>
            <button className="py-4 px-2 text-gray-400 hover:text-white transition">
              Đề xuất
            </button>
          </div>
        </div>
      </div>

      <EpisodeSection filmId={film.id} />
      <CommentSection filmId={film.id} />
    </main>
  );
}
