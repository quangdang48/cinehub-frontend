import { FilmService } from "@/services/FilmService";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  HeroSlider,
  CarouselSection,
  RankingCard,
  SimpleCard,
  WideCard,
  MoviePreviewModal,
  type ModalPosition,
} from "@/components";
import { useCarouselData } from "@/hooks";
import type { FilmDto } from "@/types/FilmDto";

export default function Home() {
  const heroFilms = useCarouselData<FilmDto>(
    FilmService.filmControllerGetAll,
    5,
    '{"views":"DESC"}',
  );
  const mostViewMovies = useCarouselData<FilmDto>(
    FilmService.filmControllerGetAll,
    20,
    '{"views":"DESC"}',
  );
  const latestReleaseMovies = useCarouselData<FilmDto>(
    FilmService.filmControllerGetAll,
    20,
    '{"releaseDate":"DESC"}',
  );
  const newTrendingMovies = useCarouselData<FilmDto>(
    FilmService.filmControllerGetAllUpcoming,
  );

  const [hoveredRankingId, setHoveredRankingId] = useState<string | null>(null);
  const [modalData, setModalData] = useState<FilmDto | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(
    null,
  );
  const timerRef = useRef<number | null>(null);

  const handleWindowScroll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setModalData(null);
    setHoveredRankingId(null);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [handleWindowScroll]);

  // 1. Hàm handle chung: Chỉ lo việc tính toán vị trí và hiện modal sau 800ms
  const handleDelayedModalEnter = (
    movie: FilmDto,
    targetElement: HTMLElement,
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const rect = targetElement.getBoundingClientRect();
    timerRef.current = setTimeout(() => {
      const width = 320;
      const left = rect.left + rect.width / 2 - width / 2;
      const safeLeft = Math.max(
        10,
        Math.min(window.innerWidth - width - 10, left),
      );

      setModalPosition({
        top: rect.top - 20,
        left: safeLeft,
        width: width,
      });
      setModalData(movie);
    }, 800);
  };
  const onRankingEnter = (
    movie: FilmDto,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    setHoveredRankingId(movie.id);
    handleDelayedModalEnter(movie, event.currentTarget);
  };

  const onSimpleEnter = (
    movie: FilmDto,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
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

  const handleScrollStart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setModalData(null);
    setHoveredRankingId(null);
  };

  return (
    <main className="min-h-screen bg-black">
      <HeroSlider films={heroFilms.items} loading={heroFilms.loading} />
      <div className="max-w-[1800px] mx-auto pt-10 px-10">
        <CarouselSection
          title="Được xem nhiều nhất"
          onLoadMore={mostViewMovies.loadMore}
          loading={mostViewMovies.loading}
          hasMore={mostViewMovies.hasMore}
          onScrollStart={handleScrollStart}
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
          title="Phát hành gần đây"
          onLoadMore={latestReleaseMovies.loadMore}
          loading={latestReleaseMovies.loading}
          hasMore={latestReleaseMovies.hasMore}
          onScrollStart={handleScrollStart}
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
          title="Sắp ra mắt"
          onLoadMore={newTrendingMovies.loadMore}
          loading={newTrendingMovies.loading}
          hasMore={newTrendingMovies.hasMore}
          onScrollStart={handleScrollStart}
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
