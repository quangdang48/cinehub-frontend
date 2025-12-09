import React, { useEffect, useRef, useState } from 'react';
import { Play, Heart, Plus, Share2, VolumeX, Volume2, Star } from 'lucide-react';
import type { FilmDto } from '@/types/FilmDto';

interface MovieHeroProps {
  film: FilmDto;
}

export const MovieHero: React.FC<MovieHeroProps> = ({ film }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting && isVideoLoaded) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVideoLoaded]);

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
    <div ref={containerRef} className="relative w-full min-h-[90vh] flex items-end pb-12 overflow-hidden group">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 select-none">
        <img 
          src={displayPoster?.url || '/placeholder.jpg'} 
          alt="Backdrop" 
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`} 
        />
      </div>
      <div className="absolute inset-0 z-1 select-none pointer-events-none">
         <video
            ref={videoRef}
            src={"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"}
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
         />
      </div>
      <div className="absolute inset-0 z-2 bg-linear-to-t from-[#020617] via-[#020617]/60 to-transparent"></div>
      <div className="absolute inset-0 z-2 bg-linear-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
      
      {isVideoLoaded && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-24 right-8 z-30 bg-black/40 backdrop-blur-md p-3 rounded-full text-white/70 hover:text-white hover:bg-black/60 transition-all pointer-events-auto border border-white/10"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row gap-10 items-end">
        <div className="hidden md:block w-72 shrink-0 relative group/poster">
          <div className="absolute -inset-1 bg-linear-to-br from-yellow-500 to-orange-600 rounded-xl blur opacity-20 group-hover/poster:opacity-40 transition duration-500"></div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <img src={defaultPoster?.url} alt={film.title} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover/poster:scale-105" />
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">
               Trending #1
            </div>
          </div>
        </div>
        <div className="flex-1 text-white pb-2">
          <div className="flex items-center gap-3 mb-4 animate-fade-in-up">
             <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                <Star size={14} fill="currentColor"/>IMDb {film.imdbRating.toFixed(1)}
             </div>
             <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded border border-white/10">{film.ageLimit}</span>
             <span className="text-gray-400 text-sm font-medium">{new Date(film.releaseDate).getFullYear()}</span>
             <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
             {/* <span className="text-gray-400 text-sm font-medium">{film.duration}</span> */}
             {film.type === 'SERIES' && (
                <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-blue-500/30">Series</span>
             )}
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-2 text-transparent bg-clip-text bg-linear-to-r from-white via-gray-100 to-gray-400 drop-shadow-lg leading-tight">
            {film.title}
          </h1>
          <h2 className="text-2xl text-yellow-500/90 font-medium mb-6 tracking-wide">{film.originalTitle}</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {film.genres.map(genre => (
              <span key={genre.id} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-white/10 hover:text-yellow-400 hover:border-yellow-400/50 cursor-pointer transition-all">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-gray-300 text-base leading-relaxed line-clamp-3 max-w-2xl mb-8 font-light drop-shadow-md">
             {film.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
             <button className="group relative flex items-center justify-center gap-3 bg-linear-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg px-8 py-4 rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Play fill="black" size={20} className="relative z-10" /> 
                <span className="relative z-10">Xem Ngay</span>
             </button>

             <div className="flex items-center gap-3">
                {[
                   { icon: Heart, label: "Thích" },
                   { icon: Plus, label: "DS Xem" },
                   { icon: Share2, label: "Chia sẻ" }
                ].map((item, idx) => (
                  <button key={idx} className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-500/50 hover:text-yellow-400 transition-all group/btn">
                     <item.icon size={20} className="mb-1 group-hover/btn:scale-110 transition-transform"/>
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
};
