import React from 'react';
import type { FilmResponseDto } from '@/types/FilmResponseDto';
import { Button } from '../common/button';
import { PosterDto } from '@/types/PosterDto';

interface MovieHeroProps {
  film: FilmResponseDto;
}

export const MovieHero: React.FC<MovieHeroProps> = ({ film }) => {
  const backdropPoster = film.posters.find(
    (p) => p.type === PosterDto.type.BACKDROP
  );
  const thumbnailPoster = film.posters.find(
    (p) => p.type === PosterDto.type.THUMBNAIL
  );
  const defaultPoster = film.posters.find(
    (p) => p.type === PosterDto.type.DEFAULT
  );

  const displayPoster = backdropPoster || defaultPoster || thumbnailPoster;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${displayPoster?.url || '/placeholder.jpg'})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Movie Poster and Info */}
          <div className="lg:col-span-2 text-white">
            <div className="flex gap-6 mb-6">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <img
                  src={thumbnailPoster?.url || defaultPoster?.url || '/placeholder.jpg'}
                  alt={film.title}
                  className="w-[180px] h-[270px] object-cover rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-1">
                  {film.title}
                </h1>
                <p className="text-yellow-500 text-sm mb-4">{film.title}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-4 text-xs">
                  <span className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300">
                    Kỳ Ảo
                  </span>
                  <span className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300">
                    Bí Ẩn
                  </span>
                  {film.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300">
                    Giây Cấm
                  </span>
                  <span className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300">
                    Tâm Lý
                  </span>
                  <span className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300">
                    {new Date(film.releaseDate).getFullYear()}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300">
                    PG
                  </span>
                  <span className="px-2.5 py-1 bg-gray-800/80 rounded text-gray-300">
                    1h 56m
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                {film.description}
              </p>
            </div>

            {/* Additional Info */}
            <div className="text-sm space-y-2">
              <div className="flex">
                <span className="font-semibold text-white w-32">Cảnh Kịch:</span>
                <span className="text-gray-400">Hành Động</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-white w-32">Hãm Bóng:</span>
                <span className="text-gray-400">Phim Truyền Hình</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-white w-32">Cố Vấn:</span>
                <span className="text-gray-400">Cổ Hiệp</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-white w-32">Thần Tiên:</span>
                <span className="text-gray-400">Cổ Tích</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-white w-32">Phiêu Lưu:</span>
                <span className="text-gray-400">Võ Hiệp</span>
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons and Rating */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 space-y-6 sticky top-24">
              {/* Watch Now Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Xem Ngay
              </Button>

              {/* Action Buttons Row */}
              <div className="flex justify-center gap-3">
                <button 
                  className="flex flex-col items-center gap-1 p-3 hover:bg-gray-800/50 rounded-lg transition group"
                  title="Yêu thích"
                >
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-red-500 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 group-hover:text-white">Yêu thích</span>
                </button>
                <button 
                  className="flex flex-col items-center gap-1 p-3 hover:bg-gray-800/50 rounded-lg transition group"
                  title="Thêm vào"
                >
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 group-hover:text-white">Thêm vào</span>
                </button>
                <button 
                  className="flex flex-col items-center gap-1 p-3 hover:bg-gray-800/50 rounded-lg transition group"
                  title="Chia sẻ"
                >
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 group-hover:text-white">Chia sẻ</span>
                </button>
                <button 
                  className="flex flex-col items-center gap-1 p-3 hover:bg-gray-800/50 rounded-lg transition group"
                  title="Bình luận"
                >
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 group-hover:text-white">Bình luận</span>
                </button>
              </div>

              {/* Rating Section */}
              <div className="border-t border-gray-800 pt-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 bg-blue-600 px-4 py-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xl font-bold text-white">{film.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-400">Đánh giá</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
