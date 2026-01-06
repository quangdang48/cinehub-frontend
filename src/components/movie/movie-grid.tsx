import type React from "react";
import type { FilmDto } from "@/types/FilmDto";
import classNames from "classnames";
import { SimpleCard } from "./simple-card";
import { useRef, useState } from "react";
import { MoviePreviewModal, type ModalPosition } from "./preview-modal";

interface MovieGridProps {
  films: FilmDto[];
  loading?: boolean;
  className?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  films,
  loading = false,
  className,
}) => {
  const [modalData, setModalData] = useState<FilmDto | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(
    null,
  );
  const timerRef = useRef<number | null>(null);

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

  const onSimpleEnter = (
    movie: FilmDto,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    handleDelayedModalEnter(movie, event.currentTarget);
  };

  const handleCardLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleModalLeave = () => {
    setModalData(null);
  };

  if (films.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-neutral-400 text-lg">Không tìm thấy phim nào</div>
        <p className="text-neutral-500 text-sm mt-2">
          Hãy thử thay đổi bộ lọc để xem thêm kết quả
        </p>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6",
        className,
      )}
    >
      {films.map((film, index) => (
        <SimpleCard
          key={`${index}`}
          movie={film}
          onEnter={onSimpleEnter}
          onLeave={handleCardLeave}
          className="2xl:w-[200px] sm:w-[180px]"
        />
      ))}

      {/* Loading skeleton cards */}
      {loading &&
        Array.from({ length: 7 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="animate-pulse">
            <div className="aspect-2/3 w-full bg-neutral-800 rounded-lg" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-neutral-800 rounded w-3/4" />
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      {modalData && modalPosition && (
        <MoviePreviewModal
          movie={modalData}
          position={modalPosition}
          onLeave={handleModalLeave}
        />
      )}
    </div>
  );
};

export default MovieGrid;
