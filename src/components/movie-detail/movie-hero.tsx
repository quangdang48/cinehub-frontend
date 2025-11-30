import React from 'react';
import { Play, Heart, Plus, Share2, MessageCircle } from 'lucide-react';
import { Button, IconButton, Badge, RatingBadge } from '@/components/common';
import type { FilmDto } from '@/types/FilmDto';

interface MovieHeroProps {
  film: FilmDto;
}

export const MovieHero: React.FC<MovieHeroProps> = ({ film }) => {
  const backdropPoster = film.posters.find(
    (p) => p.type === 'backdrop'
  );
  const thumbnailPoster = film.posters.find(
    (p) => p.type === 'thumbnail'
  );
  const defaultPoster = film.posters.find(
    (p) => p.type === 'default'
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
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Movie Poster and Info */}
          <div className="lg:col-span-2 text-white">
            <div className="flex gap-6 mb-6">
              {/* Movie Poster */}
              <div className="shrink-0">
                <img
                  src={thumbnailPoster?.url || defaultPoster?.url || '/placeholder.jpg'}
                  alt={film.title}
                  className="w-44 h-64 object-cover rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-1">
                  {film.title}
                </h1>
                <p className="text-yellow-500 text-sm mb-4">{film.title}</p>

                {/* Meta Info - Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {film.genres.map((genre) => (
                    <Badge key={genre.id}>{genre.name}</Badge>
                  ))}
                  <Badge>{new Date(film.releaseDate).getFullYear()}</Badge>
                  <Badge>PG</Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-neutral-300 text-sm leading-relaxed line-clamp-4">
                {film.description}
              </p>
            </div>

            {/* Additional Info - Meta data */}
            <div className="text-sm space-y-2">
              <div className="flex">
                <span className="font-semibold text-white w-32">Thể loại:</span>
                <span className="text-neutral-400">
                  {film.genres.map(g => g.name).join(', ')}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-white w-32">Năm phát hành:</span>
                <span className="text-neutral-400">
                  {new Date(film.releaseDate).getFullYear()}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-white w-32">Lượt xem:</span>
                <span className="text-neutral-400">
                  {film.views.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons and Rating */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-lg p-6 space-y-6 lg:sticky lg:top-24 z-10">
              {/* Watch Now Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                <Play size={20} fill="currentColor" />
                Xem Ngay
              </Button>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-4 gap-2">
                <IconButton
                  icon={<Heart />}
                  label="Yêu thích"
                  showLabel
                  size="md"
                  variant="default"
                  className="flex-col group"
                  title="Yêu thích"
                />
                <IconButton
                  icon={<Plus />}
                  label="Thêm vào"
                  showLabel
                  size="md"
                  variant="default"
                  className="flex-col group"
                  title="Thêm vào danh sách"
                />
                <IconButton
                  icon={<Share2 />}
                  label="Chia sẻ"
                  showLabel
                  size="md"
                  variant="default"
                  className="flex-col group"
                  title="Chia sẻ"
                />
                <IconButton
                  icon={<MessageCircle />}
                  label="Bình luận"
                  showLabel
                  size="md"
                  variant="default"
                  className="flex-col group"
                  title="Bình luận"
                />
              </div>

              {/* Rating Section */}
              <div className="border-t border-neutral-800 pt-6 flex justify-center">
                <RatingBadge rating={film.imdbRating} size="md" showLabel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
