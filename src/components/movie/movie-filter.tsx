import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import classNames from "classnames";
import {
  COUNTRY_LIST,
  FILM_TYPES,
  GENRE_LIST,
  RATINGS,
  SORT_OPTIONS,
  YEARS,
  type MovieOptions,
} from "@/constant/movie.const";

export interface FilterOptions {
  country?: string;
  type?: "all" | "movie" | "series";
  rating?: string;
  genre?: string;
  year?: string;
  sortBy?: "newest" | "updated" | "imdb" | "views";
}

interface MovieFilterProps {
  filters: FilterOptions;
  onApply: (newFilters: FilterOptions) => void;
  onClose: () => void;
  className?: string;
}

interface FilterRowProps {
  label: string;
  options: MovieOptions[];
  value: string | undefined;
  onChange: (value: string) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap items-start gap-2 py-3 border-b border-neutral-800 last:border-b-0">
      <span className="w-24 shrink-0 text-sm text-neutral-400 pt-1.5">
        {label}:
      </span>
      <div className="flex flex-wrap gap-2 flex-1">
        {options.map((option) => (
          <button
            key={option.slug || option.value}
            onClick={() => onChange(option.slug || option.value)}
            className={classNames(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              value === option.slug || (option.value === "" && !value)
                ? "bg-yellow-500 text-black font-medium"
                : "text-neutral-300 hover:bg-neutral-700"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const MovieFilter: React.FC<MovieFilterProps> = ({
  filters,
  onApply,
  onClose,
  className,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const handleApplyClick = () => {
    onApply(localFilters);
  };

  return (
    <div
      className={classNames(
        "bg-neutral-900 rounded-lg p-6 border border-neutral-800",
        className
      )}
    >
      {/* Quốc gia */}
      <FilterRow
        label="Quốc gia"
        options={[{ label: "Tất cả", value: "", slug: "" }, ...COUNTRY_LIST]}
        value={localFilters.country || ""}
        onChange={(value) => updateFilter("country", value)}
      />

      {/* Loại phim */}
      <FilterRow
        label="Loại phim"
        options={FILM_TYPES}
        value={localFilters.type || ""}
        onChange={(value) => updateFilter("type", value)}
      />

      {/* Xếp hạng */}
      <FilterRow
        label="Xếp hạng"
        options={RATINGS}
        value={localFilters.rating || ""}
        onChange={(value) => updateFilter("rating", value)}
      />

      {/* Thể loại */}
      <FilterRow
        label="Thể loại"
        options={[{ label: "Tất cả", value: "", slug: "" }, ...GENRE_LIST]}
        value={localFilters.genre || ""}
        onChange={(value) => updateFilter("genre", value)}
      />

      {/* Năm sản xuất */}
      <FilterRow
        label="Năm sản xuất"
        options={YEARS}
        value={localFilters.year || ""}
        onChange={(value) => updateFilter("year", value)}
      />

      {/* Sắp xếp */}
      <FilterRow
        label="Sắp xếp"
        options={SORT_OPTIONS}
        value={localFilters.sortBy || ""}
        onChange={(value) => updateFilter("sortBy", value)}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleApplyClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Lọc kết quả
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-600 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

interface FilterToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
    >
      <Filter size={18} className="text-yellow-400" />
      <span>Bộ lọc</span>
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );
};

export default MovieFilter;