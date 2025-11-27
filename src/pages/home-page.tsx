import { FilmService } from "@/services/FilmService";

import { useState, useRef } from "react";
import { HeroSlider, CarouselSection, RankingCard, SimpleCard, WideCard, MoviePreviewModal, type ModalPosition} from "@/components";
import type { FilmResponseDto } from "@/types/FilmResponseDto";
import { useCarouselData } from "@/hooks";

export default function Home() {
  const mostViewMovies = useCarouselData<FilmResponseDto>(FilmService.filmControllerGetMostViewedV1);
  const latestReleaseMovies = useCarouselData<FilmResponseDto>(FilmService.filmControllerGetByReleaseV1);
  const newTrendingMovies = useCarouselData<FilmResponseDto>(FilmService.filmControllerGetByReleaseV1);


  const [hoveredRankingId, setHoveredRankingId] = useState<string | null>(null);
  const [modalData, setModalData] = useState<FilmResponseDto | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null);
  const timerRef = useRef<number | null>(null);

  // 1. Hàm handle chung: Chỉ lo việc tính toán vị trí và hiện modal sau 800ms
  const handleDelayedModalEnter = (movie: FilmResponseDto, targetElement: HTMLElement) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const rect = targetElement.getBoundingClientRect();
    timerRef.current = setTimeout(() => {
      const width = 320;
      const left = rect.left + (rect.width / 2) - (width / 2);
      const safeLeft = Math.max(10, Math.min(window.innerWidth - width - 10, left));
      
      setModalPosition({
        top: rect.top - 20,
        left: safeLeft,
        width: width,
      });
      setModalData(movie);
    }, 800);
  };
  const onRankingEnter = (movie: FilmResponseDto, event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredRankingId(movie.id);
    handleDelayedModalEnter(movie, event.currentTarget);
  };

  const onSimpleEnter = (movie: FilmResponseDto, event: React.MouseEvent<HTMLDivElement>) => {
    handleDelayedModalEnter(movie, event.currentTarget); 
  };

  const handleCardLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredRankingId(null);
  };

  const handleModalLeave = () => {
    setModalData(null);
    setHoveredRankingId(null);
  };

  return (
    <main className="min-h-screen bg-black">
      <HeroSlider films={mostViewMovies.items} loading={mostViewMovies.loading} />
      <div className="max-w-[1800px] mx-auto pt-10 px-10">
        <CarouselSection
          title="Most Viewed"
          onLoadMore={mostViewMovies.loadMore}
          loading={mostViewMovies.loading}
          hasMore={mostViewMovies.hasMore}
        >
          {mostViewMovies.items.map((movie, idx) => (
            <RankingCard
              index={idx}
              key={idx}
              movie={movie}
              hoveredId={hoveredRankingId}
              onEnter={onRankingEnter}
              onLeave={handleCardLeave}
            />
          ))}
        </CarouselSection>
        <CarouselSection
          title="Latest Releases"
          onLoadMore={latestReleaseMovies.loadMore}
          loading={latestReleaseMovies.loading}
          hasMore={latestReleaseMovies.hasMore}
        >
          {latestReleaseMovies.items.map((movie, idx) => (
            <SimpleCard
              key={idx}
              movie={movie}
              onEnter={onSimpleEnter}
              onLeave={handleCardLeave}
            />
          ))}
        </CarouselSection>
        <CarouselSection
          title="New Trending"
          onLoadMore={newTrendingMovies.loadMore}
          loading={newTrendingMovies.loading}
          hasMore={newTrendingMovies.hasMore}
        >
          {newTrendingMovies.items.map((movie, idx) => (
            <WideCard
              key={idx}
              movie={movie}
              onEnter={onSimpleEnter}
              onLeave={handleCardLeave}
            />
          ))}
        </CarouselSection>
      </div>
      {modalData && modalPosition && (
        <MoviePreviewModal 
          movie={modalData}
          position={modalPosition}
          onLeave={handleModalLeave}
        />
      )}

      {/* <FAQSection /> */}
    </main>
  );
}
