import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface CarouselSectionProps {
  title: string;
  children: React.ReactNode;
  onLoadMore?: () => void;
  loading?: boolean;
  hasMore?: boolean;
  className?: string;
  onScrollStart?: () => void;
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  children,
  onLoadMore,
  loading = false,
  hasMore = true,
  className = "",
  onScrollStart,
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const currentScroll = Math.ceil(scrollLeft);
      setShowLeftArrow(currentScroll > 5);
      setShowRightArrow(currentScroll < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const timer = setTimeout(checkScrollPosition, 200);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      window.removeEventListener("resize", checkScrollPosition);
      clearTimeout(timer);
    };
  }, [children]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    checkScrollPosition();
    onScrollStart?.();
    if (!scrollRef.current || !onLoadMore || !hasMore || loading) return;

    const el = scrollRef.current;

    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth * 0.9;

    if (isAtEnd) {
      onLoadMore();
    }
  };

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = dir === "left" ? -500 : 500;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full mb-10">
      <h2 className="text-4xl font-bold text-white mb-8">{title}</h2>

      {/* Nút điều hướng */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-[55%] -translate-y-1/2 z-30 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white backdrop-blur-sm transition-all duration-300 -ml-2 md:-ml-4 hover:scale-110 shadow-lg shadow-black/50"
        >
          <ChevronLeft size={30} />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-[55%] -translate-y-1/2 z-30 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white backdrop-blur-sm transition-all duration-300 -mr-2 md:-mr-4 hover:scale-110 shadow-lg shadow-black/50"
        >
          <ChevronRight size={30} />
        </button>
      )}

      {/* Vùng scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex gap-8 overflow-x-auto scrollbar-hide py-8 px-2 ${className}`}
      >
        {children}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center min-w-[120px]">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};
